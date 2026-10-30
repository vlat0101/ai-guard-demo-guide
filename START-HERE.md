# Start here

You want the demo built for your patch. This page is what to say to your agent, and the four
things you have to decide before it starts.

## The prompt

Paste this into a fresh session, in a directory you do not mind it writing to:

```
Read https://github.com/<owner>/ai-guard-demo-guide and build it for me.

Work through docs/build/interview.md first and ask me the questions in it before you write
any code. Use docs/build/BUILD.md as the runbook. Do not deploy, do not create billable
resources, and do not touch my AI Guard tenant until you have shown me the plan and I have
said go.

My AI Guard tenant is [yours or a PoC tenant, which]. My Cloudflare account is [account].
```

That is the whole thing. The agent reads the guide, interviews you, proposes a plan, and builds.

## The four decisions it will ask you for

**1. Your sector and patch.** This is the one that changes the output most. Tell it what you sell
into and who you sell to, and it will research that sector and craft the personas from it. Tell it
"no preference" and you get the shipped example, which is a government department and a health
service.

**2. Two organisations, with secrets inside them.** Not two websites. Two organisations that
plausibly exist, each carrying something that must not leave: a staff roster with a reachable
mobile number, a cost figure that has not been published, a patient or client identifier the model
will happily repeat. The demo works because the guard is catching something real. Without the
plants there is nothing to catch and the room shrugs.

**3. Credentials.** Your Cloudflare API token and your AI Guard DAS app key. Hand them over the way
[`docs/build/credentials.md`](docs/build/credentials.md) describes, not pasted into chat if you can
avoid it. They end up in Wrangler secrets and a local vault, never in the repository.

**4. Whether it may deploy.** Nothing stops the agent building locally. Deploying creates real
resources on your account and, if you attach a hostname, real DNS. Say yes when you mean it.

## What you get at the end

A URL you can open in front of a customer, with three surfaces, a presenter drawer and a console
that shows every verdict with the detector, the score, the direction and the latency split. Plus a
bench you can re-run in one command, because the point is that the numbers come back the same
tomorrow.

Full read: [`docs/build/how-it-works.md`](docs/build/how-it-works.md). Method, if you want to skip
the demo entirely: [`docs/method/the-loop.md`](docs/method/the-loop.md).
