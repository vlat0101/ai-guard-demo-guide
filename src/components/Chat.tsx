import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import { onCue, takePendingCue } from '../lib/cues'
import { runTyping } from '../lib/typing'
import { useGuard, usePresenter } from '../lib/guard'
import type { AssistantDef, DemoStatus, Interaction } from '../shared/types'

/** Small markdown subset: bold, links, bullets, tables. Enough for assistant copy. */
function renderInline(text: string) {
  const parts: (string | JSX.Element)[] = []
  const re = /(\*\*[^*]+\*\*)|(https?:\/\/[^\s<>"')]+)/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[1]) parts.push(<strong key={key++}>{m[1].slice(2, -2)}</strong>)
    else if (m[2])
      parts.push(
        <a key={key++} href={m[2]} target="_blank" rel="noopener noreferrer nofollow">
          {m[2]}
        </a>,
      )
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function Markdown({ text }: { text: string }) {
  const lines = text.split('\n')
  const blocks: JSX.Element[] = []
  let list: string[] = []
  let table: string[] = []

  const flushList = () => {
    if (list.length === 0) return
    blocks.push(
      <ul key={`ul-${blocks.length}`}>
        {list.map((li, i) => (
          <li key={i}>{renderInline(li)}</li>
        ))}
      </ul>,
    )
    list = []
  }

  const flushTable = () => {
    if (table.length === 0) return
    const rows = table
      .filter((r) => !/^\|[\s:|-]+\|$/.test(r.trim()))
      .map((r) =>
        r
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => c.trim()),
      )
    const [head, ...body] = rows
    blocks.push(
      <table key={`t-${blocks.length}`}>
        {head && (
          <thead>
            <tr>
              {head.map((h, i) => (
                <th key={i}>{renderInline(h)}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {body.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{renderInline(c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>,
    )
    table = []
  }

  for (const line of lines) {
    const t = line.trim()
    if (t.startsWith('|')) {
      flushList()
      table.push(line)
      continue
    }
    flushTable()
    if (/^[-*]\s+/.test(t)) {
      list.push(t.replace(/^[-*]\s+/, ''))
      continue
    }
    flushList()
    if (t === '') continue
    blocks.push(<p key={`p-${blocks.length}`}>{renderInline(t)}</p>)
  }
  flushTable()
  flushList()
  return <>{blocks}</>
}

interface Turn {
  id: string
  role: 'user' | 'assistant' | 'blocked' | 'error'
  text: string
  meta?: Interaction
}

export function Chat({
  assistant,
  status,
  variant = 'page',
  slimHead = false,
}: {
  assistant: AssistantDef
  status: DemoStatus | null
  variant?: 'page' | 'dock'
  /** The staff portal already renders the title, so skip the chat header title. */
  slimHead?: boolean
}) {
  const [turns, setTurns] = useState<Turn[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  /** True while a cue is being typed into the composer. */
  const [typing, setTyping] = useState(false)
  const { presenter } = usePresenter()
  const { enabled: guardOn } = useGuard()
  const sessionRef = useRef<string>(crypto.randomUUID())
  const logRef = useRef<HTMLDivElement>(null)
  /** Cancels an in-flight typing animation when a new cue arrives. */
  const typeToken = useRef(0)
  const typer = useRef<{ cancel: () => void } | null>(null)

  /** When AI Guard is not connected the service genuinely is unavailable. */
  const available = guardOn ? status?.proxyConfigured !== false : status?.bypassAvailable === true

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns, busy])

  async function send(prompt: string) {
    const text = prompt.trim()
    if (!text || busy) return
    setInput('')
    setTurns((t) => [...t, { id: crypto.randomUUID(), role: 'user', text }])
    setBusy(true)
    try {
      const { interaction } = await api.chat(assistant.appId, sessionRef.current, text, guardOn)
      setTurns((t) => [
        ...t,
        {
          id: interaction.id,
          role:
            interaction.verdict === 'allowed'
              ? 'assistant'
              : interaction.verdict === 'blocked'
                ? 'blocked'
                : 'error',
          /*
           * Always the in-fiction message, never the detector — even in presenter mode.
           * Presenter mode changes what the *operator* can see, not what the person at
           * the keyboard is told. The technical detail lives in the verdict strip below
           * (presenter only), the drawer, and the console.
           *
           * `error` is NOT a block. The server sets `userMessage` only for a real
           * verdict, so falling through to the block string here told the audience
           * "that request was blocked" when AI Guard had failed, been unreachable, or
           * been misconfigured — blaming the control for our outage, which is the one
           * failure the demo must never disguise.
           */
          text:
            interaction.verdict === 'allowed'
              ? interaction.answer
              : interaction.verdict === 'blocked'
                ? (interaction.userMessage ?? 'That request was blocked.')
                : 'The assistant is having trouble right now. Please try again in a moment.',
          meta: interaction,
        },
      ])
    } catch (err) {
      const e = err as Error & { code?: string }
      setTurns((t) => [
        ...t,
        {
          id: crypto.randomUUID(),
          role: 'error',
          text:
            e.code === 'not_configured' || e.code === 'bypass_not_configured'
              ? e.message
              : `The assistant could not complete this request: ${e.message}`,
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  /**
   * Receive a cue and type it into the composer, then send it.
   *
   * The point is that the audience sees a person typing a question, not a question
   * materialising. Long prompts would take an absurd time at a fixed per-character
   * delay, so the duration is capped and the step size scales with length — the
   * rhythm stays human without a 400-character prompt taking twenty seconds.
   */
  async function typeAndSend(text: string) {
    if (busy || !available) return
    typeToken.current += 1
    const token = typeToken.current
    if (typer.current) typer.current.cancel()

    setTyping(true)
    await new Promise<void>((resolve) => {
      typer.current = runTyping(
        text,
        (partial) => {
          if (typeToken.current === token) setInput(partial)
        },
        () => resolve(),
      )
    })
    typer.current = null

    if (typeToken.current !== token) return
    setTyping(false)
    void send(text)
  }

  // A cue fired while the dock was closed was held for us; run it now.
  useEffect(() => {
    const held = takePendingCue()
    if (held) void typeAndSend(held)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const off = onCue((text) => {
      void typeAndSend(text)
    })
    return () => {
      off()
      typer.current?.cancel()
      typeToken.current += 1
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, available])

  return (
    <div className={`chat chat--${variant}`}>
      {variant === 'page' && !slimHead && (
        <div className="chat__head">
          <h2>{assistant.name}</h2>
          <span className="tiny muted">{assistant.tagline}</span>
        </div>
      )}

      {!available && (
        <div className="notice notice--bad" style={{ margin: 0, borderRadius: 0 }}>
          <p>
            <strong>This assistant is temporarily unavailable.</strong> It cannot answer questions
            right now. For urgent matters, contact the switchboard.
          </p>
          {presenter && (
            <p className="mono">
              Not a site fault.{' '}
              {guardOn
                ? `AI Guard is not connected — set ${(status?.missingSecrets ?? ['AI_GUARD_API_KEY']).join(', ')}.`
                : 'No unguarded model route is available — a Workers AI binding or LLM_API_KEY is required.'}{' '}
              No prompt is sent anywhere until then.
            </p>
          )}
        </div>
      )}

      <div className="chat__log" ref={logRef} aria-live="polite">
        {turns.length === 0 && (
          <p className="muted small">
            {variant === 'dock'
              ? 'Ask a question about our services.'
              : 'This assistant is part of a pilot. Answers are advisory only.'}
          </p>
        )}

        {turns.map((t) => (
          <div
            key={t.id}
            className={
              'msg ' +
              (t.role === 'user'
                ? 'msg--user'
                : t.role === 'blocked' && presenter
                  ? 'msg--blocked'
                  : t.role === 'error'
                    ? 'msg--error'
                    : 'msg--assistant')
            }
          >
            <div className="msg__label">
              {t.role === 'user'
                ? 'You'
                : t.role === 'blocked' && presenter
                  ? 'Unable to complete'
                  : t.role === 'error'
                    ? 'Not completed'
                    : assistant.name}
            </div>
            {t.role === 'assistant' || (t.role === 'blocked' && !presenter) ? (
              <Markdown text={t.text} />
            ) : (
              <p>{t.text}</p>
            )}

            {t.meta && presenter && (
              <div className="verdict">
                <span className="verdict__mode">
                  {t.meta.verdict === 'allowed'
                    ? 'Allowed'
                    : t.meta.verdict === 'blocked'
                      ? 'Blocked'
                      : 'Error'}
                </span>
                <span>HTTP {t.meta.httpStatus || '—'}</span>
                <span>{t.meta.latencyMs} ms</span>
                <span className="mono">{t.meta.model ?? 'model unknown'}</span>
                <span className="mono">{t.meta.appId}</span>
                <span
                  className={
                    'pill ' +
                    (t.meta.guardMode !== 'guarded'
                      ? 'pill--warn'
                      : t.meta.responseInspected
                        ? 'pill--info'
                        : 'pill--warn')
                  }
                >
                  {/*
                   * "Guarded" is not the same as "the answer was inspected": a policy
                   * with no OUT detectors, or an OUT call that produced no verdict,
                   * still routes through the guard. Only claim the answer was checked
                   * when the record says so — the console is honest about this and the
                   * projector was not.
                   */}
                  {t.meta.guardMode !== 'guarded'
                    ? 'Direct, uninspected'
                    : t.meta.responseInspected
                      ? 'Via AI Guard, answer checked'
                      : 'Via AI Guard, answer NOT inspected'}
                </span>
                {t.meta.blockedSide && (
                  <span className="mono">blocked on the {t.meta.blockedSide}</span>
                )}
                {t.meta.blockMessage && (
                  <span className="verdict__reason mono">{t.meta.blockMessage}</span>
                )}
              </div>
            )}
          </div>
        ))}

        {busy && (
          <div className="msg msg--assistant">
            <div className="msg__label">{assistant.name}</div>
            <p className="muted">Looking that up…</p>
          </div>
        )}
      </div>

      <form
        className="chat__composer"
        onSubmit={(e) => {
          e.preventDefault()
          void send(input)
        }}
      >
        <label htmlFor={`prompt-${assistant.appId}`} className="tiny muted" style={{ display: 'none' }}>
          Your question
        </label>
        <textarea
          id={`prompt-${assistant.appId}`}
          value={input}
          placeholder="Type your question…"
          onChange={(e) => {
            // A person taking over interrupts the cue.
            typeToken.current += 1
            typer.current?.cancel()
            typer.current = null
            setTyping(false)
            setInput(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void send(input)
            }
          }}
          disabled={busy || !available || typing}
        />
        <button
          className="btn"
          type="submit"
          disabled={busy || !available || typing || !input.trim()}
        >
          {typing ? '…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
