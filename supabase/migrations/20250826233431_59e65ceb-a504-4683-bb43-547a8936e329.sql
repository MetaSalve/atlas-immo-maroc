-- Supprimer la vue avec SECURITY DEFINER et la recréer correctement
DROP VIEW IF EXISTS public.properties_public;

-- Créer une vue publique normale (sans SECURITY DEFINER) qui exclut les informations de contact sensibles
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