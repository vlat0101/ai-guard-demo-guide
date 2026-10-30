/**
 * Demo chrome that must appear on every page (plan §5.3), plus the presentation
 * controls.
 *
 * Audience view (presenter mode off): demo banner and vendor mark only. Nothing
 * indicates that any inspection is happening, because from the user's side there is
 * no inspection service — there is only the application.
 *
 * Presenter view (presenter mode on): the AI Guard switch and, when the guard is
 * off, an explicit warning. That is the reveal, and the presenter controls it.
 */
import { useGuard, usePresenter } from '../lib/guard'
import { EnvBadge } from './Environment'

export function DemoBanner() {
  const { enabled, setEnabled, bypassAvailable } = useGuard()
  const { presenter } = usePresenter()

  return (
    <div className={`demo-banner ${presenter && !enabled ? 'demo-banner--off' : ''}`} role="note">
      <span>
        <strong>Demo environment</strong> · Fictional organisation · Not affiliated with any
        Australian state government
      </span>

      {/* Which deployment am I looking at? Factual, always visible, no internals. */}
      <EnvBadge />

      {presenter && (
        <label
          className="guard-switch"
          title={
            bypassAvailable
              ? 'Toggle AI Guard inspection. Off sends prompts straight to the model.'
              : 'Set an LLM_API_KEY or Workers AI binding to enable the unguarded comparison.'
          }
        >
          <input
            type="checkbox"
            checked={enabled}
            disabled={!bypassAvailable}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          <span className="guard-switch__track" aria-hidden="true">
            <span className="guard-switch__thumb" />
          </span>
          <span className="guard-switch__label">
            AI Guard <strong>{enabled ? 'ON' : 'OFF'}</strong>
          </span>
        </label>
      )}

      <span className="demo-banner__mark">Zscaler demo</span>

      {presenter && !enabled && (
        <span className="demo-banner__warn">
          Unguarded: prompts go straight to the model with no inspection. Do not type real data.
        </span>
      )}
    </div>
  )
}

/**
 * Original abstract marks using a standard government palette.
 *
 * Deliberately NOT any government logo, badge, coat of arms or official device —
 * those are protected marks and require written authorisation.
 */
export function OrgMark({ org, size = 40 }: { org: 'dro' | 'mountdis'; size?: number }) {
  if (org === 'dro') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        role="img"
        aria-label="Department of Reasonable Outcomes mark"
      >
        <rect width="40" height="40" fill="#201547" />
        <rect x="8" y="10" width="24" height="5" fill="#ffffff" />
        <rect x="8" y="18" width="18" height="5" fill="#00b2a9" />
        <rect x="8" y="26" width="12" height="5" fill="#ff9e1b" />
      </svg>
    )
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label="Mount Disappointment Health Service mark"
    >
      <rect width="40" height="40" fill="#004c97" />
      <rect x="15" y="8" width="10" height="24" fill="#00b2a9" />
      <rect x="8" y="15" width="24" height="10" fill="#ffffff" opacity="0.92" />
      <path d="M8 30 L18 22 L26 27 L32 20" stroke="#ff9e1b" strokeWidth="2.5" fill="none" />
    </svg>
  )
}
