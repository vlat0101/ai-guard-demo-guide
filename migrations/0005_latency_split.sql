-- Latency attribution: how much of the round trip was AI Guard, and how much the model.
--
-- "That took three seconds" is the least useful thing a demo can say. The guard is two
-- HTTP calls (IN and OUT) and the model is one, so they are timed separately.
ALTER TABLE interactions ADD COLUMN guard_ms INTEGER NOT NULL DEFAULT 0;
ALTER TABLE interactions ADD COLUMN model_ms INTEGER NOT NULL DEFAULT 0;
