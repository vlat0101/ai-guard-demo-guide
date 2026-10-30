-- Operator-console detail: the response text, and the per-detector result.
--
-- CAPTURE_CONTENT controls the prompt and the answer; without it both stay null and
-- the row remains metadata-only. The detector list is always stored — it is what the
-- console colours a row by, and it contains no user content.
ALTER TABLE interactions ADD COLUMN answer TEXT;
ALTER TABLE interactions ADD COLUMN detectors TEXT;
