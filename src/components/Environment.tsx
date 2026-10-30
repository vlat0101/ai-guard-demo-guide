/**
 * Which environment am I looking at, and what changed?
 *
 * Two audiences, one source of truth. The demo is shared internally, so someone opening
 * a link needs to know instantly whether they are on the preview deployment (safe to
 * poke at, policies may be mid-tune) or on the one a customer sees. The change log is
 * rendered here rather than in a wiki precisely so it travels with the deployment it
 * describes.
 *
 * Audience view stays clean: the badge is factual, says nothing about inspection
 * internals, and does not name the preview URL from production.
 */
import { recentChanges, type ChangeEntry } from '../shared/changelog'
import { useStatus } from '../lib/guard'

const KIND_LABEL: Record<ChangeEntry['kind'], string> = {
  review: 'Review',
  fix: 'Fix',
  feature: 'Feature',
  policy: 'Policy',
  docs: 'Docs',
}

const KIND_COLOUR: Record<ChangeEntry['kind'], string> = {
  review: 'var(--gov-purple)',
  fix: 'var(--gov-blue)',
  feature: 'var(--gov-teal)',
  policy: 'var(--gov-orange)',
  docs: 'var(--gov-grey-11)',
}

function envTone(env: string): { fg: string; bg: string; label: string; blurb: string } {
  if (env === 'production') {
    return {
      fg: 'var(--gov-teal)',
      bg: 'var(--gov-teal-08)',
      label: 'PRODUCTION',
      blurb: 'This is the deployment that customers are shown.',
    }
  }
  if (env === 'preview') {
    return {
      fg: 'var(--gov-orange)',
      bg: 'var(--gov-orange-08)',
      label: 'PREVIEW',
      blurb:
        'Pre-deployment environment. Its own database and its own AI Guard policies — changes are tested here before they reach production.',
    }
  }
  return {
    fg: 'var(--gov-grey-11)',
    bg: 'var(--gov-grey-04)',
    label: 'DEV',
    blurb: 'Local development build; nothing here is measured against a live tenant.',
  }
}

/** Compact pill for the header bar. Renders nothing until status has loaded. */
export function EnvBadge() {
  const status = useStatus()
  if (!status) return null
  const tone = envTone(status.environment)
  const build = status.commit || status.version || null
  const when = status.deployedAt ? status.deployedAt.replace('T', ' ').slice(0, 16) + ' UTC' : 'not deployed'

  return (
    <span
      title={`${tone.blurb}${build ? ` Build ${build}.` : ''} Deployed ${when}.`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4em',
        padding: '0.15em 0.5em',
        border: `1px solid ${tone.fg}`,
        background: tone.bg,
        color: tone.fg,
        borderRadius: 'var(--radius)',
        fontSize: '0.6875rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden="true"
        style={{ width: 6, height: 6, borderRadius: '50%', background: tone.fg, display: 'inline-block' }}
      />
      {tone.label}
      {build && <span style={{ fontWeight: 400, letterSpacing: 0 }}>{build}</span>}
    </span>
  )
}

/**
 * Full environment block for the all-sites page: where this build runs, which version it
 * is, and the change log someone can read before they click anything.
 */
export function EnvironmentPanel() {
  const status = useStatus()
  const env = status?.environment ?? 'dev'
  const tone = envTone(env)
  const changes = recentChanges(8)

  return (
    <section aria-labelledby="env-heading" style={{ marginTop: 'var(--space-7)' }}>
      <h2 id="env-heading">Environment &amp; changes</h2>

      <div
        className="notice"
        style={{ borderLeftColor: tone.fg, background: tone.bg, marginBottom: 'var(--space-4)' }}
      >
        <p style={{ marginBottom: 'var(--space-2)' }}>
          <strong>{tone.label}</strong> — {tone.blurb}
        </p>
        <p className="mono tiny" style={{ margin: 0 }}>
          version {status?.version ?? 'unknown'}
          {status?.commit ? ` · commit ${status.commit}` : ''}
          {status?.deployedAt ? ` · deployed ${status.deployedAt.replace('T', ' ').slice(0, 16)} UTC` : ''}
        </p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
        <caption className="tiny muted" style={{ textAlign: 'left', paddingBottom: 'var(--space-2)' }}>
          Newest first. A row marked “preview” has not been promoted to production yet.
        </caption>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '0.35em 0.5em', width: '7em' }}>Date</th>
            <th style={{ padding: '0.35em 0.5em', width: '6em' }}>Kind</th>
            <th style={{ padding: '0.35em 0.5em', width: '11em' }}>Area</th>
            <th style={{ padding: '0.35em 0.5em' }}>What changed</th>
            <th style={{ padding: '0.35em 0.5em', width: '7em' }}>Live on</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((c, i) => (
            <tr key={`${c.date}-${c.area}-${i}`} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '0.45em 0.5em', whiteSpace: 'nowrap' }} className="mono">
                {c.date}
              </td>
              <td style={{ padding: '0.45em 0.5em', color: KIND_COLOUR[c.kind], fontWeight: 700 }}>
                {KIND_LABEL[c.kind]}
              </td>
              <td style={{ padding: '0.45em 0.5em' }}>{c.area}</td>
              <td style={{ padding: '0.45em 0.5em' }}>{c.summary}</td>
              <td style={{ padding: '0.45em 0.5em' }} className="tiny">
                {c.env === 'both' ? 'preview + prod' : c.env}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
