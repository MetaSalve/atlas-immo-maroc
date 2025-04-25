
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
    const { transactionId } = await req.json();
    
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }

    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

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

    // Fetch transaction details
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('payment_transactions')
      .select('*')
      .eq('payment_id', transactionId)
      .eq('user_id', user.id)
      .single();
      
    if (transactionError || !transaction) {
      throw new Error('Transaction not found');
    }

    // Update transaction status to completed if it's still pending
    if (transaction.status === 'pending') {
      await supabaseAdmin
        .from('payment_transactions')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', transactionId);

      // Calculate subscription end date (30 days from now)
      const subscriptionEnd = new Date();
      subscriptionEnd.setDate(subscriptionEnd.getDate() + 30);
      
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
          subscription_ends_at: transaction.subscription_ends_at || null,
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
