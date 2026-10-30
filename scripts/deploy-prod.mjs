// Promote to production — but only from a preview run that actually passed.
//
// The demo is shared with colleagues, and the failure mode we are guarding against is
// not a bad build: it is a good build whose POLICY was never exercised. So the gate is
// the preview audit receipt (.pre-verify.json), and it has to be all of:
//
//   green   — both audits passed (cue_audit end to end, policy_adversarial)
//   ours    — produced from the commit being deployed (no promoting a stale run)
//   fresh   — less than PRE_VERIFY_MAX_AGE_MIN minutes old (default 360)
//
//   npm run deploy:prod              # refuses if any of the above fails
//   npm run deploy:prod -- --force   # deploy anyway, with the reason printed
//
// Nothing here touches the export logic: with a valid receipt this runs exactly the
// same `vite build && wrangler deploy` it replaces.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const RECEIPT = '.pre-verify.json'
const MAX_AGE_MIN = Number(process.env.PRE_VERIFY_MAX_AGE_MIN || 360)
const force = process.argv.includes('--force')

const sh = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' })
const git = (args) => execFileSync('git', args, { encoding: 'utf8' }).trim()

function refuse(reason) {
  console.error('\n  PROD DEPLOY REFUSED\n')
  console.error(`  ${reason}\n`)
  console.error('  Run the preview verification first:')
  console.error('    npm run deploy:pre && npm run verify:pre\n')
  console.error('  Override deliberately (prints the reason and deploys anyway):')
  console.error('    npm run deploy:prod -- --force\n')
  if (!force) process.exit(1)
  console.error('  --force given: deploying anyway.\n')
}

const head = git(['rev-parse', '--short', 'HEAD'])

if (!existsSync(RECEIPT)) {
  refuse(`No preview receipt (${RECEIPT}). Production has not been verified against the preview environment.`)
} else {
  const r = JSON.parse(readFileSync(RECEIPT, 'utf8'))
  const ageMin = (Date.now() - Date.parse(r.at)) / 60000
  if (!r.ok) {
    refuse(`The last preview run was RED — cue ${r.cue?.passed}/${r.cue?.total}, ` +
           `adversarial ${r.adversarial?.bad} of ${r.adversarial?.total} not as expected.`)
  } else if (r.commit !== head) {
    refuse(`The preview receipt is from commit ${r.commit}, but HEAD is ${head}. ` +
           'The thing you are about to deploy has not been previewed.')
  } else if (ageMin > MAX_AGE_MIN) {
    refuse(`The preview receipt is ${Math.round(ageMin)} minutes old (limit ${MAX_AGE_MIN}).`)
  } else {
    console.log(`preview receipt ok: commit ${r.commit}, cue ${r.cue.passed}/${r.cue.total}, ` +
                `adversarial 0/${r.adversarial.total} unexpected, ${Math.round(ageMin)} min old`)
  }
}

sh('npx', ['vite', 'build'])
// Tag the version with the commit, so /api/status can tell the UI which build is live.
sh('npx', ['wrangler', 'deploy', '--env=', '--tag', head])
