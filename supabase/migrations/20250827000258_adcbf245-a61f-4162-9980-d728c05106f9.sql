-- Fix security issue: Add admin-only SELECT policy for contact_messages
-- This ensures only admins can view customer contact information

CREATE POLICY "Only admins can view contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (check_is_admin(auth.uid()));