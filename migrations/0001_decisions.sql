-- Observed interactions.
--
-- Deliberately stores METADATA ONLY by default: no prompt text, no response text.
-- The demo is about not leaking sensitive data into AI systems, so the demo app
-- must not become a place where sensitive data is stored. Content capture is
-- opt-in via the CAPTURE_CONTENT var, for rehearsal only.
--
-- Every row records what AI GUARD reported, not a local judgement.
CREATE TABLE IF NOT EXISTS interactions (
  id           TEXT PRIMARY KEY,
  created_at   TEXT NOT NULL,
  site_id      TEXT NOT NULL,
  site_name    TEXT NOT NULL,
  session_id   TEXT NOT NULL,
  verdict      TEXT NOT NULL,
  http_status  INTEGER NOT NULL,
  block_message TEXT,
  latency_ms   INTEGER NOT NULL,
  model        TEXT,
  prompt_chars INTEGER NOT NULL,
  prompt       TEXT,
  UNIQUE (site_id, created_at, id)
);
