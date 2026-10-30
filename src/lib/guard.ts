import { createContext, useContext } from 'react'
import type { DemoStatus } from '../shared/types'

/**
 * AI Guard on/off, for the demonstration switch.
 *
 * ON  — prompts go to the AI Guard inline reverse proxy and are inspected.
 * OFF — prompts go straight to the model, uninspected.
 *
 * This is a demonstration device, not a product feature.
 */
export interface GuardState {
  enabled: boolean
  setEnabled: (v: boolean) => void
  /** False when no unguarded route exists on the deployment. */
  bypassAvailable: boolean
}

export const GuardContext = createContext<GuardState>({
  enabled: true,
  setEnabled: () => {},
  bypassAvailable: false,
})

export const useGuard = () => useContext(GuardContext)

/**
 * Presenter mode.
 *
 * Off is the audience view: the site behaves like a real application and says
 * nothing about inspection, verdicts, models or paths. On is the operator view:
 * the guard switch appears in the banner, every answer grows a verdict strip, and
 * scenario notes become visible.
 *
 * Global rather than per-chat so the banner and every panel agree — a switch that is
 * visible in one place and hidden in another leaks the mechanism by accident.
 */
export interface PresenterState {
  presenter: boolean
  setPresenter: (v: boolean) => void
}

export const PresenterContext = createContext<PresenterState>({
  presenter: false,
  setPresenter: () => {},
})

export const usePresenter = () => useContext(PresenterContext)

/**
 * Deployment status, app-wide.
 *
 * The header bar shows which environment the page is being served from, and the
 * all-sites page shows the same plus the change log. Both need the value App already
 * fetches, so it goes through context rather than a second request per surface.
 */
export interface StatusState {
  status: DemoStatus | null
}

export const StatusContext = createContext<StatusState>({ status: null })

export const useStatus = () => useContext(StatusContext).status
