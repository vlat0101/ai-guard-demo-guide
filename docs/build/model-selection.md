# Model selection by measurement

*Swept 2026-10-22 02:30–11:10 UTC against `pre-demo.example.com`. Raw: `tools/last-model-sweep.json`.
Re-run: `python3 tools/model_sweep.py`. Cost: ~1,900 neurons across three passes.*

## Constraint

**Input rate ≤ 5,000 neurons per million input tokens**, and among those the model that *refuses
least* on this demo's own questions, because a model that refuses makes AI Guard look like the thing
refusing. Rambling is disqualifying.

## Two mistakes that made the first two passes worthless

1. **The probe sent its own system prompt, bypassing retrieval.** The app grounds every answer with
   `src/shared/knowledge.ts` — site pages plus the deliberately over-broad internal records. A probe
   that passes a generic "helpful assistant" prompt measures the prompt, not the model, and every
   candidate looked ignorant and refused the patient questions. Fixed by passing `appId`, so the
   probe builds the assistant's real prompt. The endpoint's own comment already warned about this.
2. **The grader called length rambling.** With retrieval in the prompt, a good answer to "how do I
   lodge an objection" is a long numbered list. It also scored "call 000" — the *correct* answer to
   the chest-pain cue — as a refusal, and "I'm a fictional assistant and don't have access" as an
   ANSWER. Fixed: rambling is repetition or runaway length (>3,500 chars); emergency advice counts
   as an answer.

Both are fixed in `model_sweep.py`; the third pass is the one below.

## Results — real prompt, 15 cases each

| model | in/M | answer | hedge | refuse | blank | median | neurons/15 |
|---|---|---|---|---|---|---|---|
| `@cf/ibm-granite/granite-4.0-h-micro` | **1,542** | 15 | 0 | 0 | 0 | 2,350 ms | **41.8** |
| `@cf/meta/llama-3.2-1b-instruct` | 2,457 | 15 | 0 | 0 | 0 | 732 ms | 70.2 |
| `@cf/meta/llama-3.1-8b-instruct-fp8-fast` | 4,119 | 15 | 0 | 0 | 0 | 1,181 ms | 137.4 |
| `@cf/meta/llama-3.2-3b-instruct` | 4,625 | 14 | 1 | 0 | 0 | 887 ms | 131.8 |
| `@cf/qwen/qwen3-30b-a3b-fp8` | 4,625 | 15 | 0 | 0 | 0 | 3,458 ms | 285.4 |

**No candidate refuses anything** once the real prompt is in play. The premise that a cheap model
would refuse the demo's questions was wrong, and the 70B's documented advantage was measured against
the same broken probe.

Accuracy, checked by hand against the records: granite, 1b and 8b quote the internal café budget
exactly ($2.4m spent against $900k). **1b invented a bed number** ("bed 15" where the record says 12);
3b announced the figures were "confidential", doing the guard's job for it; granite is the only one
that keeps the fiction straight where others cite real agencies (NSW Health, Queensland Government,
City of Ryde).

## Why the cheapest model is not simply the answer

Response-side cues fire on **what the model writes**. A model that declines to disclose leaves nothing
for the output detector to catch, so the guard passes a prompt it should have blocked.

| model on preview | cue result | failure mode |
|---|---|---|
| granite-4.0-h-micro | 36/39 | 3 false negatives — never says the sensitive thing ("*unable to provide… migration issue*") |
| llama-3.1-8b-fast | 36/39 | 2 **false positives** (benign answers blocked) + 1 false negative |
| llama-3.3-70b-fast (prod) | 36/39 | 3 false negatives, a different three |

Each model fails a different set. **So preview must run the same model as production**, or the gate
validates behaviour the customer never sees. `wrangler.toml` now pins both to the 70B with that
reason recorded. Model choice is a both-environments decision, not a preview experiment.

## The finding that outranks the model choice

The same prompt against the same policy returned **different verdicts on different runs** — the
adversarial set scored 0 of 46 not-as-expected, then 1 of 46 minutes later with nothing changed
(`emergency when`: should allow, blocked). Temperature is already 0 on the model paths, so this
non-determinism is in AI Guard's own topic scoring, not in sampling.

Consequence: a cue audit that depends on response-side detection **cannot be a stable gate**. Either
the gate covers only the deterministic subset (input pattern detections, prompt-side topic cases with
a clear margin) and reports the rest as advisory, or it accepts a documented tolerance. Right now it
is neither — which is why preview is red, and it has nothing to do with the model.

## Decision — 2026-10-22: stay on the larger model

Measured against the middle of the range as well as the bottom, same 15 cases, same prompt:

| model | neurons/15 | per answer | median | answers |
|---|---|---|---|---|
| granite-4.0-h-micro | 42 | 2.8 | 2,350 ms | 15 |
| llama-3.2-1b | 70 | 4.7 | 732 ms | 15 |
| llama-3.1-8b-fast | 137 | 9.2 | 1,181 ms | 15 |
| qwen3-30b | 285 | 19 | 3,458 ms | 15 |
| llama-4-scout-17b | 502 | 33 | 4,305 ms | 15 |
| mistral-small-24b | 572 | 38 | 2,393 ms | 14 |
| **llama-3.3-70b (kept)** | 839 | 56 | 2,684 ms | 15 |

`gemma-3-12b-it` returned **empty on all 15** — it needs a different request shape and is not
usable as-is.

There is a middle band, but it does not buy what it looks like it buys. The 70B costs **56 neurons an
answer**, which is ~180 answers a day on the free tier; a full 39-question audit is about 2% of the
daily allowance. Moving to granite saves 53 neurons a question — fractions of a cent — in exchange
for the model no longer disclosing, which is precisely the moment the demo exists to show. The
5,000/M cutoff was sound for a production workload and irrelevant at demo volume.

**Both environments therefore stay on `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.** Recorded in
`wrangler.toml` and in the in-app change log, so nobody re-litigates it from the price table.

Also fixed: the discharge-summary money shot asked about **MRN 4471902**, which exists in no fixture —
the customer's real record is `MRN00451238`. The model dutifully replied "I couldn't find a record of
a patient with that MRN", so the tool was testing a question the demo never asks. The prompt now
matches `src/shared/knowledge.ts` and the desktop fixture, and `_assert_identifiers_real()` fails the
sweep if they drift apart again — including the bare-number form that hid the original mistake.

## Superseded recommendation (kept for the audit trail)

The earlier draft recommended switching to granite for a 2.7× input cost saving. That was written
before the middle band was measured and before the volume arithmetic above.


Rejected on evidence: `qwen3-30b` (3.5 s — too slow to read on stage), `llama-3.2-3b` (editorialises,
missed the café figures), `llama-3.2-1b` (fabricated a bed number).

## State of the repo

`wrangler.toml` preview and production both run the 70B. Preview is deployed and reachable; the gate
refuses promotion while the response-side cues are red. Nothing in production's policies, secrets or
code has changed in this pass.
