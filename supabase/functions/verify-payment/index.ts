
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

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
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    // Initialize Stripe with your secret key
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "keytoprovide";
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client with SERVICE ROLE KEY to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create regular client for user authentication
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

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'subscription.default_payment_method']
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Find transaction by payment_id
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('payment_transactions')
      .select('*')
      .eq('payment_id', sessionId)
      .eq('user_id', user.id)
      .single();
      
    if (transactionError || !transaction) {
      throw new Error('Transaction not found');
    }

    // Update transaction status based on the Stripe session status
    const status = session.payment_status === 'paid' ? 'completed' : session.status;
    await supabaseAdmin
      .from('payment_transactions')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('payment_id', sessionId);

    // If payment is successful and there's a subscription, update user profile
    if (session.payment_status === 'paid' && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription.toString());
      
      // Calculate subscription end date from the current period end
      const subscriptionEnd = new Date(subscription.current_period_end * 1000);
      
      // Update user profile to premium
      await supabaseAdmin
        .from('profiles')
        .update({ 
          subscription_status: 'premium',
          subscription_tier: 'premium',
          subscription_ends_at: subscriptionEnd.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction: {
          ...transaction,
          subscription_ends_at: session.subscription ? 
            new Date((await stripe.subscriptions.retrieve(session.subscription.toString())).current_period_end * 1000).toISOString() : 
            null,
          status: status
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
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
