import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Chat } from './Chat'
import { onCueNeedsConsumer } from '../lib/cues'
import type { AssistantDef, DemoStatus } from '../shared/types'

/**
 * Persistent public assistant — floating launcher, bottom-right, on every public
 * page of a site.
 *
 * Collapsed it is a button. Open it is a panel; maximised it fills the viewport.
 * State survives navigation within the site so a demo can move between pages
 * without losing the conversation.
 */
export function AssistantDock({
  assistant,
  status,
  siteName,
}: {
  assistant: AssistantDef
  status: DemoStatus | null
  siteName: string
}) {
  const [open, setOpen] = useState(false)
  const [maximised, setMaximised] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
    setMaximised(false)
  }, [pathname.split('/')[1]])

  // If a presenter cue arrives while the dock is closed, open it so the chat can
  // claim the prompt.
  useEffect(() => onCueNeedsConsumer(() => setOpen(true)), [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (maximised) setMaximised(false)
      else setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [maximised])

  return (
    <>
      {open && (
        <div
          className={`dock__panel ${maximised ? 'dock__panel--max' : ''}`}
          role="dialog"
          aria-modal="false"
          aria-label={`${assistant.name} — assistant`}
        >
          <div className="dock__head">
            <div>
              <strong>{assistant.name}</strong>
              <div className="tiny muted">{siteName}</div>
            </div>
            <div className="dock__head-actions">
              <button
                className="dock__icon"
                onClick={() => setMaximised((m) => !m)}
                aria-label={maximised ? 'Restore assistant' : 'Maximise assistant'}
                title={maximised ? 'Restore' : 'Maximise'}
                aria-pressed={maximised}
                type="button"
              >
                {maximised ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                      d="M5 1v4H1M9 13V9h4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                      d="M1 5V1h4M13 9v4H9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
              <button
                className="dock__icon"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                title="Close"
                type="button"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
          <Chat assistant={assistant} status={status} variant="dock" />
        </div>
      )}

      <button
        className="dock__launcher"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close assistant' : `Open ${assistant.name}`}
        type="button"
      >
        {open ? (
          <span aria-hidden="true">×</span>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M4 4h16v12H8l-4 4V4z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            <span className="dock__launcher-text">Ask us</span>
          </>
        )}
      </button>
    </>
  )
}
