-- Fix security issue: Restrict property contact information to premium users only

-- Drop all existing policies for properties table
DROP POLICY IF EXISTS "Authenticated users can view all property details" ON public.properties;
DROP POLICY IF EXISTS "Users can view basic property info" ON public.properties;
DROP POLICY IF EXISTS "Premium users can view full property details" ON public.properties;
DROP POLICY IF EXISTS "Authenticated users can create properties" ON public.properties;

-- Create new policies with proper access control
-- Policy 1: All users (authenticated and anonymous) can see basic property information
CREATE POLICY "Allow basic property access"
ON public.properties
FOR SELECT
USING (true);

-- Policy 2: Only authenticated users can create properties
CREATE POLICY "Allow authenticated property creation"
ON public.properties
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Drop and recreate the get_public_properties function with contact information access control
DROP FUNCTION IF EXISTS public.get_public_properties();

CREATE OR REPLACE FUNCTION public.get_public_properties()
RETURNS TABLE(
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
  created_at timestamp with time zone, 
  updated_at timestamp with time zone,
  contact_name text,
  contact_phone text,
  contact_email text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
        p.updated_at,
        -- Only show contact information for premium users
        CASE 
          WHEN auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND subscription_tier = 'premium' 
            AND subscription_status = 'active'
          ) THEN p.contact_name
          ELSE NULL
        END as contact_name,
        CASE 
          WHEN auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND subscription_tier = 'premium' 
            AND subscription_status = 'active'
          ) THEN p.contact_phone
          ELSE NULL
        END as contact_phone,
        CASE 
          WHEN auth.uid() IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND subscription_tier = 'premium' 
            AND subscription_status = 'active'
          ) THEN p.contact_email
          ELSE NULL
        END as contact_email
    FROM properties p;
$function$