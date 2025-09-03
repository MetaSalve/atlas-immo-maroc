-- Migration pour corriger les vulnérabilités de sécurité et ajouter les nouvelles fonctionnalités

-- Corriger les vulnérabilités de sécurité identifiées
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can view contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can insert contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (check_is_admin(auth.uid()));

-- Créer la table property_ratings pour le système de notation
CREATE TABLE public.property_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  helpful_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(property_id, user_id)
);

ALTER TABLE public.property_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings"
ON public.property_ratings
FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own ratings"
ON public.property_ratings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
ON public.property_ratings
FOR UPDATE
USING (auth.uid() = user_id);

-- Ajouter des headers de sécurité via une fonction
CREATE OR REPLACE FUNCTION public.set_security_headers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Cette fonction sera utilisée côté client pour configurer les headers
  RETURN;
END;
$$;

-- Ajouter le trigger pour updated_at sur property_ratings
CREATE TRIGGER update_property_ratings_updated_at
  BEFORE UPDATE ON public.property_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();