
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

    // Vérifier si une entrée pour les sauvegardes existe déjà dans la table cron_jobs
    const { data: existingJob, error: fetchError } = await supabaseAdmin.from('cron_jobs')
      .select('*')
      .eq('job_type', 'backup')
      .maybeSingle();
      
    if (fetchError) {
      throw fetchError;
    }
    
    // Configurations de sauvegarde
    const backupConfig = {
      schedule: req.method === "DELETE" ? null : "0 3 * * *", // 3h du matin tous les jours
      retention_days: 30,
      storage_bucket: "backups",
      job_type: "backup",
      enabled: req.method !== "DELETE",
      last_run: null,
      next_run: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
      created_by: user.id
    };
    
    let result;
    
    // Si nous supprimons la configuration
    if (req.method === "DELETE") {
      if (existingJob) {
        const { data, error: deleteError } = await supabaseAdmin.from('cron_jobs')
          .delete()
          .eq('id', existingJob.id);
          
        if (deleteError) throw deleteError;
        result = { success: true, message: "Configuration de sauvegarde supprimée" };
      } else {
        result = { success: true, message: "Aucune configuration de sauvegarde à supprimer" };
      }
    } 
    // Si nous créons ou mettons à jour la configuration
    else {
      if (existingJob) {
        // Mettre à jour la configuration existante
        const { data, error: updateError } = await supabaseAdmin.from('cron_jobs')
          .update(backupConfig)
          .eq('id', existingJob.id);
          
        if (updateError) throw updateError;
        result = { success: true, message: "Configuration de sauvegarde mise à jour" };
      } else {
        // Créer une nouvelle configuration
        const { data, error: insertError } = await supabaseAdmin.from('cron_jobs')
          .insert(backupConfig);
          
        if (insertError) throw insertError;
        result = { success: true, message: "Configuration de sauvegarde créée" };
      }
    }
    
    // Vérifier si la création d'un bucket de stockage est nécessaire
    if (req.method !== "DELETE") {
      try {
        // Créer le bucket de stockage si nécessaire
        const { data: bucketData, error: bucketError } = await supabaseAdmin.storage
          .createBucket('backups', { public: false });
          
        if (bucketError && !bucketError.message.includes('already exists')) {
          console.warn('Erreur lors de la création du bucket:', bucketError);
        }
      } catch (bucketErr) {
        console.warn('Erreur lors de la création du bucket:', bucketErr);
        // Ne pas échouer complètement si seulement la création du bucket échoue
      }
    }

    return new Response(JSON.stringify(result), {
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
