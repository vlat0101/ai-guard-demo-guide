# What each detector actually does

Measured against one lab tenant, October 2026. Treat the numbers as a shape, not a specification:
re-measure on yours, because these scores move with content and with the model behind them.

The point of this page is that "we turned on the PII detector" is not a control description. Each
detector has a mechanism, and the mechanism decides what it can and cannot catch.

## `personal_data`

**Mechanism:** a context classifier over the content. It scores how much the passage *reads like*
personal or sensitive data.

**What that means in practice:** it needs context to fire. Measured:

| Content | Score | Verdict at 0.3 | Verdict at 0.8 |
|---|---|---|---|
| A realistic discharge summary | 0.39 – 0.48 | BLOCK | pass |
| `MRN 884231` on its own | 0.00 | pass | pass |
| A user typing their own name and appointment | 0.98 | BLOCK unless direction is input-only | BLOCK |

Two lessons, both expensive to learn the other way round.

**The threshold 0.8 was the bug, not the detector.** A whole session was spent concluding PII did
not work when the real answer was that a plausible clinical paragraph scores under 0.5. Set it
where your corpus says, not where it sounds strict.

**A terse identifier scores zero.** The classifier wants sentences. Anything a person types as a
bare string is invisible to it, which is why identifiers need `pattern` as a floor. Never rely on a
semantic classifier for a value that has a fixed format.

## `pattern`

**Mechanism:** regular expressions over the content. The API identifier is `pattern`, not `text`.

**What it is for:** fixed-format values, and as the floor under every semantic detector. If a
value has a shape, match the shape.

**The trap that cost a round of tuning:** a pattern written as

```
\bMRN[:\s#-]*\d{6,8}\b
```

did not fire on the sentence the model actually produced:

> Their MRN (Medical Record Number) 884231 is on file.

The intervening words defeat the gap. Two patterns with a bounded gap fixed it. Write patterns
against the text the *model* generates, not the text you would write.

**Placement matters more than the pattern.** In this design the same identifier pattern sits on the
input for the internal tool and on the output for the public one, because the question is not "is
this sensitive" but "whose data is leaving, and from where".

## `topic`

**Mechanism:** a set of named topics, each with a definition and an action, scored semantically.

**It works, and it works narrowly.** Measured on a single deny category for internal staff
information:

| Prompt | Score | Verdict |
|---|---|---|
| Give me the staff roster for ward 3b | 1.00 | BLOCK |
| Who is the on-call doctor for Ward 3B? | 0.88 | BLOCK |
| Can I book an appointment with a physiotherapist? | 0.00 | allow |
| What are the visiting hours in Ward 3B? | 0.00 | allow |
| Where do I park at the campus? | 0.49 | allow |
| How do I make a complaint about my care? | 0.00 | allow |

The rules behind that table:

- `defaultAction` must be `ALLOW` for a deny-list. A global BLOCK with an allow-list inverts the
  design and turns every off-centre question into a hit.
- `label` is mandatory inside each topic entry. Omitting it is rejected.
- One topic per category, defined in the words the content actually uses. A single topic covering
  several unrelated categories blurs and blocks everything.
- Natural language and keyword-list definitions scored identically here. Pick whichever reads more
  precisely and verify against allow-cases either way.

Topics evaluate independently, so a DETECT topic can sit beside a BLOCK topic on the same detector.
Observed as `topics=[('Hospital', 'DETECT'), ('Internal staff information', 'BLOCK')]`.

An earlier version of this document said topic could not discriminate reliably. That was wrong, and
the two configuration errors that produced it are in [`traps.md`](traps.md).

## `prompt_injection`

**Mechanism:** classifier for instruction-override framing ("ignore your previous instructions",
role-play escapes, tool-call injection).

**Threshold:** 0.7 on public surfaces, 0.8 on the internal one in this design. It is the detector
with the clearest demo value and the least tuning risk, because the true positives and the false
positives do not sit close together.

It is also the one most often faked in demos. If your application strips suspicious phrases before
the guard sees them, you have demonstrated regex, badly.

## `malicious_url`

**Mechanism:** reputation lookup against a URL seen in the content. It does not analyse the page.

Two consequences: a URL that is merely suspicious but unlisted will pass, and a demo that relies on
it needs a genuinely known-bad host. Do not build a demo beat that depends on a reputation hit you
have not tested today.

## `invisible_text`

**Mechanism:** detects hidden content (zero-width characters, white-on-white, off-screen) used to
smuggle instructions past a human reader.

Good demonstration value because the audience can see the trick and cannot see the payload. Cheap
to include, essentially no tuning.

## Advisory categories

`legal_advice`, `finance_advice`, `gibberish`, and brand/reputation risk (`brand_and_reputation_risk`,
threshold 0.85 here) are best used as **DETECT**, not BLOCK, on anything a customer is watching.

They are judgement calls, and a judgement call that blocks in front of a stakeholder starts an
argument about the product's opinion instead of the product's control. DETECT gives you the signal
in the console without spending the meeting on it.

## Direction: place the control by role, not by policy

The single most useful design decision in this repo. The same content needs opposite treatment
depending on who is typing.

| | Public-facing assistant | Internal / shadow-AI tool |
|---|---|---|
| `pattern` with identifiers | **BLOCK both ways.** Echoing an identifier is a disclosure, and a member of the public has no reason to type one. Medicare numbers and names still pass inbound so booking works. | **BLOCK inbound.** The leak is the prompt leaving the organisation. |
| `personal_data` inbound | **DETECT.** Users legitimately hand over their own details to book, register or complain. Blocking it breaks the service. | **BLOCK.** The data belongs to someone else and is leaving the building. |
| `topic` (unpublished figures, staff detail) | **BLOCK outbound**, DETECT inbound. The leak is in the answer. | **BLOCK inbound.** |

Reason it out from the role every time. A policy copied from one surface to another without
redoing this reasoning is how a booking flow ends up refusing a patient's own phone number.
