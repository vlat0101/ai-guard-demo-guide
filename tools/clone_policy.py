#!/usr/bin/env python3
"""Clone an AI Guard detection policy into the PREVIEW set.

The demo runs two policy tiers: the customer-facing policies (1001/1002/1003) and a
PREVIEW clone of each that only the preview Worker points at. Tuning happens on the
clone; promotion is an explicit, reviewed copy back onto the production policy.

This tool only ever CREATES a policy (POST) or reads one (GET). It never issues a PUT
against a production id — promotion is `promote_policy.py`, and that one asks.

    python clone_policy.py                 # show what would be created
    python clone_policy.py --apply         # create the clones
    python clone_policy.py --apply --force # re-create even if a clone already exists

Backups of the source policies are written to ../docs/policy-backup-<date>-<pid>.json
before anything is created, so a clone can always be compared against what it came from.
"""
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone

import requests

import aig_guard as aig

BASE = "https://api.zsapi.net"
HERE = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(HERE, "..", "docs")

# production id -> (appId key in AI_GUARD_POLICY_IDS, human label)
SOURCE = {
    1001: ("dro-public", "DRO public assistant"),
    1002: ("mtdis-public", "Mount Disappointment public assistant"),
    1003: ("mtdis-staff", "Shadow-AI desktop (staff application)"),
}

PRE_SUFFIX = " (preview)"


def list_policies(headers):
    r = requests.get(f"{BASE}/aiguard/v1/detections/policies", headers=headers, timeout=60)
    r.raise_for_status()
    body = r.json()
    return body if isinstance(body, list) else body.get("policies", [])


def find_clone(policies, source_name):
    """A clone is a policy whose name is the source name plus the preview suffix."""
    want = source_name + PRE_SUFFIX
    for p in policies:
        if p.get("name") == want:
            return p
    return None


def create_body(src):
    """Only the fields the create endpoint accepts. `version`, ids and timestamps are
    server-owned: sending them back is how a create turns into a 400."""
    return {
        "name": src["name"] + PRE_SUFFIX,
        "description": (src.get("description") or "").strip() or f"Preview clone of {src['name']}",
        "inputDetectorPolicies": src.get("inputDetectorPolicies") or [],
        "outputDetectorPolicies": src.get("outputDetectorPolicies") or [],
    }


def summarise(policy):
    def dets(key):
        out = []
        for d in policy.get(key) or []:
            cfg = d.get("configuration") or {}
            out.append({
                "detector": d.get("detector"),
                "enabled": d.get("enabled"),
                "severity": d.get("severity"),
                "action": cfg.get("action"),
                "defaultAction": cfg.get("defaultAction"),
                "threshold": cfg.get("threshold"),
                "patterns": len(cfg.get("patterns") or cfg.get("regexPatterns") or []),
                "topics": len(cfg.get("topics") or cfg.get("customTopics") or []),
            })
        return out
    return {"in": dets("inputDetectorPolicies"), "out": dets("outputDetectorPolicies")}


def main():
    apply = "--apply" in sys.argv
    force = "--force" in sys.argv
    headers = aig.oneapi_headers()
    existing = list_policies(headers)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")

    results = {}
    for pid, (app_key, label) in SOURCE.items():
        src = aig.get_policy(pid, headers)
        name = src.get("name") or str(pid)

        # 1. back the source up before touching anything
        bak = os.path.join(DOCS, f"policy-backup-{stamp}-{pid}-prod.json")
        with open(bak, "w") as fh:
            json.dump(src, fh, indent=2)
        print(f"{pid} {name!r}: backed up -> {os.path.relpath(bak, HERE)}")

        # 2. does a clone already exist?
        clone = find_clone(existing, name)
        if clone and not force:
            results[app_key] = clone["id"]
            print(f"      clone already exists: {clone['id']} {clone['name']!r} "
                  f"(v{clone.get('version')}) — left alone")
            continue

        body = create_body(src)
        print(f"      clone payload: {len(body['inputDetectorPolicies'])} in / "
              f"{len(body['outputDetectorPolicies'])} out detectors")
        if not apply:
            print("      (dry run — pass --apply to create)")
            continue

        r = requests.post(f"{BASE}/aiguard/v1/detections/policies",
                          headers=headers, json=body, timeout=60)
        if r.status_code not in (200, 201):
            print(f"      CREATE FAILED {r.status_code}: {r.text[:400]}")
            continue
        created = r.json()
        if isinstance(created, list):
            created = created[0]
        new_id = created.get("id")
        results[app_key] = new_id
        print(f"      created id={new_id} v{created.get('version')}")

        # 3. verify the clone reads back with the same detector set
        after = aig.get_policy(new_id, headers)
        before_s, after_s = summarise(src), summarise(after)
        if before_s == after_s:
            print("      verified: detector set and configuration read back identically")
        else:
            print("      WARNING: clone differs from source — compare the backups")
            for side in ("in", "out"):
                if before_s[side] != after_s[side]:
                    print(f"        {side}: {json.dumps(before_s[side])[:300]}")
                    print(f"        {side}: {json.dumps(after_s[side])[:300]}")

    if results:
        print("\nAI_GUARD_POLICY_IDS for the preview env:")
        print("  " + json.dumps(results))
        print("  npx wrangler secret put is NOT needed for vars — set it in wrangler.toml "
              "[env.preview.vars]")
    return 0 if results or not apply else 1


if __name__ == "__main__":
    sys.exit(main())
