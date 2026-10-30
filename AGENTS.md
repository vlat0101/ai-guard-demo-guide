# AGENTS.md

Read this before changing anything. It records decisions that are not obvious from the code, and
the ones that have already been got wrong once.

## The one rule

**All detection is done by Zscaler AI Guard.** No local detector, no fallback, no mock verdict, no
"simulated" block. If the guard is unreachable the verdict is `error`, never `blocked`. A block
shown to a customer is a real tenant verdict with a detector name and a score behind it.

Do not add a heuristic, a keyword list, a "basic check", or a safety prompt that refuses. Each one
makes the demo untraceable, and the whole repo exists to make it traceable.

Corollary, learned the hard way: the assistant's own system prompts are **permissive by design**.
If the model refuses, the room cannot tell whether the product worked. Model selection is the
answer to a refusing model, not prompt hardening.

## Architecture

- `worker/index.ts` is the only server: shared-password gate, `/api/chat`, `/api/interactions`,
  `/api/stats`, `/api/status`, `/api/guard-selftest`.
- Guarded path: `detect(IN)` then the model then `detect(OUT)`. A block on either side records
  which one (`blockedSide`). DAS/API mode.
- Unguarded path: the same model, called directly with its own credential. Same model on both paths
  is deliberate.
- `src/shared/sites.ts` holds `SITES`, `ASSISTANTS`, `DESKTOP_LLM`. `securityBoundaries` is only
  appended when `PROMPT_HARDENING=true`, which is false.
- `src/shared/knowledge.ts` is deterministic keyword-overlap retrieval over page content. It is not
  a vector store and must not become one: it runs inside the Worker on every request, and its
  behaviour has to be explainable while a customer is watching.
- `src/sites/desktop/ShadowDesktop.tsx` simulates every pixel except the request. Browser chrome,
  wallpaper and brand are fake. The Worker and the guard call are real.

## Two environments, always

Production and preview are separate Workers with separate databases and separate policies. They
exist so policy tuning has somewhere to be wrong.

- A deploy gate that can be walked past is documentation. `deploy:prod` must refuse on a red or
  stale preview receipt.
- `[env.*]` blocks repeat everything. Cloudflare inherits nothing into them.
- `LLM_MODEL` must match in both blocks. A gate on a different model validates something the
  customer never sees.

## Numbers

Any number stated in a document must be printed by a tool that counted it. If code can derive it,
the document quotes the tool, not a human's count.

Publish the must-block and must-allow results together, with the date. Never quote a pass count you
did not measure in this session, and never delete a failing case to make a run green.

## The words on stage are a tested artefact

Presenter cues live in one place and are replayed against the live tenant by `tools/cue_audit.py`.
A duplicated cue list once had eight entries wrong about which side blocked and nobody noticed for
two days, because on stage both sides look like "blocked".

## Content rules

- Blocks shown to the audience are generic. Detector name, score, severity and side are presenter-only.
- The staff-facing plants must be plausible: a real-looking mobile number, a real-looking identifier.
  A demo where the secret looks like placeholder text does not land.
- Every plant needs an innocent question that reaches it, with no suspicious words in the prompt.
- Fictional organisations only. Never a real customer's name, logo or data.

## Secrets

Never in `wrangler.toml`, never in a file you created without saying where it is, never in chat if
a store will do. `.dev.vars` is gitignored; verify with `git check-ignore -v .dev.vars` rather than
reading `.gitignore`. Rotate the shared gate password between customers.

## Deploying on someone else's account

Ask. State what will be created, on which account, and what it costs, then wait. Building locally
costs nothing and needs no permission. Creating a Worker, a database or a DNS record does.
