
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
    // Utiliser la clé de service pour les opérations d'administration
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Authentifier l'utilisateur
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Jeton d'authentification manquant");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      throw new Error("Utilisateur non authentifié");
    }

    // Vérifier si l'utilisateur est un administrateur
    const { data: isAdmin } = await supabaseAdmin.rpc('check_is_admin', { user_id_input: user.id });
    if (!isAdmin) {
      throw new Error("Autorisation refusée: droits d'administrateur requis");
    }

    // Récupérer les paramètres de sauvegarde envoyés par le client
    const { backupSchedule, retentionDays, backupLocation } = await req.json();
    
    // Valider les paramètres
    if (!backupSchedule || !retentionDays || !backupLocation) {
      throw new Error("Paramètres de sauvegarde incomplets");
    }
    
    // Créer une entrée de configuration pour les sauvegardes
    const { error: configError } = await supabaseAdmin
      .from('backup_config')
      .upsert({
        id: 1, // Utilisé comme singleton pour la config
        schedule: backupSchedule,
        retention_days: retentionDays,
        location: backupLocation,
        enabled: true,
        last_updated_by: user.id,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
    
    if (configError) throw configError;
    
    // Configurer le cron job pour les sauvegardes (simulation)
    // Dans un environnement réel, cette opération nécessiterait un accès direct à pg_cron
    const { error: cronError } = await supabaseAdmin
      .from('cron_jobs')
      .upsert({
        job_name: 'automated_backup',
        job_type: 'backup',
        schedule: backupSchedule,
        enabled: true,
        last_run: null,
        created_by: user.id,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'job_name'
      });
    
    if (cronError) throw cronError;
    
    // Enregistrer cet événement dans les logs de sécurité
    await supabaseAdmin.functions.invoke('log-security-event', {
      body: {
        event: {
          user_id: user.id,
          action: 'backup_configured',
          details: { backupSchedule, retentionDays, backupLocation }
        }
      }
    });
    
    // Définir une variable d'environnement pour indiquer que les sauvegardes sont activées
    // Note: Dans un environnement réel, cela nécessiterait des droits spécifiques
    // Nous simulons simplement cela ici
    // Deno.env.set("BACKUP_ENABLED", "true");

    return new Response(JSON.stringify({
      success: true,
      message: "Configuration des sauvegardes mise à jour avec succès",
    }), {
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
