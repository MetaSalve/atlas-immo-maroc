-- Supprimer les anciennes politiques RLS trop permissives
DROP POLICY IF EXISTS "Accès public en lecture aux propriétés" ON public.properties;
DROP POLICY IF EXISTS "Anyone can view properties" ON public.properties;

-- Créer une nouvelle politique pour l'accès complet aux utilisateurs authentifiés uniquement
CREATE POLICY "Authenticated users can view all property details"
ON public.properties
FOR SELECT
TO authenticated
USING (true);

-- Créer une vue publique qui exclut les informations de contact sensibles
CREATE OR REPLACE VIEW public.properties_public AS
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

-- Permettre l'accès public à la vue (sans informations de contact)
GRANT SELECT ON public.properties_public TO anon, authenticated;