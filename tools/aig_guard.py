"""Minimal AI Guard client: plain JSON to the tenant, no SDK serialisation.

The SDK's `update_policy` returns 400 invalid_argument on payloads that are
accepted verbatim over HTTP — its model serialisation drops configuration keys
before they reach the wire. One authenticated session plus `requests` removes
that variable, so a 400 here means the tenant genuinely rejected the config.
"""
import json
import os
import subprocess

import requests

BASE = "https://api.zsapi.net"
DAS = "https://api.zseclipse.net"


def _secret(k):
    r = subprocess.run(["/root/.hermes/bin/get_secret", k], capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else None


def oneapi_headers():
    for k in ("ZSCALER_CLIENT_ID", "ZSCALER_CLIENT_SECRET", "ZSCALER_CUSTOMER_ID", "ZSCALER_VANITY_DOMAIN"):
        v = _secret(k)
        if v:
            os.environ.setdefault(k, v)
    from zscaler.oneapi_client import Client
    c = Client({})
    c.authenticate()
    h = c.get_request_executor().get_default_headers()
    return {"Authorization": h["Authorization"], "Content-Type": "application/json",
            "Accept": "application/json"}


def das_key():
    k = _secret("AIG_DAS_API_KEY")
    if not k:
        raise SystemExit("no AIG_DAS_API_KEY in vault")
    return k


def get_policy(pid, h=None):
    h = h or oneapi_headers()
    r = requests.get(f"{BASE}/aiguard/v1/detections/policies/{pid}", headers=h, timeout=60)
    r.raise_for_status()
    b = r.json()
    return b[0] if isinstance(b, list) else b


def put_policy(pid, inputs, outputs, h=None, name=None, description=None):
    """Full replace. Returns (ok, response dict or error text)."""
    h = h or oneapi_headers()
    cur = get_policy(pid, h)
    body = {
        "name": name or cur["name"],
        "version": cur["version"],
        "description": description if description is not None else (cur.get("description") or ""),
        "inputDetectorPolicies": inputs,
        "outputDetectorPolicies": outputs,
    }
    r = requests.put(f"{BASE}/aiguard/v1/detections/policies/{pid}", headers=h, json=body, timeout=60)
    if r.status_code != 200:
        return False, f"{r.status_code} {r.text[:300]}"
    return True, r.json()


def execute(pid, direction, content, key=None):
    key = key or das_key()
    r = requests.post(f"{DAS}/v1/detection/execute-policy",
                      headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                      json={"direction": direction, "policyId": pid, "content": content},
                      timeout=60)
    return r.status_code, (r.json() if r.content else {})


def firing(body):
    out = []
    for det, v in (body.get("detectorResponses") or {}).items():
        v = v or {}
        d = v.get("details") or {}
        top = d.get("topScore")
        out.append({"detector": det, "action": v.get("action"), "triggered": v.get("triggered"),
                    "score": top, "sub": d.get("subCategory")})
    out.sort(key=lambda x: (x["score"] is None, -(x["score"] or 0)))
    return out
