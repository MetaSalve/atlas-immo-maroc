-- Check current view metadata to see if SECURITY DEFINER is set
SELECT 
    schemaname, 
    viewname, 
    viewowner,
    definition
FROM pg_views 
WHERE schemaname = 'public' AND viewname = 'properties_public';

-- Check if view has security definer set
SELECT 
    n.nspname AS schema_name,
    c.relname AS view_name,
    CASE 
        WHEN c.relkind = 'v' THEN 'view'
        ELSE 'other'
    END AS object_type,
    pg_get_viewdef(c.oid) AS view_definition
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relname = 'properties_public' 
AND n.nspname = 'public'
AND c.relkind = 'v';

-- Drop the current view completely
DROP VIEW IF EXISTS public.properties_public CASCADE;

-- Create a new view ensuring it's NOT security definer (default behavior)
-- This view will only show non-sensitive property data for public access
CREATE VIEW public.properties_public AS
SELECT 
    id,
    title,
    description,
    type,
    status,
    price,
    price_unit,
    area,
    bedrooms,
    bathrooms,
    city,
    district,
    address,
    lat,
    lng,
    images,
    features,
    source_name,
    source_logo,
    source_url,
    created_at,
    updated_at
FROM public.properties;

-- Grant select permissions to both anonymous and authenticated users
GRANT SELECT ON public.properties_public TO anon, authenticated;

-- Verify the view was created correctly without SECURITY DEFINER
SELECT 
    schemaname, 
    viewname, 
    viewowner
FROM pg_views 
WHERE schemaname = 'public' AND viewname = 'properties_public';