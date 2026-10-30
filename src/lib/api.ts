/** Browser-side API calls. Thin — all judgement happens server-side. */
import type { DemoStatus, Interaction } from '../shared/types'

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  const body = (await res.json().catch(() => ({}))) as unknown
  if (!res.ok) {
    const msg =
      (body as { message?: string })?.message ??
      (body as { error?: string })?.error ??
      `Request failed (${res.status})`
    const err = new Error(msg) as Error & { status?: number; code?: string }
    err.status = res.status
    err.code = (body as { error?: string })?.error
    throw err
  }
  return body as T
}

export const api = {
  status: () => req<DemoStatus>('/api/status'),

  login: (password: string) =>
    req<{ ok: boolean }>('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  chat: (appId: string, sessionId: string, prompt: string, guard: boolean) =>
    req<{ interaction: Interaction }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ appId, sessionId, prompt, guard }),
    }),

  interactions: (appId?: string, limit = 50) =>
    req<{ interactions: Record<string, unknown>[] }>(
      `/api/interactions?limit=${limit}${appId ? `&appId=${appId}` : ''}`,
    ),

  stats: () =>
    req<{
      stats: {
        app_id: string
        site_id: string
        guard_mode: string
        verdict: string
        count: number
        avg_latency: number
      }[]
    }>('/api/stats'),
}
