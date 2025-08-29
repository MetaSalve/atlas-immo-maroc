-- Remove public SELECT access on properties to prevent contact info exposure
DROP POLICY IF EXISTS "Allow basic property access" ON public.properties;

-- Keep INSERT policy unchanged to allow authenticated inserts
-- No SELECT policy is intentionally created; all reads must go through SECURITY DEFINER RPCs

-- Ensure the function exists (no change made if it already exists)
-- The existing get_public_properties function already gates contact info to premium users.
