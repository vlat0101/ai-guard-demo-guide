-- Each assistant is a separate AI Guard application, so every observed
-- interaction records which application handled it.
--
-- appId values: dro-public, dro-staff, mountdis-public, mountdis-staff
ALTER TABLE interactions ADD COLUMN app_id TEXT NOT NULL DEFAULT '';
