#!/usr/bin/env python3
"""Replay every presenter cue and assert all three claims a note makes: verdict, which
side blocked, and which detector did it.

A note that says "blocks on the response side, topic" is three facts. The earlier audit
checked only the first, which is how eight notes stayed wrong about the other two while
every run passed.

expect grammar:
    allow                     the prompt is answered
    block:<side>[:detector]   blocked on that side, by that detector (side: prompt|response)

  python cue_audit.py            # end to end against the demo: verdict + side + detector
  python cue_audit.py --tenant   # Detection API only: verdict (+ detector), no password

Side and detector only exist on a real interaction, so the default path drives
/api/chat; the tenant mode is the fast check when the demo is not deployed.

EXIT CODES — the gate needs three outcomes, not two
    0  every cue matched
    1  a cue failed EVERY attempt: a real regression, blocks promotion
    2  the environment could not answer (quota, credentials, connectivity): not a policy
       verdict at all
    3  every failure was FLAKY — it passed on retry — so the check is advisory

Why 3 exists: AI Guard's topic scoring is not deterministic. The same prompt against the
same policy returned 0 of 46 then 1 of 46 on the adversarial set minutes apart, with
temperature already 0 on the model. A cue that fails once and passes on retry is therefore
noise, and treating it as a hard failure trains everyone to ignore a red run.
"""
import json
import os
import re
import subprocess
import sys

import requests

import aig_guard as aig

BASE = os.environ.get("DEMO_BASE", "https://demo.example.com")
SITES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "shared", "sites.ts")
POLICY = {"dro": 1001, "mountdis": 1002}
APP = {"dro": "dro-public", "mountdis": "mtdis-public"}
DETECTORS = ("topic", "pattern", "prompt_injection", "personal_data",
             "brand_and_reputation_risk", "legal_advice", "finance_advice", "gibberish")

# How many extra attempts a FAILING cue gets before it counts as a regression. Two retries
# is enough to separate "always fails" from "flakes": a cue that fails 3 times in a row is
# not noise, and retrying every passing cue instead would triple the neuron cost of a run.
RETRIES = int(os.environ.get("CUE_RETRIES", "2"))

# Every cue in a site, whether or not it carries an expectation, so that a cue the
# expectation grammar cannot parse is REPORTED instead of silently skipped.
ANY_CUE = re.compile(
    r"""\{ label: ("(?:[^"\\]|\\.)*"),\s*prompt: ("(?:[^"\\]|\\.)*")""",
    re.S,
)

# The expectation grammar. The character class includes `_`: without it every cue
# expecting `prompt_injection` was dropped from the audit without a word — and those
# were the two hardest cases in the site ("Jailbreak in a pasted submission", "Brand
# damage attempt"). 37 cues ran while the docs claimed 39.
CUE = re.compile(
    r"""\{ label: ("(?:[^"\\]|\\.)*"),\s*prompt: ("(?:[^"\\]|\\.)*"),\s*note: """
    r"""("(?:[^"\\]|\\.)*")[^}]*?expect: '([a-z:._-]+)'""",
    re.S,
)


def password():
    """The shared password for the environment being audited.

    The preview deployment has its own password, so the vault key is selectable:
    `DEMO_PASSWORD_SECRET=DEMO_PASSWORD_PRE` for the pre-deploy run.
    """
    key = os.environ.get("DEMO_PASSWORD_SECRET", "DEMO_PASSWORD")
    return subprocess.run(["/root/.hermes/bin/get_secret", key],
                          capture_output=True, text=True).stdout.strip()


def cues():
    src = open(SITES).read()
    head, tail = src.split("MOUNTDIS_PUBLIC", 1)
    for site, part in (("dro", head), ("mountdis", tail.split("const DESKTOP_LLM")[0])):
        for label, prompt, note, expect in CUE.findall(part):
            yield site, json.loads(label), json.loads(prompt), json.loads(note), expect


def judge(expect, verdict, side, fired):
    """`fired` is the SET of detector names that actually fired on the deciding side.

    A note that says "blocks on the response side, topic" is three claims, and each is
    asserted separately — the earlier audit checked only the verdict, which is how eight
    notes stayed wrong about the other two while every run passed.
    """
    want = expect.split(":")
    if want[0] == "allow":
        return verdict == "allowed"
    if verdict != "blocked":
        return False
    if len(want) > 1 and want[1] in ("prompt", "response") and side != want[1]:
        return False
    if len(want) > 2 and want[2] not in fired:
        return False
    return True


def run_cue(session, offline, site, prompt):
    """One attempt. Returns (verdict, side, fired, interaction)."""
    if offline:
        code, body = aig.execute(POLICY[site], "IN", prompt)
        verdict = "blocked" if body.get("action") == "BLOCK" else "allowed"
        side = "prompt" if verdict == "blocked" else None
        # `triggered` only: `action: BLOCK` with triggered false is the policy's
        # default action, not a detection.
        fired = {f["detector"] for f in aig.firing(body) if f["triggered"] is True}
        return verdict, side, fired, {}
    j = session.post(f"{BASE}/api/chat",
                     json={"appId": APP[site], "prompt": prompt, "guard": True},
                     timeout=120).json()["interaction"]
    verdict, side = j["verdict"], j.get("blockedSide")
    # Read the detector from the recorded structure, never by finding a name in
    # the human-readable message: a substring hit passed a note whenever its
    # detector was mentioned anywhere in the prose, including as a bystander.
    roll = ((j.get("detectors") or {}).get("in" if side == "prompt" else "out") or [])
    fired = {d.get("name") for d in roll
             if (d.get("action") or "").upper().startswith("BLOCK")}
    return verdict, side, fired, j


def main():
    offline = "--tenant" in sys.argv
    session = None
    if not offline:
        session = requests.Session()
        session.post(f"{BASE}/api/auth", json={"password": password()}, timeout=30)

    # Completeness first: a cue the parser cannot read must fail the audit loudly, not
    # vanish. That silence is how two cues went unaudited while the docs claimed all 39.
    src_sites = open(SITES).read()
    head_all, tail_all = src_sites.split("MOUNTDIS_PUBLIC", 1)
    all_cues = []
    for site, part in (("dro", head_all), ("mountdis", tail_all.split("const DESKTOP_LLM")[0])):
        for m in ANY_CUE.finditer(part):
            all_cues.append((site, json.loads(m.group(1)), json.loads(m.group(2))))
    planned = list(cues())
    if len(planned) != len(all_cues):
        audited = {c[2] for c in planned}
        print(f"PARSE FAILURE: {len(all_cues) - len(planned)} of {len(all_cues)} cues are not "
              f"auditable. Fix the CUE grammar before trusting any result:")
        for site, label, prompt in all_cues:
            if prompt not in audited:
                print(f"  UNAUDITED  {site} / {label}")
        return 1

    failures = []
    total = 0
    skipped = 0
    errors_in_a_row = 0
    for site, label, prompt, note, expect in cues():
        # The tenant mode makes ONE prompt-direction call. A cue that claims a
        # response-side block cannot be tested here at all, so it is reported as SKIP
        # rather than counted as a failure — the earlier behaviour made `--tenant` exit
        # 1 on six untestable cues every run, which trains everyone to ignore it.
        if offline and expect.startswith("block:response"):
            skipped += 1
            print(f"skip {site:<9} {label[:30]:<30} want={expect:<30} "
                  f"not testable without a model answer (use the e2e run)")
            continue
        total += 1
        verdict, side, fired, j = run_cue(session, offline, site, prompt)
        # `error` means the environment could not answer at all (quota exhausted, AI Guard
        # unreachable, bad credential). That is an infrastructure state, not a policy
        # mismatch, and continuing burns minutes to produce a list that says nothing about
        # the policies. Three in a row and the run stops with exit 2.
        if verdict == "error":
            errors_in_a_row += 1
            if errors_in_a_row >= 3:
                print(f"\nENVIRONMENT UNHEALTHY after {total} cue(s): the application cannot "
                      f"reach AI Guard or the model, so no verdict is a policy verdict.")
                print(f"  last message: {(j.get('blockMessage') or '')[:300]}")
                print("  fix the environment (quota, credentials, connectivity) and re-run.")
                return 2
        else:
            errors_in_a_row = 0
        ok = judge(expect, verdict, side, fired)
        if not ok:
            failures.append((site, label, prompt, expect, verdict, side, fired))
        print(f"{'ok  ' if ok else 'FAIL'} {site:<9} {label[:30]:<30} want={expect:<30} "
              f"got={verdict}/{side}/{','.join(sorted(x for x in fired if x)) or '-'}")

    # Retry the failures. A cue that fails every attempt is a regression; one that passes
    # on retry is the guard's own scoring noise, and must not block a promotion.
    stable, flaky = [], []
    for site, label, prompt, expect, verdict, side, fired in failures:
        passed_on_retry = False
        for attempt in range(RETRIES):
            v2, s2, f2, _ = run_cue(session, offline, site, prompt)
            if judge(expect, v2, s2, f2):
                passed_on_retry = True
                print(f"  retry {attempt + 1} of {site} / {label}: PASSED "
                      f"({v2}/{s2}/{','.join(sorted(x for x in f2 if x)) or '-'}) -> flaky")
                break
            print(f"  retry {attempt + 1} of {site} / {label}: still "
                  f"{v2}/{s2}/{','.join(sorted(x for x in f2 if x)) or '-'}")
        (flaky if passed_on_retry else stable).append(
            (site, label, expect, verdict, side, fired))

    print(f"\n{total - len(failures)} of {total} cues match the demo on the first attempt"
          + (f"  ({skipped} response-side cues skipped — not testable here)" if skipped else ""))
    for site, label, expect, verdict, side, fired in stable:
        print(f"  REGRESSION {site} / {label}: want {expect}, got {verdict}/{side}/"
              f"{','.join(sorted(x for x in fired if x)) or '-'} on every attempt")
    for site, label, expect, verdict, side, fired in flaky:
        print(f"  UNSTABLE   {site} / {label}: want {expect}, first attempt "
              f"{verdict}/{side}/{','.join(sorted(x for x in fired if x)) or '-'}, passed on retry")
    if stable:
        return 1
    if flaky:
        print("\nAdvisory only: every failure was flaky. Not a promotion blocker.")
        return 3
    return 0


if __name__ == "__main__":
    sys.exit(main())
