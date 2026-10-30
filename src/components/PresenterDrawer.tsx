/**
 * Presenter drawer — the roll-up panel at the bottom of every site page.
 *
 * Everything the operator needs and the audience should never see lives here:
 * the suggested questions with the reasoning behind each one, and the switch that
 * turns on presenter mode (verdict strips, guard switch, block reasons).
 *
 * Opening the drawer IS presenter mode. That keeps one control rather than two,
 * and makes the state impossible to get wrong in front of a customer: if the panel
 * is open, they are presenting; if it is closed, nothing on the page suggests that
 * anything is being inspected.
 *
 * The chat box itself carries no controls at all now — no toggles, no question
 * chips. A visitor sees an assistant and a text field, which is the whole point.
 */
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fireCue } from '../lib/cues'
import { usePresenter } from '../lib/guard'
import type { AssistantDef, SuggestedPrompt } from '../shared/types'

export function PresenterDrawer({
  assistant,
  cues,
  inline = false,
}: {
  assistant: AssistantDef
  /** Override the assistant's own list, for surfaces with their own scenarios. */
  cues?: SuggestedPrompt[]
  /** Sit in the normal flow instead of floating over the page (the desktop). */
  inline?: boolean
}) {
  const { presenter, setPresenter } = usePresenter()
  const { pathname } = useLocation()
  const [flash, setFlash] = useState<string | null>(null)

  // Close when moving between the two sites: the questions belong to one assistant.
  useEffect(() => {
    setFlash(null)
  }, [pathname.split('/')[1]])

  function cue(text: string, label: string) {
    fireCue(text)
    setFlash(label)
    window.setTimeout(() => setFlash((f) => (f === label ? null : f)), 1400)
  }

  // Show the questions that belong to the page in front of the audience. A presenter
  // standing on the café page should not be reading ward cues aloud.
  const slug = pathname.split('/')[2] ?? ''
  const all = cues ?? assistant.suggestedPrompts
  const here = all.filter((s) => !s.page || s.page.includes(slug))
  const elsewhere = all.filter((s) => s.page && !s.page.includes(slug))
  const items = here.length > 0 ? here : all
  const selfPath = pathname

  return (
    <div
      className={`pdrawer ${presenter ? 'pdrawer--open' : ''} ${inline ? 'pdrawer--inline' : ''}`}
    >
      <button
        type="button"
        className="pdrawer__handle"
        aria-expanded={presenter}
        aria-controls="presenter-panel"
        onClick={() => setPresenter(!presenter)}
      >
        <span className="pdrawer__chev" aria-hidden="true">
          {presenter ? '▾' : '▴'}
        </span>
        <span className="pdrawer__handle-label">
          Presenter{flash ? ` · typing “${flash}”` : ''}
        </span>
      </button>

      <div className="pdrawer__panel" id="presenter-panel" hidden={!presenter}>
        <div className="pdrawer__head">
          <div>
            <h2>
              Suggested questions <span className="pdrawer__for">— {assistant.name}</span>
            </h2>
            <p>
              Clicking one types it into the assistant and sends it, at human speed. The note under
              each question says what it is meant to demonstrate.
            </p>
          </div>
          <button type="button" className="pdrawer__close" onClick={() => setPresenter(false)}>
            Roll up
          </button>
        </div>

        <ul className="pdrawer__list">
          {items.map((s) => (
            <li key={s.label}>
              <button type="button" className="pdrawer__cue" onClick={() => cue(s.prompt, s.label)}>
                <span className="pdrawer__cue-label">{s.label}</span>
                <span className="pdrawer__cue-note">{s.note}</span>
                <span className="pdrawer__cue-text">{s.prompt}</span>
              </button>
            </li>
          ))}
        </ul>

        {elsewhere.length > 0 && (
          <details className="pdrawer__more">
            <summary>Questions for other pages ({elsewhere.length})</summary>
            <ul className="pdrawer__list">
              {elsewhere.map((s) => (
                <li key={s.label}>
                  <button type="button" className="pdrawer__cue" onClick={() => cue(s.prompt, s.label)}>
                    <span className="pdrawer__cue-label">{s.label}</span>
                    <span className="pdrawer__cue-note">{s.note}</span>
                    <span className="pdrawer__cue-text">{s.prompt}</span>
                  </button>
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="pdrawer__foot">
          <p>
            Presenter mode is on, so the chat also shows a verdict strip under each answer — path,
            status, latency and model. The AI Guard switch is in the banner at the top.
          </p>
          <nav className="pdrawer__nav" aria-label="Operator">
            <Link to="/console">Operator console</Link>
            {selfPath !== '/shadow-ai' && <Link to="/shadow-ai">Shadow-AI desktop</Link>}
            {selfPath !== '/' && <Link to="/">All demo sites</Link>}
          </nav>
        </div>
      </div>
    </div>
  )
}
