/**
 * The typing animation used when a presenter cue is sent.
 *
 * Shared by the site assistants and the shadow-AI desktop so a cue behaves
 * identically on every surface: the audience sees a question being composed, not
 * a canned prompt appearing.
 *
 * Pace: ~28ms per character for prompts up to 160 characters, then a faster tick
 * so a 400-character pasted record finishes in about two seconds rather than
 * twelve. Without that second gear the animation becomes a wait.
 */
export interface TypingRun {
  /** Stop the animation. Safe to call after it has finished. */
  cancel(): void
}

export function runTyping(
  text: string,
  onChunk: (partial: string) => void,
  onDone: () => void,
): TypingRun {
  /**
   * Short prompts type one character at a time at ~28ms; long ones (a pasted
   * record) advance several characters per tick at a fixed 16ms so they finish in
   * about two seconds instead of twenty.
   *
   * Scaling the step alone is not enough: with a fixed 16ms tick and a step that
   * rounds to 1, every short prompt ends up at 16ms per character — measurably
   * faster than a person types. The tick length has to change with the length.
   */
  const charsPerTick = text.length <= 160 ? 1 : Math.ceil(text.length / 156)
  const tickMs = charsPerTick === 1 ? 28 : 16

  let i = 0
  let finished = false
  const id = window.setInterval(() => {
    i = Math.min(text.length, i + charsPerTick)
    onChunk(text.slice(0, i))
    if (i >= text.length) {
      window.clearInterval(id)
      finished = true
      onDone()
    }
  }, tickMs)

  return {
    cancel() {
      if (!finished) window.clearInterval(id)
      finished = true
    },
  }
}
