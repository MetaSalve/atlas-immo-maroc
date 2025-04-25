
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
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "keytoprovide";
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });
    
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "keytoprovide";
    
    // Create Supabase client with SERVICE ROLE KEY to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No signature provided");
    }

    // Get the raw request body
    const body = await req.text();
    
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log(`Event received: ${event.type}`);
    
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get the customer to find the user
        const customer = await stripe.customers.retrieve(customerId.toString());
        const userId = customer.metadata?.user_id;
        
        if (!userId) {
          throw new Error("User ID not found in customer metadata");
        }
        
        // Calculate subscription end date
        const subscriptionEnd = new Date(subscription.current_period_end * 1000);
        
        // Update user profile
        await supabaseAdmin
          .from('profiles')
          .update({ 
            subscription_status: subscription.status === 'active' ? 'premium' : 'free',
            subscription_tier: subscription.status === 'active' ? 'premium' : 'free',
            subscription_ends_at: subscription.status === 'active' ? subscriptionEnd.toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        break;
        
      case 'customer.subscription.deleted':
        const cancelledSubscription = event.data.object;
        const cancelledCustomerId = cancelledSubscription.customer;
        
        // Get the customer to find the user
        const cancelledCustomer = await stripe.customers.retrieve(cancelledCustomerId.toString());
        const cancelledUserId = cancelledCustomer.metadata?.user_id;
        
        if (!cancelledUserId) {
          throw new Error("User ID not found in customer metadata");
        }
        
        // Update user profile to free
        await supabaseAdmin
          .from('profiles')
          .update({ 
            subscription_status: 'free',
            subscription_tier: 'free',
            subscription_ends_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', cancelledUserId);
          
        break;
        
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Update transaction status if exists
        if (session.id) {
          await supabaseAdmin
            .from('payment_transactions')
            .update({ 
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('payment_id', session.id);
        }
        
        break;
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
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
