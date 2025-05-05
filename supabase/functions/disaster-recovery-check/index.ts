
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

    // Effectuer les vérifications de DR
    // Dans une implémentation réelle, cela impliquerait:
    // 1. Vérifier l'état des sauvegardes récentes
    // 2. Tester la capacité à restaurer une sauvegarde (dry-run)
    // 3. Vérifier la réplication des données
    // 4. Tester la connectivité aux sites de secours
    
    // Pour cette démonstration, nous simulons ces vérifications
    const drChecks = {
      lastBackupCheck: {
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 heures
        status: "success",
        details: "Sauvegarde complète disponible"
      },
      backupRestoreTest: {
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
        status: "success",
        details: "Test de restauration réussi"
      },
      dataReplication: {
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 heure
        status: "success",
        details: "Réplication active et synchronisée"
      },
      failoverTest: {
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
        status: "warning",
        details: "Test de basculement à effectuer (dernier test date de plus de 30 jours)"
      },
      recoveryPointObjective: {
        current: "15 minutes",
        target: "15 minutes",
        status: "success"
      },
      recoveryTimeObjective: {
        current: "2 heures",
        target: "4 heures",
        status: "success"
      },
      disasterRecoveryPlan: {
        lastUpdated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 jours
        status: "warning",
        details: "Mise à jour recommandée (dernière révision date de plus de 30 jours)"
      }
    };

    // Calculer le statut global
    const hasErrors = Object.values(drChecks).some((check: any) => check.status === "error");
    const hasWarnings = Object.values(drChecks).some((check: any) => check.status === "warning");
    
    const globalStatus = hasErrors ? "error" : hasWarnings ? "warning" : "success";

    return new Response(JSON.stringify({
      success: true,
      status: globalStatus,
      checks: drChecks,
      recommendations: [
        "Effectuer un test de basculement complet",
        "Mettre à jour la documentation du plan de reprise",
        "Organiser un exercice de simulation de catastrophe avec l'équipe"
      ]
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
