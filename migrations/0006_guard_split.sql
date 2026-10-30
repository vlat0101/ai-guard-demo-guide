-- Split the guard's own latency into its two calls.
--
-- A prompt-side block makes one detection call and a response-side block makes two, so a
-- single guard_ms cannot tell a slow IN call from a slow OUT call. Null means the call
-- never happened: a block at the prompt has no OUT call at all, which is different from
-- an OUT call that returned in 0 ms.
ALTER TABLE interactions ADD COLUMN guard_in_ms INTEGER;
ALTER TABLE interactions ADD COLUMN guard_out_ms INTEGER;
