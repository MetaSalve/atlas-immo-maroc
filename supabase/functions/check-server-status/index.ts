
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
    // Utilisez la clé de service pour les opérations d'administration
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Authentifiez l'utilisateur
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Jeton d'authentification manquant");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      throw new Error("Utilisateur non authentifié");
    }

    // Vérifiez si l'utilisateur est un administrateur
    const { data: isAdmin } = await supabaseAdmin.rpc('check_is_admin', { user_id_input: user.id });
    if (!isAdmin) {
      throw new Error("Autorisation refusée: droits d'administrateur requis");
    }

    // Dans un environnement Edge Function, nous ne pouvons pas vraiment vérifier le certificat SSL
    // et d'autres paramètres du serveur directement. Dans une situation réelle,
    // vous auriez un autre service qui effectue ces vérifications.
    // Ici, nous simulons le résultat pour la démonstration.

    const mockServerStatus = {
      sslValid: true,
      sslExpiration: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 jours
      daysUntilExpiration: 60,
      serverSoftware: "nginx/1.22.1",
      securityHeaders: {
        hsts: true,
        csp: true,
        xContentType: true,
        xFrame: true,
      },
      alertsConfigured: Deno.env.get("ALERT_EMAIL") ? true : false,
      backupsConfigured: Deno.env.get("BACKUP_ENABLED") === "true",
    };

    // Vérifier si le cron job de sauvegarde est configuré
    const { data: cronJobs, error: cronError } = await supabaseAdmin.from('cron_jobs')
      .select('*')
      .eq('job_type', 'backup')
      .limit(1);

    if (!cronError && cronJobs && cronJobs.length > 0) {
      mockServerStatus.backupsConfigured = true;
    }

    return new Response(JSON.stringify(mockServerStatus), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400
    });
  }
});
