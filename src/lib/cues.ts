/**
 * Event bus between the presenter drawer and the assistant.
 *
 * The drawer lives in the site chrome, not inside the chat, so the chat box
 * carries nothing but the conversation. Two wrinkles make a plain emitter not
 * enough:
 *
 * 1. The public assistant is a floating dock that only mounts its chat when open.
 *    A cue fired while it is closed has no listener, so it is held as `pending`
 *    and the dock is told to open itself. The chat then claims the pending cue
 *    when it mounts.
 * 2. If the chat is already open, the cue must go straight through, with no
 *    detour through state.
 */
type Handler = (text: string) => void
type Opener = () => void

const handlers = new Set<Handler>()
const openers = new Set<Opener>()
let pending: string | null = null

/** Ask for `text` to be typed into the assistant and sent. */
export function fireCue(text: string): void {
  if (handlers.size > 0) {
    for (const fn of handlers) fn(text)
    return
  }
  // Nobody is listening: hold it and ask the surface to open.
  pending = text
  for (const fn of openers) fn()
}

/** A mounted assistant subscribes here. */
export function onCue(fn: Handler): () => void {
  handlers.add(fn)
  return () => {
    handlers.delete(fn)
  }
}

/** The dock subscribes here so it can open itself when a cue arrives. */
export function onCueNeedsConsumer(fn: Opener): () => void {
  openers.add(fn)
  return () => {
    openers.delete(fn)
  }
}

/** A newly mounted assistant claims anything that arrived while it was closed. */
export function takePendingCue(): string | null {
  const text = pending
  pending = null
  return text
}
