# Proving an AI guardrail actually guards

A method for testing and tuning Zscaler AI Guard policies against a live tenant, plus a working
demo estate to apply it to. Written for Zscaler sales engineers, and for the agents they run.

The demo is the vehicle. The method is the thing worth taking to your patch.

## The problem this solves

A policy engine that returns `BLOCK` is not evidence that it blocks the right things.

Anyone can show a slide where a prompt gets stopped. The question a technical customer asks next
is *which detector fired, at what score, in which direction, and what happens to the questions
that must not be blocked*. If you cannot answer that from a re-runnable test rather than from a
memory of a good demo, you have a magic trick, not a control.

So this repo is built around one loop:

```
corpus  ->  measure  ->  tune  ->  re-measure  ->  same numbers, every time
```

and one rule that makes the loop honest:

> Every block must be a real tenant verdict with a detector name and a score behind it. No local
> detector, no fallback, no mock verdict, no "simulated" block. If the guard is unreachable the
> verdict is `error`, never `blocked`.

That rule has a cost: when the demo fails, it fails visibly. That is the point.

## Who this is for

Three readers, three entry points.

| You are | Read | Why |
|---|---|---|
| The sales engineer | [`START-HERE.md`](START-HERE.md) | what to say to your agent, and what you have to supply |
| The agent doing the build | [`docs/build/BUILD.md`](docs/build/BUILD.md) | ordered, verifiable instructions with the traps that cost real time |
| Anyone who wants the method without the demo | [`docs/method/the-loop.md`](docs/method/the-loop.md) | how to prove a policy engine works, engine-agnostic |

## What you need before you start

Two things. Both **yours**, neither a customer's.

1. **A Zscaler AI Guard tenant in DAS/API mode.** Your own lab tenant, or a proof-of-concept tenant
   you stand up for this. The whole method assumes you can break things, measure, retune and break
   them again. Tuning policies by trial in a customer's production tenant to make a demo look good
   is not a demo, it is an incident waiting for a date.
2. **A Cloudflare account** with Workers, D1, and the Workers AI binding.

When you demo this to a customer, the traffic goes to *your* tenant and *your* account. The
customer watches. They do not host it, and their tenant is not touched. If a customer wants it
inside their own estate, that is a different engagement with a change process, not this repo.

The agent asks for credentials during the interview and tells you where each one goes.
[`docs/build/credentials.md`](docs/build/credentials.md) has the list.

## What gets built

One Cloudflare Worker serving three surfaces and an operator console:

- a fictional **government department** site with a public assistant
- a fictional **health service** site with a public assistant
- a **shadow-AI desktop**: a simulated unmanaged AI tool, where the interesting traffic is someone
  pasting what they should not
- **`/console`**: every interaction with the verdict, the detector, the score, the direction and
  the latency split
- a **presenter drawer** on every surface: the same detail, sized for someone standing at a lectern

Each surface carries a separate AI Guard policy, because the correct control for a public-facing
chatbot and the correct control for an internal tool are not the same control.

```
docs/build/how-it-works.md   what each part does and why
docs/build/interview.md      the questions your agent must ask you first
```

## The shipped example

The repo contains a complete, deployable estate with two fictional organisations. It exists so the
guide runs end to end with no input, and so your agent has a working pattern to copy.

It is a **fallback**, not the destination. During the interview your agent asks what sector you
sell into. If you name your patch, your accounts or your customers, it researches that sector and
crafts personas for it: the organisations, the services they would plausibly offer, the language
their people use, and the confidential facts planted inside each one. If you express no preference,
you get the shipped example.

That last part matters more than it sounds. See
[`docs/method/corpus-design.md`](docs/method/corpus-design.md) on why the planted facts, not the
website design, are what make a demo land.

## Layout

```
START-HERE.md              what the SE says to their agent
AGENTS.md                  invariants for any agent working in this repo
worker/  src/  migrations/ the estate: one Worker, one SPA, six D1 migrations
wrangler.toml              production and preview, separate Workers and separate policies
tools/                     the bench, the adversarial runner, the cue audit, the MODEL sweep
docs/method/               the loop, the corpus, the detectors, the traps, a worked pass/fail run
docs/build/                components, interview, credentials, tenant setup, build runbook
docs/policies/             annotated AI Guard policy exports
```

`npm install && npm run dev` runs it locally. It needs no credentials to render; it needs them to
talk to a model and a guard.

## On the numbers in these documents

Every measured number here (scores, thresholds, pass counts) was taken against one lab tenant with
one model, on 2026-10-21 and 2026-10-22. Detector scores are content-dependent and model-dependent.
Yours will be different.

That is not a disclaimer, it is the argument. The numbers are published so you can see what a
measured result looks like and what it took to get one. Then you re-measure on your own tenant,
because a number someone else measured against a different corpus is exactly the kind of evidence
this repo exists to replace.

Where a claim was later found to be wrong, the retraction stays in place rather than being edited
out. Those are the most useful pages: [`docs/method/traps.md`](docs/method/traps.md).

## Licence

MIT for the code and the documentation. Photographs are **excluded** from that grant: they are
third-party works under their own licences, attributed in
[`docs/photo-credits.md`](docs/photo-credits.md). If you replace them with your own images, replace
that file too.
