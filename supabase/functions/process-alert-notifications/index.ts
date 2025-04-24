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
    console.log("Starting process-alert-notifications function")
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Get all active alerts with user profiles to get push tokens
    const { data: alerts, error: alertsError } = await supabase
      .from('user_alerts')
      .select(`
        *,
        profiles:profiles(push_notification_token)
      `)
      .eq('is_active', true)
    
    if (alertsError) {
      console.error('Error fetching alerts:', alertsError)
      throw alertsError
    }

    console.log(`Found ${alerts?.length || 0} active alerts`)
    
    // Get properties added in the last 24 hours
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const { data: newProperties, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .gte('created_at', yesterday.toISOString())
    
    if (propertiesError) {
      console.error('Error fetching new properties:', propertiesError)
      throw propertiesError
    }

    console.log(`Found ${newProperties?.length || 0} new properties`)
    
    // Pour chaque alerte, trouver les propriétés correspondantes
    let notificationCount = 0
    
    if (alerts && alerts.length > 0 && newProperties && newProperties.length > 0) {
      for (const alert of alerts) {
        const matchingProperties = findMatchingProperties(alert, newProperties)
        
        if (matchingProperties.length > 0) {
          console.log(`Alert ${alert.id} has ${matchingProperties.length} matching properties`)
          notificationCount += matchingProperties.length

          // Envoyer une notification push si un token est disponible
          if (alert.profiles?.push_notification_token) {
            try {
              await sendPushNotification(
                alert.profiles.push_notification_token,
                `${matchingProperties.length} nouveaux biens correspondent à votre alerte "${alert.name}"`,
                "Cliquez pour voir les nouveaux biens",
                { alertId: alert.id }
              );
            } catch (error) {
              console.error('Error sending push notification:', error);
            }
          }
          
          // Mettre à jour l'alerte avec les informations de notification
          await supabase
            .from('user_alerts')
            .update({
              last_notification_at: new Date().toISOString(),
              last_notification_count: matchingProperties.length
            })
            .eq('id', alert.id)
        }
      }
    } else {
      console.log("No alerts or new properties to process")
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Alert notifications processed successfully",
      alerts_processed: alerts?.length || 0,
      properties_checked: newProperties?.length || 0,
      notifications_generated: notificationCount,
      processed_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error processing alerts:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

// Helper function to determine if a property matches an alert criteria
function findMatchingProperties(alert: any, properties: any[]) {
  const filters = alert.filters
  
  return properties.filter((property) => {
    // Match location if specified
    if (filters.location && filters.location.trim() !== '') {
      const locationString = `${property.city} ${property.district} ${property.address}`.toLowerCase()
      if (!locationString.includes(filters.location.toLowerCase())) {
        return false
      }
    }
    
    // Match status
    if (filters.status !== 'all' && property.status !== filters.status) {
      return false
    }
    
    // Match property type
    if (filters.type !== 'all' && property.type !== filters.type) {
      return false
    }
    
    // Match price range
    if (property.price < filters.priceMin || property.price > filters.priceMax) {
      return false
    }
    
    // Match bedrooms
    if (filters.bedroomsMin > 0 && property.bedrooms < filters.bedroomsMin) {
      return false
    }
    
    // Match bathrooms
    if (filters.bathroomsMin > 0 && property.bathrooms < filters.bathroomsMin) {
      return false
    }
    
    // Match area
    if (filters.areaMin > 0 && property.area < filters.areaMin) {
      return false
    }
    
    // If passed all filters, it's a match
    return true
  })
}

async function sendPushNotification(
  token: string, 
  title: string, 
  body: string, 
  data?: Record<string, any>
) {
  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `key=${Deno.env.get('FIREBASE_SERVER_KEY')}`
    },
    body: JSON.stringify({
      to: token,
      notification: {
        title,
        body,
      },
      data,
    })
  });

  if (!response.ok) {
    throw new Error('Failed to send push notification');
  }

  return response.json();
}
