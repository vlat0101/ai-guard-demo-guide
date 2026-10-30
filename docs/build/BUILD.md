# BUILD: the agent runbook

Ordered. Every step has a "done when" that you can check, because a step that is done because you
ran a command is not done.

Read [`../method/traps.md`](../method/traps.md) before step 4. Read [`interview.md`](interview.md)
before step 1.

**Standing rules for the whole build**

- Do not deploy, and do not create anything billable, until the SE has said go.
- Never a customer's tenant. The SE's own, or a PoC tenant.
- No local detection, no fallback, no mock verdict, anywhere in the code. If the guard is
  unreachable the verdict is `error`, never `blocked`.
- Every number you report in a document must be printed by a tool that counted it.

---

## 1. Interview

Run [`interview.md`](interview.md). Produce the written proposal and wait for approval.

**Done when:** you can state both organisations, both plants, the innocent question that reaches
each plant, and the policies you will create, in under a minute, and the SE has approved it.

## 2. Decide the personas

**If the SE named a sector:** research it before writing anything. Read how comparable organisations
in that jurisdiction describe themselves, what services they publish, and what their public
questions look like. Then draft.

**If not:** use the shipped example as-is and say so out loud.

Replace, in this order:

| File | What it holds |
|---|---|
| `src/shared/sites.ts` | `SITES`, `ASSISTANTS`, per-assistant prompts and disclosure text |
| `src/shared/knowledge.ts` | the retrieval corpus: the site content the assistant is allowed to know |
| `src/sites/<site>/content.ts` | the visible page copy |
| `src/sites/<site>/*Data.ts` | structured data the pages render |
| `src/components/*Shell.tsx` | brand, navigation, footer |
| `src/shared/changelog.ts` | the deploy history shown in the header |

Keep the exported shapes. The components consume them and will not compile otherwise.

**Done when:** `npm run typecheck` passes, `npm run dev` renders both sites, and no page contains a
string from the previous personas.

## 3. Tenant and policies

Follow [`tenant-setup.md`](tenant-setup.md). Mode must be **DAS**.

Create one application per surface, then one policy per application. Record the policy ids in
`wrangler.toml` under `AI_GUARD_POLICY_IDS`, keyed by `appId`, and they must match the keys in
`src/shared/sites.ts` exactly or the app will silently use no policy.

Place detectors using [`../method/detectors.md`](../method/detectors.md), direction by role. Do not
copy one surface's detectors to another without redoing that reasoning.

**Done when:** `GET /api/status` on the deployed Worker reports the policy id you expect for each
surface, and a guard self-test returns a verdict rather than an error.

## 4. The bench, before the demo

Write the corpus first, from the approved proposal. Then measure.

```bash
python3 tools/policy_bench.py                  # report
python3 tools/policy_bench.py --apply          # write config, re-measure in one pass
python3 tools/policy_adversarial.py            # paraphrases and ordinary questions
```

Tune until must-block holds and must-allow holds. Both. A red must-allow is a blocker, not a note.

**Done when:** both runners exit 0, and `tools/last-run.json` plus `tools/last-adversarial.json`
exist with today's timestamp. Report the two numbers separately.

**Trap:** the temptation is to tune until the bench is green and stop. If a case failed in a way the
corpus did not predict, add that case permanently before you fix the policy, or you will fix it and
lose the evidence.

## 5. Deploy preview, not production

```bash
npm run deploy:pre          # build + deploy the preview Worker
npm run verify:pre          # cue audit + adversarial against the preview URL
```

Two environments exist because policy tuning is destructive and iterative. Tuning in production
means a customer can see a half-finished policy.

`verify:pre` writes a receipt. `npm run deploy:prod` refuses without a fresh green one, which is the
only reason the gate works: a gate you can walk past is a suggestion.

**Done when:** the preview URL answers, a real chat turn records an interaction row with a non-zero
guard latency, and `verify:pre` exits 0.

**Trap:** the preview must run the same model as production. A gate on a different model validates
something the customer will never see. `LLM_MODEL` is repeated in both env blocks on purpose.

## 6. Deploy production

```bash
npm run deploy:prod
```

**Done when:** the production URL answers, `/console` shows rows, and the presenter drawer renders
the detector detail on a real block. Check a block, not just a page load.

## 7. Rehearse every beat

Walk [`demo-script.md`](demo-script.md) against the live URL, out loud, in order. Then run:

```bash
DEMO_BASE=https://your-production-host DEMO_PASSWORD_SECRET=DEMO_PASSWORD \
  python3 tools/cue_audit.py
```

The cue audit replays every presenter cue against the tenant and fails if the cue and the tenant
disagree. It exists because a duplicated cue list once had eight wrong entries and nobody noticed
for two days.

**Done when:** cue audit exits 0, all three plants land, and you have personally watched the
unguarded half disclose what the guarded half withholds.

## 8. Hand over

Write down, for the SE:

- the URL and the password, where the password lives, and that it should be rotated before the next
  customer
- the two bench numbers, with the date they were measured
- which beats are load-bearing and which are decoration
- what will break first: model version bumps change response-side results, tenant updates can move
  a threshold, and the guard's URL can change under you

---

## Failure modes, in the order they bite

| Symptom | Cause | Check |
|---|---|---|
| Every prompt blocks | a BLOCK default with an allow-list | `defaultAction` on the topic detector |
| Nothing blocks | threshold too high, or appId not mapped to a policy | `/api/status`, then the bench |
| Blocks but no detector named | application is deciding something itself | grep the worker for local verdict logic |
| Preview fine, production blocked | different `LLM_MODEL`, or preview secrets missing | both env blocks |
| Deployed, page blank | `[env.*]` block missing assets or bindings | CF does not inherit into env blocks |
| Cue says block, tenant says allow | cue drift | `tools/cue_audit.py` |
| Unguarded half also refuses | the model is refusing, not the guard | `tools/model_sweep.py` |
