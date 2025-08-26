-- Check for views with SECURITY DEFINER and fix them
-- First, let's see what views exist
SELECT schemaname, viewname, definition 
FROM pg_views 
WHERE schemaname = 'public';

-- Drop and recreate properties_public view without SECURITY DEFINER if it exists
DROP VIEW IF EXISTS public.properties_public;

-- Create a standard view (without SECURITY DEFINER) that shows only public property data
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

-- Grant appropriate permissions
GRANT SELECT ON public.properties_public TO anon, authenticated;