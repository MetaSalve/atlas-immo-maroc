
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Create Supabase client with auth token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Get user from auth token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // CMI configuration
    const cmiMerchantId = Deno.env.get("CMI_MERCHANT_ID") || "keytoprovide";
    const cmiStoreKey = Deno.env.get("CMI_STORE_KEY") || "keytoprovide";
    
    // Generate unique order ID
    const orderId = `order_${Date.now()}_${user.id.substring(0, 8)}`;
    
    // Create payment transaction record in database
    const { error: transactionError, data: transactionData } = await supabaseClient
      .from('payment_transactions')
      .insert({
        user_id: user.id,
        amount: 99,
        status: 'pending',
        payment_id: orderId
      })
      .select('id')
      .single();

    if (transactionError) throw transactionError;

    // Build CMI payment form data
    const cmiPaymentData = {
      merchantId: cmiMerchantId,
      orderId: orderId,
      amount: 99,
      currency: "MAD",
      okUrl: `${req.headers.get('origin')}/payment-success?order_id=${orderId}`,
      failUrl: `${req.headers.get('origin')}/subscription?status=failed`,
      // Les paramètres supplémentaires requis par CMI seraient ajoutés ici
    };

    // En production, vous généreriez une signature de sécurité basée sur les données du paiement et le cmiStoreKey
    // const signature = generateCMISignature(cmiPaymentData, cmiStoreKey);
    // cmiPaymentData.signature = signature;
    
    // URL de l'environnement de production CMI
    const cmiPaymentUrl = "https://paiement.cmi.co.ma/fim/est3Dgate";

    return new Response(
      JSON.stringify({
        success: true,
        paymentMethod: "cmi",
        paymentData: cmiPaymentData,
        paymentFormUrl: cmiPaymentUrl,
        orderId: orderId
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating CMI payment:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
