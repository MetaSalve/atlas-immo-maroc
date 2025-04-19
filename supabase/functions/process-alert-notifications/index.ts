
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = "https://lomogmjwjnhvmcqkpjmg.supabase.co"
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Get all active alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('user_alerts')
      .select('*, profiles(email, full_name)')
      .eq('is_active', true)
    
    if (alertsError) throw alertsError
    
    console.log(`Processing ${alerts?.length || 0} active alerts`)

    const notificationResults = []
    
    // For each alert, find new properties since last notification
    for (const alert of alerts || []) {
      try {
        const filters = alert.filters
        const lastNotification = alert.last_notification_at || new Date(0).toISOString()
        
        // Construct query for new properties matching the alert criteria
        let query = supabase
          .from('properties')
          .select('*')
          .gt('created_at', lastNotification)
          .order('created_at', { ascending: false })
          
        // Apply filters
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status)
        }
        
        if (filters.type && filters.type !== 'all') {
          query = query.eq('type', filters.type)
        }
        
        if (filters.location) {
          const locationSearch = filters.location.toLowerCase()
          // This is simplified - for production you'd want a more sophisticated search
          query = query.or(`city.ilike.%${locationSearch}%,district.ilike.%${locationSearch}%,address.ilike.%${locationSearch}%`)
        }
        
        if (filters.priceMin > 0) {
          query = query.gte('price', filters.priceMin)
        }
        
        if (filters.priceMax < 10000000) {
          query = query.lte('price', filters.priceMax)
        }
        
        if (filters.bedroomsMin > 0) {
          query = query.gte('bedrooms', filters.bedroomsMin)
        }
        
        if (filters.bathroomsMin > 0) {
          query = query.gte('bathrooms', filters.bathroomsMin)
        }
        
        if (filters.areaMin > 0) {
          query = query.gte('area', filters.areaMin)
        }
        
        const { data: newProperties, error: propertiesError } = await query
        
        if (propertiesError) throw propertiesError
        
        if ((newProperties?.length || 0) > 0) {
          // In a real implementation, send email here
          console.log(`Sending notification for alert ${alert.name} to ${alert.profiles.email} with ${newProperties?.length} new properties`)
          
          // Update the last notification timestamp
          const { error: updateError } = await supabase
            .from('user_alerts')
            .update({ 
              last_notification_at: new Date().toISOString(),
              last_notification_count: newProperties?.length || 0
            })
            .eq('id', alert.id)
            
          if (updateError) throw updateError
          
          notificationResults.push({
            alertId: alert.id,
            alertName: alert.name,
            userId: alert.user_id,
            email: alert.profiles.email,
            newPropertiesCount: newProperties?.length || 0,
            status: 'success'
          })
        }
      } catch (error) {
        console.error(`Error processing alert ${alert.id}:`, error)
        notificationResults.push({
          alertId: alert.id,
          alertName: alert.name,
          userId: alert.user_id,
          status: 'error',
          error: error.message
        })
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: alerts?.length || 0,
      notifications: notificationResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
