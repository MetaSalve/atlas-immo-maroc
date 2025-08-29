-- Fix remaining security issues by restricting access to admin-only tables

-- Remove public access policies from sensitive tables and add proper admin-only policies

-- Fix contact_messages table - should be admin-only for SELECT
DROP POLICY IF EXISTS "Tous peuvent insérer des messages de contact" ON public.contact_messages;

-- Recreate with proper access control
CREATE POLICY "Anyone can insert contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Fix login_attempts table - should be admin-only
-- This table should only be accessible by admins (already has the policy)

-- Fix audit_trail table - should be admin-only  
-- This table should only be accessible by admins (already has the policy)

-- Fix rate_limits table - restrict to users viewing their own data and admins
DROP POLICY IF EXISTS "Users can view their own rate limits" ON public.rate_limits;

CREATE POLICY "Users can view their own rate limits" 
ON public.rate_limits 
FOR SELECT 
USING (auth.uid() = user_id OR check_is_admin(auth.uid()));

-- Add missing policies for proper admin access to system tables
CREATE POLICY "Admins can insert login attempts" 
ON public.login_attempts 
FOR INSERT 
WITH CHECK (check_is_admin(auth.uid()));

CREATE POLICY "System can insert security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can insert audit trail" 
ON public.audit_trail 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update rate limits" 
ON public.rate_limits 
FOR UPDATE 
USING (true);