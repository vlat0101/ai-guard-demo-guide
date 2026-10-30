# Credentials

Four values, all on infrastructure you control. None of them belong in this repository, and none of
them belong in a chat transcript if there is a better path.

## What is needed

| Value | What it is | Where it goes |
|---|---|---|
| `AIG_DAS_KEY` | AI Guard DAS/API app key, from **Private AI Apps → App API Keys** | Worker secret (both environments) + local env for the tools |
| `AIG_DAS_URL` | Detection API base URL for your tenant | `.dev.vars` and Wrangler secret |
| `CF_API_TOKEN` | Cloudflare API token: Workers Scripts write, D1 write, and DNS write only if the agent is attaching a hostname | Local env, never the repo |
| `DEMO_PASSWORD` | The shared gate password for the whole demo. Generate it, do not choose it | Worker secret |

`CF_ACCOUNT_ID` and the D1 database ids come back from the deploy commands; record them in
`wrangler.toml`, which is tracked, because database ids are not secrets.

## The order that avoids rework

1. **AI Guard tenant first.** Confirm it is in **DAS** mode, not proxy. Create the AI applications,
   then the policies, then the app key. The policy ids are what make the app work, so without them
   nothing else can be tested.
2. **Cloudflare second.** Create the D1 database, apply migrations, then deploy the Worker. The
   Worker can render with nothing configured and will report `error` for anything that needs the
   guard, which is the correct behaviour and is worth seeing once.
3. **Secrets last.** Only after both sides exist, because a secret set against a Worker that does
   not know its policy ids is a secret you will rotate for no reason.

## Where a secret never goes

- Not in `wrangler.toml`. Vars are tracked and readable by anyone with the repo.
- Not in `.dev.vars` if there is any chance it gets committed. The file is gitignored; confirm with
  `git check-ignore -v .dev.vars` rather than trusting the file.
- Not in a shell history. Prefer a helper that reads from a store:
  `wrangler secret put AIG_DAS_KEY --env preview < <(get_secret AIG_DAS_KEY)`.
- Not in the SE chat if the agent can read it from a vault. If it must be pasted, say so, and plan
  the rotation in the same breath.

## Setting them

```bash
# production and preview are separate Workers with separate secrets
npx wrangler secret put AIG_DAS_KEY
npx wrangler secret put AIG_DAS_URL
npx wrangler secret put DEMO_PASSWORD
npx wrangler secret put LLM_API_KEY          # only for the unguarded path

npx wrangler secret put AIG_DAS_KEY --env preview
npx wrangler secret put AIG_DAS_URL --env preview
npx wrangler secret put DEMO_PASSWORD --env preview
npx wrangler secret put LLM_API_KEY --env preview
```

Cloudflare does not inherit secrets into an env block. Every one is set twice, and forgetting the
second set is the most common reason a preview environment looks broken while production is fine.

## The unguarded path needs its own model credential

The demo compares guarded and unguarded behaviour on the same model. In guarded mode the guard
holds the model credentials, so the Worker needs none. In unguarded mode the Worker calls the model
directly and needs `LLM_API_KEY` for whatever provider sits behind the model you pinned.

If that credential is absent, the unguarded half of the demo must say so plainly rather than fail
in a way that looks like a block. Check this before you stand in front of anyone.

## Rotation

Rotate `DEMO_PASSWORD` between customers. It is a shared gate on a public URL, and it has a habit of
ending up in a calendar invite.

Rotate the app key if it has ever been pasted into a transcript, a ticket or a chat. An app key is
tenant-scoped and cheap to replace; the cost of leaving one is a policy being exercised by someone
who is not in the room.

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(18))"   # generate, do not choose
npx wrangler secret put DEMO_PASSWORD
```

## What the agent should never do

- Create a token with more scope than the task needs. DNS write is only for attaching a hostname.
- Store a credential in a file it created under the repo, even a gitignored one, without telling the
  SE where it is.
- Reuse a credential from another project because it happens to work.
- Ask for a customer's credentials. Not for this.
