
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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
    // Utiliser la clé de service pour les opérations administratives
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Jeton d'authentification manquant");
    }

    // Authentifier l'utilisateur
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

    // Initialiser Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Obtenir la configuration Stripe actuelle
    const productsAndPrices = await Promise.all([
      stripe.products.list({ limit: 10, active: true }),
      stripe.prices.list({ limit: 100, active: true })
    ]);

    // Récupérer le mode Stripe (test ou production)
    const stripeAccount = await stripe.accounts.retrieve();
    const isTestMode = stripeAccount.charges_enabled === false;

    return new Response(JSON.stringify({
      success: true,
      mode: isTestMode ? 'test' : 'production',
      products: productsAndPrices[0].data,
      prices: productsAndPrices[1].data,
      webhooksConfigured: Deno.env.get("STRIPE_WEBHOOK_SECRET") ? true : false
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
