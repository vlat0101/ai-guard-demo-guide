import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { api } from '../lib/api'
import type { DemoStatus, DetectorHit } from '../shared/types'

interface Row {
  id: string
  created_at: string
  app_id: string
  site_id: string
  site_name: string
  session_id: string
  guard_mode: string
  blocked_side: string | null
  response_inspected: number | null
  verdict: string
  http_status: number
  block_message: string | null
  latency_ms: number
  guard_ms: number | null
  guard_in_ms: number | null
  guard_out_ms: number | null
  model_ms: number | null
  model: string | null
  prompt_chars: number
  prompt: string | null
  answer: string | null
  detectors: string | null
}

interface Stat {
  app_id: string
  site_id: string
  guard_mode: string
  verdict: string
  count: number
  avg_latency: number
}

const TABS = [
  { to: '/console', label: 'Decisions' },
  { to: '/console/policies', label: 'Policies' },
  { to: '/console/redteam', label: 'Red team' },
  { to: '/console/assets', label: 'AI assets' },
]

function modeClass(status: DemoStatus | null) {
  return status?.proxyConfigured
    ? 'mode-indicator mode-indicator--live'
    : 'mode-indicator mode-indicator--unconfigured'
}

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const [status, setStatus] = useState<DemoStatus | null>(null)

  useEffect(() => {
    api.status().then(setStatus).catch(() => setStatus(null))
  }, [])

  return (
    <div className="console theme-console">
      <div className="console__bar">
        <h1 className="console__title">Zscaler AI Guard · Operator Console</h1>
        <span className={modeClass(status)}>
          {status?.proxyConfigured ? 'Live tenant' : 'Not configured'}
        </span>
        <nav className="console__nav" aria-label="Console">
          {TABS.map((t) => (
            <Link key={t.to} to={t.to} aria-current={pathname === t.to ? 'page' : undefined}>
              {t.label}
            </Link>
          ))}
          <Link to="/">Demo sites</Link>
        </nav>
      </div>
      <div className="console__main">{children}</div>
    </div>
  )
}

/**
 * What to colour a decision by.
 *
 * A row is not simply allowed or blocked: an allowed request can still have had a
 * detector report on it. Calling that "allowed" hides the interesting case, so it
 * gets its own state — FLAG — which is exactly the evidence a customer wants when
 * they ask whether the control was watching.
 */
function verdictOf(row: Row): { key: 'allow' | 'block' | 'flag' | 'error'; label: string } {
  if (row.verdict === 'blocked') return { key: 'block', label: 'BLOCK' }
  if (row.verdict === 'error') return { key: 'error', label: 'ERROR' }
  const hits = parseDetectors(row.detectors)
  const reported = [...hits.in, ...hits.out].some((d) => d.action === 'DETECT')
  return reported ? { key: 'flag', label: 'FLAG' } : { key: 'allow', label: 'ALLOW' }
}

function parseDetectors(raw: string | null): { in: DetectorHit[]; out: DetectorHit[] } {
  if (!raw) return { in: [], out: [] }
  try {
    const parsed = JSON.parse(raw) as { in?: DetectorHit[]; out?: DetectorHit[] }
    return { in: parsed.in ?? [], out: parsed.out ?? [] }
  } catch {
    return { in: [], out: [] }
  }
}

function DetectorTable({ rows, side }: { rows: DetectorHit[]; side: string }) {
  if (rows.length === 0) {
    return (
      <p className="dec__text" style={{ borderLeftColor: 'transparent' }}>
        No detector reported on the {side === 'in' ? 'prompt' : 'response'} side.
      </p>
    )
  }
  return (
    <table className="detectors">
      <thead>
        <tr>
          <th>Detector</th>
          <th>Action</th>
          <th>Score</th>
          <th>Severity</th>
          <th>Classification</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((d) => (
          <tr key={`${side}-${d.name}`}>
            <td>{d.name}</td>
            <td className={`act--${d.action}`}>{d.action}</td>
            <td>{d.score === null ? '—' : d.score.toFixed(2)}</td>
            <td>{d.severity || '—'}</td>
            <td>{d.taxonomy || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Decision({ row }: { row: Row }) {
  const v = verdictOf(row)
  const dets = parseDetectors(row.detectors)
  const time = new Date(row.created_at).toLocaleTimeString('en-AU')
  const preview = row.prompt ?? `(${row.prompt_chars} characters — not captured)`

  return (
    <details className={`dec dec--${v.key}`}>
      <summary>
        <span className="dec__time">{time}</span>
        <span className="dec__app">{row.app_id}</span>
        <span className={`pill pill--${v.key}`}>{v.label}</span>
        <span className="dec__preview">{preview}</span>
        <span className="dec__lat">
          {row.latency_ms} ms
          {row.model_ms !== null && (
            <span className="dec__split">
              guard {row.guard_ms ?? 0} · model {row.model_ms}
            </span>
          )}
        </span>
        <span className="dec__chev">details</span>
      </summary>

      <div className="dec__body">
        <div className="dec__section">
          <h3>Prompt sent</h3>
          <p className="dec__text">{row.prompt ?? 'Not captured (CAPTURE_CONTENT is off).'}</p>
        </div>

        <div className="dec__section">
          <h3>Response</h3>
          {row.verdict === 'blocked' ? (
            <p className="dec__text dec__text--withheld">
              {/*
               * The withheld text is deliberately NOT stored (CAPTURE_CONTENT covers the
               * prompt and the shown answer only), so this panel must not render a
               * `row.answer` branch that can never be truthy, nor imply it is holding the
               * text back. State what is known and say what is not kept.
               */}
              {row.blocked_side === 'response'
                ? 'Withheld on the response side — the model answered and AI Guard stopped the answer before the reader saw it. The withheld text is not stored, by design.'
                : 'Never sent to the model — AI Guard blocked the prompt first.'}
            </p>
          ) : (
            <p className="dec__text">{row.answer ?? 'Not captured (CAPTURE_CONTENT is off).'}</p>
          )}
        </div>

        <div className="dec__section">
          <h3>Detectors — prompt side</h3>
          <DetectorTable rows={dets.in} side="in" />
        </div>

        <div className="dec__section">
          <h3>Detectors — response side</h3>
          {row.response_inspected ? (
            <DetectorTable rows={dets.out} side="out" />
          ) : row.blocked_side === 'prompt' ? (
            <p className="dec__text" style={{ borderLeftColor: 'var(--border-strong)' }}>
              Not applicable — AI Guard blocked the prompt, so the model was never called and
              there was no response to inspect.
            </p>
          ) : row.verdict === 'error' ? (
            <p className="dec__text" style={{ borderLeftColor: 'var(--bad)' }}>
              The response was not inspected because the AI Guard response call failed before it
              returned a verdict. The answer still went out. That is a configuration or
              connectivity failure, not a policy decision.
            </p>
          ) : (
            <p className="dec__text" style={{ borderLeftColor: 'var(--gov-orange)' }}>
              The response was not inspected on this interaction — this policy has no enabled OUT
              detectors, so the answer went out unchecked by design.
            </p>
          )}
        </div>

        <div className="dec__section">
          <h3>Decision detail</h3>
          <dl className="dec__meta">
            <div>
              <dt>Verdict</dt>
              <dd>{row.verdict}</dd>
            </div>
            <div>
              <dt>Blocked side</dt>
              <dd>{row.blocked_side ?? '—'}</dd>
            </div>
            <div>
              <dt>Path</dt>
              <dd>{row.guard_mode === 'guarded' ? 'through AI Guard' : 'direct to model'}</dd>
            </div>
            <div>
              <dt>HTTP</dt>
              <dd>{row.http_status || '—'}</dd>
            </div>
            <div>
              <dt>Round trip</dt>
              <dd>{row.latency_ms} ms</dd>
            </div>
            <div>
              <dt>AI Guard</dt>
              <dd>
                {/*
                 * Only DAS mode times the guard separately. Proxy mode and the unguarded
                 * path leave guard_ms at 0, and printing "0 ms" beside a three-second round
                 * trip reads as "the guard is free" when it means "we did not measure it".
                 */}
                {row.guard_mode !== 'guarded' ||
                (row.guard_in_ms === null && row.guard_out_ms === null)
                  ? 'not measured'
                  : `${row.guard_ms ?? 0} ms`}
              </dd>
            </div>
            <div>
              <dt>Guard — prompt</dt>
              <dd>{row.guard_in_ms === null ? 'not called' : `${row.guard_in_ms} ms`}</dd>
            </div>
            <div>
              <dt>Guard — response</dt>
              <dd>{row.guard_out_ms === null ? 'not called' : `${row.guard_out_ms} ms`}</dd>
            </div>
            <div>
              <dt>Model</dt>
              <dd>{row.model_ms ? `${row.model_ms} ms` : 'not measured'}</dd>
            </div>
            <div>
              <dt>Prompt</dt>
              <dd>{row.prompt_chars} chars</dd>
            </div>
            <div>
              <dt>Model</dt>
              <dd>{row.model ?? '—'}</dd>
            </div>
            <div>
              <dt>Session</dt>
              <dd>{row.session_id.slice(0, 8)}</dd>
            </div>
          </dl>
        </div>

        {row.block_message && (
          <div className="dec__section">
            <h3>What AI Guard returned</h3>
            <p className="dec__text">{row.block_message}</p>
          </div>
        )}
      </div>
    </details>
  )
}

export function ConsoleDecisions() {
  const [rows, setRows] = useState<Row[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const [a, b] = await Promise.all([api.interactions(undefined, 100), api.stats()])
      setRows(a.interactions as unknown as Row[])
      setStats(b.stats)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    const t = setInterval(() => void load(), 5000)
    return () => clearInterval(t)
  }, [])

  const total = stats.reduce((n, s) => n + s.count, 0)
  const blocked = stats.filter((s) => s.verdict === 'blocked').reduce((n, s) => n + s.count, 0)
  /*
   * A verdict of `allowed` on an UNGUARDED row means "the model answered and nothing
   * inspected it". Counting those as "Allowed by AI Guard" put a third of the
   * uninspected bypass runs into the headline number the demo exists to prove.
   */
  const allowed = stats
    .filter((s) => s.verdict === 'allowed' && s.guard_mode === 'guarded')
    .reduce((n, s) => n + s.count, 0)
  const avgLatency =
    total > 0
      ? Math.round(stats.reduce((n, s) => n + s.avg_latency * s.count, 0) / total)
      : 0

  return (
    <>
      <div className="stat-row">
        <div className="stat">
          <div className="stat__value">{total}</div>
          <div className="stat__label">Interactions observed</div>
        </div>
        <div className="stat">
          <div className="stat__value">{allowed}</div>
          <div className="stat__label">Allowed by AI Guard</div>
        </div>
        <div className="stat">
          <div className="stat__value">{blocked}</div>
          <div className="stat__label">Blocked by AI Guard</div>
        </div>
        <div className="stat">
          <div className="stat__value">{total > 0 ? `${avgLatency} ms` : '—'}</div>
          <div className="stat__label">Mean round-trip</div>
        </div>
        <div className="stat">
          <div className="stat__value">
            {stats.filter((s) => s.guard_mode === 'unguarded').reduce((n, s) => n + s.count, 0)}
          </div>
          <div className="stat__label">Uninspected (bypass)</div>
        </div>
      </div>

      <div className="console__panel">
        <h2>Recent decisions</h2>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--gov-grey-11)', margin: '0 0 var(--space-3)' }}>
          Click any row to see the prompt, the response, and every detector that reported on it.
        </p>
        {error && <p style={{ color: 'var(--bad)' }}>{error}</p>}
        {loading && rows.length === 0 && <p>Loading…</p>}
        {!loading && rows.length === 0 && (
          <p>
            No interactions recorded yet. Open a site, send a prompt, then come back. This view
            refreshes every 5 seconds.
          </p>
        )}
        {rows.length > 0 && (
          <div className="decisions">
            {rows.map((r) => (
              <Decision key={r.id} row={r} />
            ))}
          </div>
        )}
      </div>

      <details className="console__panel">
        <summary
          style={{
            cursor: 'pointer',
            color: 'var(--gov-grey-11)',
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          About this view
        </summary>
        <div style={{ marginTop: 'var(--space-4)' }}>
          <p>
            This console records what the application observed: AI Guard&rsquo;s allow or block
            decision, which detectors reported and at what score, the prompt, the answer, and the
            round-trip time. It makes no judgements of its own.
          </p>
          <p>
            Detector thresholds and policy history live in the Zscaler AI Guard portal. Show this
            console for the app-side experience, then switch to the portal for the control detail.
          </p>
          <p className="mono">
            Prompt and response capture is on for this demo estate (CAPTURE_CONTENT). Every person
            and identifier here is fictional; in a real deployment this setting would be off and
            the table would hold metadata only.
          </p>
        </div>
      </details>
    </>
  )
}
