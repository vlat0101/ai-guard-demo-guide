import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ConsoleDecisions, ConsoleShell } from './console/Console'
import { Landing } from './sites/Landing'
import { DroSite } from './sites/dro/DroSite'
import { MountDisSite } from './sites/mountdis/MountDisSite'
import { ShadowDesktop } from './sites/desktop/ShadowDesktop'
import { api } from './lib/api'
import { GuardContext, PresenterContext, StatusContext } from './lib/guard'
import type { DemoStatus } from './shared/types'

type AuthState = 'checking' | 'locked' | 'open'

function Gate({ onOpen }: { onOpen: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  return (
    <div className="gate">
      <div className="gate__card">
        <h1>Zscaler AI Guard demo</h1>
        <p className="small muted">
          Fictional Australian state government and health service sites, built to demonstrate AI Guard.
          Enter the demonstration password to continue.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setBusy(true)
            setError(null)
            try {
              await api.login(password)
              onOpen()
            } catch (err) {
              setError((err as Error).message)
            } finally {
              setBusy(false)
            }
          }}
        >
          <label htmlFor="pw" className="tiny muted">
            Demo password
          </label>
          <input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
          />
          {error && (
            <p className="small" style={{ color: 'var(--bad)' }}>
              {error}
            </p>
          )}
          <button className="btn" type="submit" disabled={busy || !password}>
            {busy ? 'Checking…' : 'Enter'}
          </button>
        </form>
        <p className="tiny muted" style={{ marginTop: 'var(--space-5)' }}>
          No real data is used on these sites. Identifiers are invalid by construction.
        </p>
      </div>
    </div>
  )
}

/** Console tabs that are pointers, not fabricated data. */
function ConsolePointer({ title, body }: { title: string; body: string }) {
  return (
    <ConsoleShell>
      <div className="console__panel">
        <h2>{title}</h2>
        <p>{body}</p>
        <p className="mono">
          Deliberately not simulated here. Inventing a detector breakdown would be indistinguishable
          from the real thing in a customer demo, which is exactly the problem.
        </p>
      </div>
    </ConsoleShell>
  )
}

export default function App() {
  const [auth, setAuth] = useState<AuthState>('checking')
  const [status, setStatus] = useState<DemoStatus | null>(null)
  /** AI Guard demonstration switch. Persisted so it survives navigation. */
  const [guardOn, setGuardOn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('zdemo.guard') !== '0'
    } catch {
      return true
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('zdemo.guard', guardOn ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [guardOn])

  /** Presenter mode — global so the banner and every panel agree. */
  const [presenter, setPresenter] = useState<boolean>(() => {
    try {
      return localStorage.getItem('zdemo.presenter') === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('zdemo.presenter', presenter ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [presenter])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const s = await api.status().catch(() => null)
      if (cancelled) return
      setStatus(s)
      if (s && !s.requireAuth) {
        setAuth('open')
        return
      }
      try {
        await api.interactions(undefined, 1)
        if (!cancelled) setAuth('open')
      } catch (e) {
        const err = e as Error & { status?: number }
        if (!cancelled) setAuth(err.status === 401 ? 'locked' : 'open')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (auth === 'checking') {
    return (
      <div className="gate">
        <p style={{ color: 'white' }}>Loading…</p>
      </div>
    )
  }

  if (auth === 'locked') {
    return <Gate onOpen={() => setAuth('open')} />
  }

  return (
    <GuardContext.Provider
      value={{ enabled: guardOn, setEnabled: setGuardOn, bypassAvailable: status?.bypassAvailable ?? false }}
    >
      <StatusContext.Provider value={{ status }}>
      <PresenterContext.Provider value={{ presenter, setPresenter }}>
      <Routes>
      <Route path="/" element={<Landing status={status} />} />

      <Route path="/dro" element={<DroSite status={status} />} />
      {/* The assistant moved into a persistent dock; keep old links working. */}
      <Route path="/dro/ask" element={<Navigate to="/dro" replace />} />
      <Route path="/dro/:slug" element={<DroSite status={status} />} />

      <Route path="/mountdis" element={<MountDisSite status={status} />} />
      <Route path="/mountdis/ask" element={<Navigate to="/mountdis" replace />} />
      <Route path="/mountdis/:slug" element={<MountDisSite status={status} />} />

      {/* The unmanaged surface: a staff desktop, not part of either site. */}
      <Route path="/shadow-ai" element={<ShadowDesktop status={status} />} />

      <Route
        path="/console"
        element={
          <ConsoleShell>
            <ConsoleDecisions />
          </ConsoleShell>
        }
      />
      <Route
        path="/console/policies"
        element={
          <ConsolePointer
            title="Policy configurations"
            body="Three AI Guard applications are exercised here: dro-public and mtdis-public on the two sites, plus mtdis-staff behind the shadow-AI desktop. Configuration — detectors, severity, threshold and action — is managed in the AI Guard portal under Policy > Configurations. This demo does not mirror it."
          />
        }
      />
      <Route
        path="/console/redteam"
        element={
          <ConsolePointer
            title="Red team"
            body="AI Red Teaming runs continuously against the tenant and reports findings mapped to AI risk frameworks, with prompt-hardening remediation. Results are in the portal."
          />
        }
      />
      <Route
        path="/console/assets"
        element={
          <ConsolePointer
            title="AI assets"
            body="AI Asset Management discovers AI applications, agents and models in use across the estate, and flags unsanctioned ones. Even the public LLM on the desktop is a registered application here, because its traffic is inspected; the full inventory lives in the portal."
          />
        }
      />
      <Route path="*" element={<Landing status={status} />} />
      </Routes>
      </PresenterContext.Provider>
      </StatusContext.Provider>
    </GuardContext.Provider>
  )
}
