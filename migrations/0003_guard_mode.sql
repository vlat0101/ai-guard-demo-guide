-- Records whether an interaction went through AI Guard (guarded) or straight to
-- the model provider (unguarded, demonstration bypass).
--
-- Kept per-row because the demonstration switch can be flipped mid-session, and
-- an audit trail that cannot distinguish the two is not an audit trail.
ALTER TABLE interactions ADD COLUMN guard_mode TEXT NOT NULL DEFAULT 'guarded';
