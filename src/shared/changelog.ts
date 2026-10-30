/**
 * Curated change log, rendered in the header bar area and on the all-sites page.
 *
 * Written by hand on purpose. A git-log dump is noise ("wip", "fix"), and this list is
 * read by colleagues who were not in the room — each line says what changed for the
 * person using the demo, not which file moved. Newest first; add an entry when a change
 * reaches a shared environment, not when it is committed.
 */
export interface ChangeEntry {
  /** ISO date, shown as-is. */
  date: string
  kind: 'review' | 'fix' | 'feature' | 'policy' | 'docs'
  /** Which part of the demo this affects, in plain words. */
  area: string
  /** One sentence, no jargon, written for someone who was not here. */
  summary: string
  /** Where the change is live. `preview` alone means it is still being tested. */
  env: 'both' | 'preview' | 'production'
}

export const CHANGELOG: ChangeEntry[] = [
  {
    date: '2026-10-22',
    kind: 'feature',
    area: 'Address',
    summary:
      'The demo answers on a second hostname. A managed network can classify one custom domain as professional services and another as miscellaneous, which puts the second behind browser isolation and makes the demo look broken to anyone inside a corporate proxy. Attaching a second domain is cheaper than arguing with the category: hand out whichever address loads on their network.',
    env: 'preview',
  },
  {
    date: '2026-10-22',
    kind: 'policy',
    area: 'Assistant model',
    summary:
      'The assistant stays on the larger model. Every cheaper model we tested still answered the questions, but held back the sensitive detail the guard exists to catch — and at demo volumes the price difference is fractions of a cent.',
    env: 'both',
  },
  {
    date: '2026-10-22',
    kind: 'feature',
    area: 'Environments',
    summary:
      'Preview now runs the same assistant model as production. A different model passes and fails a different set of checks, so a green preview would have meant nothing about what this page serves.',
    env: 'preview',
  },
  {
    date: '2026-10-21',
    kind: 'feature',
    area: 'Environments',
    summary:
      'Preview environment added: its own Worker, its own database and its own AI Guard policies, so testing cannot touch what this page is serving.',
    env: 'both',
  },
  {
    date: '2026-10-21',
    kind: 'policy',
    area: 'AI Guard policies',
    summary:
      'Preview policies cloned from production (1011 / 1012 / 1013). Response-side tuning happens on the clones first; production keeps 1001 / 1002 / 1003.',
    env: 'preview',
  },
  {
    date: '2026-10-21',
    kind: 'fix',
    area: 'Assistant answers',
    summary:
      'A failure in AI Guard no longer appears to the person using the site as “that request was blocked”. An outage now reads as an outage.',
    env: 'both',
  },
  {
    date: '2026-10-21',
    kind: 'fix',
    area: 'Operator console',
    summary:
      'Blocks name the detector that actually fired, not one that merely scored. When two controls fire, the message lists both.',
    env: 'both',
  },
  {
    date: '2026-10-21',
    kind: 'fix',
    area: 'Operator console',
    summary:
      '“Allowed by AI Guard” no longer counts the deliberately uninspected runs, and timings that were never measured read “not measured” instead of 0 ms.',
    env: 'both',
  },
  {
    date: '2026-10-21',
    kind: 'fix',
    area: 'Audit trail',
    summary:
      'A broken or drifted database now says so in the console instead of looking like a fresh install with no activity.',
    env: 'both',
  },
  {
    date: '2026-10-21',
    kind: 'review',
    area: 'Whole demo',
    summary:
      'Independent three-model review of the worker, guard path and test tools: 23 findings, each re-measured against the live tenant. Two findings were corrected after measurement.',
    env: 'both',
  },
  {
    date: '2026-10-21',
    kind: 'docs',
    area: 'Detection test cases',
    summary:
      'The detection tables are now generated from the measured artefacts, and one case that was previously described as allowed is recorded as a deliberate block.',
    env: 'both',
  },
]

/** The most recent `n` entries, for the header and the landing page. */
export function recentChanges(n = 5): ChangeEntry[] {
  return CHANGELOG.slice(0, n)
}
