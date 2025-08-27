-- PHASE 1: CORRECTIONS DE SÉCURITÉ CRITIQUES

-- 1. Sécuriser les tables opérationnelles exposées publiquement
DROP POLICY IF EXISTS "Allow select for all users" ON public.property_sources;
DROP POLICY IF EXISTS "Allow select for all users" ON public.scraping_logs;
DROP POLICY IF EXISTS "Allow select for all users" ON public.scraping_queue;

-- Politiques restrictives pour property_sources
CREATE POLICY "Admins can view property sources" ON public.property_sources
FOR SELECT USING (check_is_admin(auth.uid()));

CREATE POLICY "Admins can manage property sources" ON public.property_sources
FOR ALL USING (check_is_admin(auth.uid()));

-- Politiques restrictives pour scraping_logs
CREATE POLICY "Admins can view scraping logs" ON public.scraping_logs
FOR SELECT USING (check_is_admin(auth.uid()));

CREATE POLICY "Admins can manage scraping logs" ON public.scraping_logs
FOR ALL USING (check_is_admin(auth.uid()));

-- Politiques restrictives pour scraping_queue
DROP POLICY IF EXISTS "Allow insert for anon users" ON public.scraping_queue;

CREATE POLICY "Admins can view scraping queue" ON public.scraping_queue
FOR SELECT USING (check_is_admin(auth.uid()));

CREATE POLICY "Admins can manage scraping queue" ON public.scraping_queue
FOR ALL USING (check_is_admin(auth.uid()));

-- 2. Créer table pour rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  endpoint text NOT NULL,
  requests_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rate limits" ON public.rate_limits
FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- 3. Table pour journalisation détaillée des événements de sécurité
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  event_type text NOT NULL,
  event_details jsonb,
  ip_address inet,
  user_agent text,
  session_id text,
  risk_level text DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all security events" ON public.security_events
FOR SELECT USING (check_is_admin(auth.uid()));

CREATE POLICY "Users can view their own security events" ON public.security_events
FOR SELECT USING (auth.uid() = user_id);

-- 4. Table pour gestion des sessions et tentatives de connexion
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  ip_address inet,
  user_agent text,
  success boolean DEFAULT false,
  failure_reason text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view login attempts" ON public.login_attempts
FOR SELECT USING (check_is_admin(auth.uid()));

-- 5. Fonction pour détecter les tentatives de force brute
CREATE OR REPLACE FUNCTION public.check_brute_force(email_input text, ip_input inet)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  failed_attempts integer;
  recent_attempts integer;
BEGIN
  -- Compter les tentatives échouées des 15 dernières minutes
  SELECT COUNT(*) INTO failed_attempts
  FROM public.login_attempts
  WHERE email = email_input 
    AND success = false 
    AND created_at > now() - interval '15 minutes';
    
  -- Compter les tentatives depuis la même IP des 5 dernières minutes
  SELECT COUNT(*) INTO recent_attempts
  FROM public.login_attempts
  WHERE ip_address = ip_input 
    AND created_at > now() - interval '5 minutes';
    
  -- Bloquer si plus de 5 tentatives échouées ou plus de 10 tentatives depuis la même IP
  RETURN failed_attempts > 5 OR recent_attempts > 10;
END;
$$;

-- 6. Table pour tokens de réinitialisation de mot de passe
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token_hash text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  used boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their own reset tokens" ON public.password_reset_tokens
FOR ALL USING (auth.uid() = user_id);

-- 7. Fonction pour nettoyer les tokens expirés
CREATE OR REPLACE FUNCTION public.cleanup_expired_tokens()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM public.password_reset_tokens 
  WHERE expires_at < now() OR used = true;
$$;

-- 8. Table pour audit des changements critiques
CREATE TABLE IF NOT EXISTS public.audit_trail (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  operation text NOT NULL, -- INSERT, UPDATE, DELETE
  old_values jsonb,
  new_values jsonb,
  user_id uuid,
  changed_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit trail" ON public.audit_trail
FOR SELECT USING (check_is_admin(auth.uid()));

-- 9. Index pour améliorer les performances des requêtes de sécurité
CREATE INDEX IF NOT EXISTS idx_login_attempts_email_time ON public.login_attempts(email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time ON public.login_attempts(ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_user_time ON public.security_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_risk_level ON public.security_events(risk_level, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint ON public.rate_limits(user_id, endpoint);

-- 10. Trigger pour audit automatique des profils
CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_trail (table_name, operation, old_values, new_values, user_id)
    VALUES ('profiles', 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), NEW.id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS audit_profiles_trigger ON public.profiles;
CREATE TRIGGER audit_profiles_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_profile_changes();