#!/bin/bash
# Set the preview Worker's secrets without ever echoing them.
#
# The preview environment is handed to colleagues, so it gets its OWN password: a
# separate value means access to the preview can be given or withdrawn without
# touching the password on the customer-facing deployment.
#
# The AI Guard DAS key is the same tenant credential in both environments — what
# separates them is the POLICY ID the Worker is pointed at (preview clones 1011/1012/1013
# vs production 1001/1002/1003), not the key.
set -euo pipefail
cd /codex/Code/ai-guard-demo
export CLOUDFLARE_API_TOKEN="$(/root/.hermes/bin/get_secret CF_API_TOKEN)"

# 1. Preview password: generated once, stored in the vault under DEMO_PASSWORD_PRE.
if /root/.hermes/bin/get_secret DEMO_PASSWORD_PRE >/dev/null 2>&1; then
    echo "DEMO_PASSWORD_PRE already in the vault — reusing it"
    PRE_PW="$(/root/.hermes/bin/get_secret DEMO_PASSWORD_PRE)"
else
    PRE_PW="$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | cut -c1-18)"
    printf '%s' "$PRE_PW" | /root/.hermes/bin/vault-add-prompted DEMO_PASSWORD_PRE \
        --description "ai-guard-demo PREVIEW shared password (pre-demo.example.com)" >/dev/null
    echo "DEMO_PASSWORD_PRE generated and stored in the vault (value never printed)"
fi

# 2. AUTH_SECRET: independently generated per environment. Reusing the production one
#    would let a cookie minted for preview be valid in production.
AUTH="$(openssl rand -hex 32)"

# 3. Push all three secrets to the preview environment only (--env preview).
printf '%s' "$PRE_PW" | npx wrangler secret put DEMO_PASSWORD --env preview >/dev/null
echo "  DEMO_PASSWORD   -> preview"
printf '%s' "$AUTH"   | npx wrangler secret put AUTH_SECRET   --env preview >/dev/null
echo "  AUTH_SECRET     -> preview (fresh, not shared with production)"
/root/.hermes/bin/get_secret AIG_DAS_API_KEY | npx wrangler secret put AIG_DAS_API_KEY --env preview >/dev/null
echo "  AIG_DAS_API_KEY -> preview (same tenant key, different policy ids)"

echo
echo "preview secrets now set:"
npx wrangler secret list --env preview
