/**
 * Shared types. Imported by the Worker (authoritative) and the React client.
 *
 * Design note: there is deliberately NO detector model here. Every control
 * decision is made by Zscaler AI Guard in the request path. This application
 * observes and records what AI Guard reported — it never evaluates content
 * itself.
 */

export type Verdict = 'allowed' | 'blocked' | 'error'

export type SiteKind = 'department' | 'health'

/**
 * Public-facing, or the unmanaged public LLM on the simulated desktop.
 *
 * Each kind is a separate AI Guard application. The desktop surface is the
 * counter-example: a tool nobody sanctioned, which is exactly why it matters.
 */
export type AssistantKind = 'public' | 'desktop'

export interface SuggestedPrompt {
  /**
   * Route slugs this question belongs to. Absent = shown on every page of the site.
   *
   * Presenter cues used to be one flat list per site, so standing on /mountdis/summit-cafe
   * offered "is my father in Ward 3B". The drawer now shows what matches the page in
   * front of the audience, and keeps the rest behind a disclosure.
   */
  page?: string[]
  /**
   * What this cue is supposed to demonstrate, so it can be checked mechanically.
   *
   * `tools/cue_audit.py` replays every cue against the tenant and fails when a cue
   * marked `block` passes — a cue note that lies is worse than no note.
   */
  expect?: 'allow' | `block:${string}`
  label: string
  prompt: string
  /** Presenter-facing explanation. Only shown when presenter notes are on. */
  note: string
}

export interface AssistantDef {
  /** AI Guard application identity, must match the name in the portal. */
  appId: string
  /** Which fiction site this assistant belongs to. Explicit, not derived. */
  siteId: string
  kind: AssistantKind
  name: string
  tagline: string
  /** Plain-language disclosure shown in the assistant UI. */
  disclosure: string
  /** App scope, tone and quality rules. Always sent. */
  systemPrompt: string
  /**
   * Control instructions — PII, injection, secrets, advice boundaries.
   *
   * Sent ONLY when PROMPT_HARDENING is enabled. By default these are absent,
   * because the control is AI Guard's job: keeping them in the app prompt would
   * mean a refusal could come from either the model or the guardrail, and nobody
   * in the room could tell which. That ambiguity is the thing this demo cannot
   * afford.
   */
  securityBoundaries: string
  suggestedPrompts: SuggestedPrompt[]
}

export interface SiteDef {
  id: string
  name: string
  shortName: string
  kind: SiteKind
  assistants: { public: AssistantDef }
}

export interface Interaction {
  id: string
  createdAt: string
  /** AI Guard application identity — which assistant handled this. */
  appId: string
  /** Whether the prompt went through AI Guard, or straight to the model. */
  guardMode: 'guarded' | 'unguarded'
  siteId: string
  assistantName: string
  sessionId: string
  /** What AI Guard decided, as observed from the proxy response. */
  verdict: Verdict
  /** Which side of the exchange the guard rejected, when it did. */
  blockedSide: 'prompt' | 'response' | null
  /**
   * Whether AI Guard inspected the response.
   *
   * False when the guard was off, and false when the policy has no OUT detectors
   * configured — in which case the answer went out uninspected and the audit trail
   * must say so rather than implying otherwise.
   */
  responseInspected: boolean
  /** Raw HTTP status returned by AI Guard. */
  httpStatus: number
  answer: string
  blockMessage: string | null
  /**
   * What the *user* is told when a request is blocked.
   *
   * In-fiction wording from the application. The person using the site is never
   * told that an inspection service exists, so the raw guard response must not be
   * shown to them — only to the presenter.
   */
  userMessage: string | null
  latencyMs: number
  /** Time spent inside AI Guard (the IN and OUT detection calls together), in ms. */
  guardMs?: number
  /** The prompt-side detection call. Null when it never ran. */
  guardInMs?: number | null
  /** The response-side detection call. Null when the model was never reached. */
  guardOutMs?: number | null
  /** Time spent waiting on the model, in ms. */
  modelMs?: number
  model: string | null
  promptChars: number
  /** Only populated when CAPTURE_CONTENT is enabled. Otherwise null. */
  prompt: string | null
  /** Every detector that fired or reported, per direction. Console detail only. */
  detectors?: { in: DetectorHit[]; out: DetectorHit[] }
}

/** One detector's verdict on one direction of one interaction. */
export interface DetectorHit {
  name: string
  action: string
  score: number | null
  severity: string
  taxonomy: string
}

export interface ChatRequest {
  appId: string
  sessionId: string
  prompt: string
}

export type GuardMode = 'das' | 'proxy' | 'none'

export interface DemoStatus {
  /** Which environment this build is serving: 'production' | 'preview' | 'dev'. */
  environment: string
  /** Deployed Worker version id and commit tag, when the platform supplies them. */
  version: string | null
  commit: string | null
  /** When that version was uploaded (ISO), or null under `wrangler dev`. */
  deployedAt: string | null
  /** Which guarded path is active, if any. */
  guardMode: GuardMode
  proxyConfigured: boolean
  /** True when an unguarded path exists (provider key or Workers AI binding). */
  bypassAvailable: boolean
  /** How the unguarded path reaches a model. */
  bypassProvider: 'provider-api' | 'workers-ai' | 'none'
  /** Model the unguarded path uses. */
  bypassModel: string
  /** Whether control instructions are appended to the app system prompt. */
  promptHardening: boolean
  /** Wire shape the guarded path speaks: 'anthropic' or 'openai'. */
  guardApiStyle: string
  /** DAS endpoint in use, when the DAS path is active. */
  dasUrl: string
  /** Policy IDs resolved per appId (may be a single fallback). */
  policyIds: Record<string, string>
  proxyUrl: string
  model: string
  missingSecrets: string[]
  siteCount: number
  assistantCount: number
  requireAuth: boolean
  captureContent: boolean
}
