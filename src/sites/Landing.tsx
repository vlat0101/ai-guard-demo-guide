import { Link } from 'react-router-dom'
import { OrgMark } from '../components/chrome'
import { EnvironmentPanel } from '../components/Environment'
import { siteList } from '../shared/sites'
import type { DemoStatus } from '../shared/types'

export function Landing({ status }: { status: DemoStatus | null }) {
  return (
    <div className="site">
      <div className="demo-banner" role="note">
        <strong>Demo environment</strong> · Fictional organisations · Not affiliated with any
        Australian state government
      </div>

      <main className="site-main" id="main">
        <h1>Zscaler AI Guard — Australian state government demo</h1>
        <p className="lede">
          Two fictional organisations: a state government department and a public health service,
          both running a pilot AI assistant. Plus the surface neither organisation controls — a
          staff desktop with a public AI tool open in a browser.
        </p>

        <div className={`notice ${status?.guardMode !== 'none' ? 'notice--info' : 'notice--warn'}`}>
          {status?.guardMode === 'das' ? (
            <p>
              <strong>AI Guard connected — DAS/API mode.</strong> The application asks AI Guard for a
              verdict on each prompt before calling the model, and on each response before showing
              it. Endpoint <code>{status.dasUrl}</code>, {Object.keys(status.policyIds).length}{' '}
              policy mapping(s) configured.
            </p>
          ) : status?.guardMode === 'proxy' ? (
            <p>
              <strong>AI Guard connected — proxy mode.</strong> Inspection happens inline via{' '}
              <code>{status.proxyUrl}</code>.
            </p>
          ) : (
            <p>
              <strong>AI Guard is not connected on this deployment.</strong> The sites and the
              console will load, but no prompt will be inspected. Set a DAS bearer key
              (<code>AIG_DAS_API_KEY</code>) to enable the guarded path.
            </p>
          )}
        </div>

        <h2>Choose a site</h2>
        <div className="grid">
          {siteList().map((s) => (
            <Link className="card" to={`/${s.id}`} key={s.id}>
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <OrgMark org={s.id === 'dro' ? 'dro' : 'mountdis'} size={36} />
              </div>
              <h3>{s.name}</h3>
              <p>
                {s.kind === 'department'
                  ? 'Permits, consultations, publications and freedom of information — with a public assistant on every page.'
                  : 'Appointments, wards, visiting hours, parking and services — with a public assistant on every page.'}
              </p>
              <p style={{ marginTop: 'var(--space-3)' }} className="tiny">
                <strong>Assistant:</strong> {s.assistants.public.name}
              </p>
            </Link>
          ))}

          <Link className="card" to="/shadow-ai">
            <div style={{ marginBottom: 'var(--space-3)', fontSize: 30, lineHeight: 1 }}>
              🖥
            </div>
            <h3>Shadow AI — staff desktop</h3>
            <p>
              A staff member's desktop with a free public AI tool open in the browser. Nothing here
              belongs to either organisation, and nobody sanctioned it.
            </p>
            <p style={{ marginTop: 'var(--space-3)' }} className="tiny">
              <strong>Assistant:</strong> Natter (public LLM)
            </p>
          </Link>
        </div>

        <EnvironmentPanel />

        <h2>Operator console</h2>
        <p>
          The console is the screen you drive during a demonstration. It shows what AI Guard decided
          for each interaction, and the timings — the app-side view.{' '}
          <Link to="/console">Open the console</Link>
        </p>
        <div className="notice">
          <p>
            <strong>Where the detail lives.</strong> This application records only what it observed:
            allow or block, the reason AI Guard returned, and latency. Detector-by-detector scores,
            policy configuration and historical dashboards are in the Zscaler AI Guard portal — that
            is the product, and that is the screen to show after the console.
          </p>
        </div>

        <h2>About these sites</h2>
        <p className="small muted">
          The Department of Reasonable Outcomes and Mount Disappointment Health Service are invented.
          No real department, health service, hospital, person or identifier is represented. All
          identifiers are invalid by construction. No government logos, badges, coats of arms or licensed typefaces are used.
        </p>
      </main>

    </div>
  )
}
