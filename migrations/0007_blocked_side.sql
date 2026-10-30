-- Two columns the Worker has been reading and writing since 0005/0006 with no
-- migration of their own.
--
-- `blocked_side` and `response_inspected` first appear in worker/index.ts's INSERT
-- (and in the console's SELECT) without a corresponding ALTER, so the live database
-- was amended out of band and `migrations/` no longer rebuilt the deployment. The
-- insert is wrapped in a catch, so a fresh deploy against a freshly migrated database
-- wrote nothing and the console reported "No interactions recorded yet" — a clean
-- install and a broken audit trail were indistinguishable.
--
-- Run this ONCE against a database built from 0001-0006. On the current live database
-- these columns already exist, so SQLite will reject the ALTERs with
-- "duplicate column name" — that is confirmation the drift was real, not a fault in
-- this file. Check first with:
--   npx wrangler d1 execute zscaler-demo --command "PRAGMA table_info(interactions)"

ALTER TABLE interactions ADD COLUMN blocked_side TEXT;
-- 1 = AI Guard inspected the response, 0 = no OUT detectors or the OUT call produced
-- no verdict. The console and the presenter strip both read it; an uninspected answer
-- must never render as "via AI Guard".
ALTER TABLE interactions ADD COLUMN response_inspected INTEGER NOT NULL DEFAULT 0;
