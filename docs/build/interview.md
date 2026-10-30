# The interview

The agent runs this before writing code. It is not a form to skim: the answers decide what gets
built, and the wrong ones produce a demo that looks fine and proves nothing.

Ask in conversation. Batch the questions, keep them plain, and do not ask for a credential you do
not need yet.

## Gate 1: what sector this is for

> Which sector do you sell into, and which customers do you take this to? If you would rather not
> say, I will use a shipped example instead.

Two branches, and the branch is the SE's choice, not the agent's inference.

**Branch A: the SE names a sector, patch, account list or customer type.** The agent researches
that sector and crafts the estate from it. Go and look: what the organisations are actually called
in that jurisdiction, what services they publish, how their public websites talk, what their
constituents complain about, what a realistic sensitive document looks like in that world. Then
draft the personas and put them in front of the SE.

**Branch B: no preference, or "just show me".** Use the shipped example: a government department
and a health service. Say plainly that this is the fallback, and that swapping it later is a
documented step, not a rebuild.

Do not silently pick Branch A and invent a patch the SE did not name. A demo aimed at the wrong
sector is worse than a generic one, because the audience recognises the wrongness immediately.

## Gate 2: the two organisations

> For each organisation I need a name, what it does, and the one thing inside it that must not get
> out.

That last clause is the whole demo. Ask for it explicitly and refuse to proceed without it.

For each organisation, get:

- **Name and remit.** Plausible, and not a real customer's name. Fictional but recognisable in kind.
- **Public services.** Three to six things a real person would ask this organisation about. These
  become the must-allow half of the corpus.
- **The plant.** The confidential material hiding inside the site knowledge. Typical shapes: a
  staff roster with reachable numbers, an unpublished cost or performance figure, a client or
  patient identifier, an internal memo about a restructure.
- **The innocent question that reaches the plant.** This is the beat that sells the demo. It has to
  be a question a normal person would type, with no suspicious words in it.

If the SE cannot supply a plant, propose one from the sector research and get it approved. Do not
proceed with two pretty websites and nothing to catch.

## Gate 3: tone and audience

> Who is in the room: technical, executive, or mixed? And how straight should this play it?

The shipped example plays the organisations for dry humour, which works in front of technical
audiences and public-sector people who have lived it. It does not work in front of a minister's
office. Ask, and adjust.

## Gate 4: credentials

Send the SE to [`credentials.md`](credentials.md) rather than asking for values in the transcript.
Collect what is needed in one pass, confirm what each one is for, and state that nothing goes into
the repository.

Never ask for a customer's tenant credentials. If the SE offers them, refuse and explain why: this
method breaks things on purpose, and a customer's tenant is not the place.

## Gate 5: permission to build, then permission to deploy

Two separate asks, and they are not the same question.

> I can build this locally with no cost and no cloud changes. Then there is a deploy step that
> creates a Worker, a database and, if you want a hostname, a DNS record on your account. Which of
> those do you want, and when?

The second one is billable and public. Get an explicit yes, name the account, name the hostname,
and say what it will cost at demo scale (it is small; say the number rather than "cheap").

## What the agent owes the SE before building

A written proposal, short enough to read on a phone:

1. The two organisations, in a sentence each.
2. The plant in each, and the innocent question that reaches it.
3. The policies to be created, and which detector carries each beat.
4. What will be created in Cloudflare, and what it costs.
5. What the SE has to approve versus what the agent decides.

Then wait. This is the oversight boundary: the agent does the work, the SE owns the judgement about
what the demo claims.

## What the agent must not ask

- Anything a credential is worth remembering rather than entering once.
- Whether to "make it more secure". Security posture is not a preference.
- Whether the SE wants the guard on. The whole demo is the comparison; there is no version where
  only one side exists.
