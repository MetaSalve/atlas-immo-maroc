
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gérer les requêtes OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Utiliser la clé de service pour contourner RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Extraire le jeton d'authentification et obtenir l'utilisateur
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Jeton d'authentification manquant");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    
    if (!user) {
      throw new Error("Utilisateur non authentifié");
    }

    // Récupérer les données de l'événement
    const { event } = await req.json();
    
    if (!event) {
      throw new Error("Données d'événement manquantes");
    }
    
    // Enrichir l'événement avec des informations supplémentaires
    const enrichedEvent = {
      ...event,
      ip_address: req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown",
      created_at: new Date().toISOString()
    };
    
    // Enregistrer l'événement dans la table d'audit
    const { error } = await supabaseAdmin
      .from('security_audit_logs')
      .insert([enrichedEvent]);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erreur:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
