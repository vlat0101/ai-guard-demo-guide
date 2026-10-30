# Policy exports

Three policies, exported from the lab tenant, with the ids renumbered so they cannot be mistaken for
live ones. These are the reference configuration the method was measured on.

| File | Surface | Policy id | Detectors in | Detectors out |
|---|---|---|---|---|
| `policy-1001.json` | department, public | 1001 | 8 | 4 |
| `policy-1002.json` | health service, public | 1002 | 8 | 4 |
| `policy-1003.json` | shadow-AI desktop | 1003 | 8 | 0 |

The shadow-AI surface has no output detectors on purpose: the request is the thing that leaks, and
the model's own answer is not the organisation's disclosure.

## Shape

```json
{
  "id": 1001,
  "name": "dro-public",
  "version": 19,
  "inputDetectorPolicies": [
    { "detector": "prompt_injection", "enabled": true, "severity": "CRITICAL",
      "configuration": { "...": "detector-specific" } }
  ],
  "outputDetectorPolicies": [ "..." ],
  "description": "..."
}
```

`severity` is what the console renders. `enabled` is what makes it real. `configuration` is where
the threshold, the action, the regex or the topic list lives, and it is different for every detector
family.

## Read these, do not import them

The ids are placeholders. An import against a tenant with existing policies either fails or, worse,
succeeds against the wrong policy.

What these files are for:

- **Reading the configuration shape** before you write anything through the API. The docs describe
  detectors in prose; these show the actual keys.
- **Diffing your own tenant** after tuning. Export, diff, and you can see exactly what a run changed
  and roll back to a known state.
- **Seeing what "tuned" looks like.** Several of these configurations were reached after the wrong
  ones failed, and the difference is instructive: threshold values, a deny-list rather than an
  allow-list, one topic per category with a real definition and a mandatory label.

What they are not: a starting configuration you can push. Detector scores are content-dependent and
model-dependent. A threshold that separated cleanly on this corpus may not separate on yours, and
the only way to know is your own bench. See
[`../method/the-loop.md`](../method/the-loop.md).

## The per-detector notes that matter

- `pattern` is the API identifier for the regex detector, not `text`.
- `topic` requires `defaultAction: ALLOW` for a deny-list, and a `label` on every topic entry.
- `personal_data` needs a low threshold (this tenant uses 0.3) because realistic prose scores in the
  0.39 to 0.48 band. A terse identifier scores 0.00 on it, which is why `pattern` carries identifiers.
- Advisory detectors (`legal_advice`, `finance_advice`, `gibberish`, `brand_and_reputation_risk`) are
  configured as DETECT here. Blocking on a judgement call costs you the meeting.

Full reasoning: [`../method/detectors.md`](../method/detectors.md).

## Exporting your own

`tools/clone_policy.py` is the tool that does this, and it only ever GETs or POSTs. It never PUTs a
production policy.

```bash
python3 tools/clone_policy.py                  # show what would be created
python3 tools/clone_policy.py --apply          # back up each source policy, then create the clones
python3 tools/clone_policy.py --apply --force  # re-create even if a clone exists
```

Before creating anything it writes `docs/policy-backup-<date>-<pid>.json` for each source policy.
That backup is your export. Keep it.

The diff between two exports is the only honest record of what a tuning session did, and it is what
you reach for when a demo that worked last week does not work today. Promotion back onto the
production policy is a separate, reviewed step, deliberately not part of this tool.
