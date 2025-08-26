-- Instead of a view, let's create a proper access function
-- This approach should avoid the security definer view issue

-- First, drop the view completely
DROP VIEW IF EXISTS public.properties_public CASCADE;

-- Create a security definer function instead that returns property data for public access
CREATE OR REPLACE FUNCTION public.get_public_properties()
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    type text,
    status text,
    price numeric,
    price_unit text,
    area numeric,
    bedrooms integer,
    bathrooms integer,
    city text,
    district text,
    address text,
    lat numeric,
    lng numeric,
    images text[],
    features text[],
    source_name text,
    source_logo text,
    source_url text,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        p.id,
        p.title,
        p.description,
        p.type,
        p.status,
        p.price,
        p.price_unit,
        p.area,
        p.bedrooms,
        p.bathrooms,
        p.city,
        p.district,
        p.address,
        p.lat,
        p.lng,
        p.images,
        p.features,
        p.source_name,
        p.source_logo,
        p.source_url,
        p.created_at,
        p.updated_at
    FROM properties p;
$$;

-- Grant execute permission to both anon and authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_properties() TO anon, authenticated;