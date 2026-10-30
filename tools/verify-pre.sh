#!/bin/bash
# Verify the PREVIEW deployment and leave a receipt the prod deploy will insist on.
#
# Runs both audits against pre-demo.example.com, which uses the PREVIEW policies
# (1011/1012/1013) and the PREVIEW database. Writes .pre-verify.json next to the
# project root; scripts/deploy-prod.mjs refuses to promote while that file is
# missing, red, stale, or built from a different commit.
#
#   npm run verify:pre
#
# Exit 0 only when both audits pass.
set -uo pipefail
cd "$(dirname "$0")/.."

BASE="${PRE_BASE:-https://pre-demo.example.com}"
export DEMO_BASE="$BASE"
export DEMO_PASSWORD_SECRET="DEMO_PASSWORD_PRE"
export POLICY_MAP="${POLICY_MAP:-1001:1011,1002:1012,1003:1013}"

echo "verifying $BASE"
echo "  policies: $POLICY_MAP (preview clones)"
curl -s -o /dev/null -w "  reachable: HTTP %{http_code}\n" "$BASE/" || true

cd tools
env -u PYTHONPATH python3 cue_audit.py > ../.pre-cue.log 2>&1
CUE_EXIT=$?
env -u PYTHONPATH python3 policy_adversarial.py > ../.pre-adversarial.log 2>&1
ADV_EXIT=$?
cd ..

CUE_LINE=$(grep -E "of [0-9]+ cues match" .pre-cue.log | tail -1)
CUE_PASS=$(echo "$CUE_LINE" | sed -E 's/^([0-9]+) of ([0-9]+).*/\1/' )
CUE_TOTAL=$(echo "$CUE_LINE" | sed -E 's/^([0-9]+) of ([0-9]+).*/\2/')
ADV_LINE=$(grep -E "of [0-9]+ as expected" .pre-adversarial.log | tail -1)
ADV_OK=$(echo "$ADV_LINE" | sed -E 's/^([0-9]+) of.*/\1/')
ADV_TOTAL=$(echo "$ADV_LINE" | sed -E 's/^[0-9]+ of ([0-9]+).*/\1/')
: "${ADV_OK:=0}"; : "${ADV_TOTAL:=0}"
# The tool reports PASSES ("N of M as expected"); the receipt and the log line report
# failures, so the subtraction happens once, here, rather than being eyeballed.
ADV_BAD=$(( ADV_TOTAL - ADV_OK ))

: "${CUE_PASS:=0}"; : "${CUE_TOTAL:=0}"; : "${ADV_BAD:=999}"; : "${ADV_TOTAL:=0}"
COMMIT=$(git rev-parse --short HEAD)
AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Three outcomes per audit, not two:
#   0  everything matched
#   1  a case failed EVERY attempt — a real regression, blocks promotion
#   2  the environment could not answer (quota, credentials, connectivity)
#   3  every failure was flaky — AI Guard's own scoring varies, so this is advisory
#
# Treating 3 as a blocker was wrong: the same prompt returned different verdicts minutes
# apart with nothing changed, which makes a red run meaningless and trains people to ignore it.
INFRA=false
if [ "$CUE_EXIT" -eq 2 ]; then INFRA=true; fi

ADVISORY=false
if [ "$CUE_EXIT" -eq 3 ] || [ "$ADV_EXIT" -eq 3 ]; then ADVISORY=true; fi

OK=false
if { [ "$CUE_EXIT" -eq 0 ] || [ "$CUE_EXIT" -eq 3 ]; } \
   && { [ "$ADV_EXIT" -eq 0 ] || [ "$ADV_EXIT" -eq 3 ]; }; then OK=true; fi

python3 - "$BASE" "$COMMIT" "$AT" "$CUE_EXIT" "$CUE_PASS" "$CUE_TOTAL" \
         "$ADV_EXIT" "$ADV_BAD" "$ADV_TOTAL" "$OK" "$INFRA" "$ADVISORY" <<'PY'
import json, sys
base, commit, at, ce, cp, ct, ae, ab, at2, ok, infra, advisory = sys.argv[1:13]
receipt = {
    "at": at, "base": base, "commit": commit,
    "cue": {"exit": int(ce), "passed": int(cp), "total": int(ct)},
    "adversarial": {"exit": int(ae), "bad": int(ab), "total": int(at2)},
    "ok": ok == "true",
    "infra_error": infra == "true",
    "advisory_only": advisory == "true",
}
json.dump(receipt, open(".pre-verify.json", "w"), indent=2)
print(json.dumps(receipt, indent=2))
PY

echo
echo "cue:         $CUE_PASS of $CUE_TOTAL (exit $CUE_EXIT)  -> .pre-cue.log"
echo "adversarial: $ADV_BAD of $ADV_TOTAL not as expected (exit $ADV_EXIT)  -> .pre-adversarial.log"
if [ "$INFRA" = "true" ]; then
    echo "PREVIEW UNHEALTHY — the environment could not answer (quota, credentials or" >&2
    echo "connectivity). This is not a policy result. Production deploy will refuse." >&2
    exit 2
fi
if [ "$OK" = "true" ]; then
    if [ "$ADVISORY" = "true" ]; then
        echo "PREVIEW GREEN with advisory noise — some checks varied between attempts and are"
        echo "reported, not enforced. Production deploy is allowed within 6 hours, from this commit."
    else
        echo "PREVIEW GREEN — npm run deploy:prod is now allowed within 6 hours, from this commit."
    fi
    exit 0
fi
echo "PREVIEW RED — a check failed every attempt, so this is a real regression." >&2
echo "Production deploy will refuse. Fix the failures above first." >&2
exit 1
