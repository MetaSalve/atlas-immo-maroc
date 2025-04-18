
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
    
    // Get pending tasks from queue
    const { data: queueItems, error: queueError } = await supabase
      .from('scraping_queue')
      .select('*, property_sources(*)')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('priority', { ascending: false })
      .limit(5)

    if (queueError) throw queueError

    for (const item of queueItems || []) {
      // Mark task as started
      await supabase
        .from('scraping_queue')
        .update({ 
          status: 'processing',
          started_at: new Date().toISOString()
        })
        .eq('id', item.id)

      try {
        // Create log entry
        const { data: log } = await supabase
          .from('scraping_logs')
          .insert({
            source_id: item.source_id,
            status: 'processing'
          })
          .select()
          .single()

        if (!log) throw new Error('Failed to create log entry')

        // Process the source based on its type
        if (item.property_sources.type === 'social' && 
            item.property_sources.name === 'Facebook Marketplace') {
          await processFacebookMarketplace(supabase, item, log.id)
        } else {
          await processWebsite(supabase, item, log.id)
        }

        // Mark task as completed
        await supabase
          .from('scraping_queue')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', item.id)

      } catch (error) {
        console.error('Error processing queue item:', error)
        
        // Update log with error
        await supabase
          .from('scraping_logs')
          .update({ 
            status: 'error',
            error_message: error.message,
            completed_at: new Date().toISOString()
          })
          .eq('id', item.id)

        // Mark task as failed
        await supabase
          .from('scraping_queue')
          .update({ 
            status: 'failed',
            completed_at: new Date().toISOString()
          })
          .eq('id', item.id)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
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

async function processFacebookMarketplace(supabase, item, logId) {
  const FB_ACCESS_TOKEN = Deno.env.get('FACEBOOK_API_KEY')
  if (!FB_ACCESS_TOKEN) throw new Error('Facebook API key not configured')

  // Call Facebook Graph API to get marketplace listings
  const response = await fetch(
    `https://graph.facebook.com/v18.0/search?type=marketplace_listing&q=real estate morocco&access_token=${FB_ACCESS_TOKEN}`
  )
  
  if (!response.ok) {
    throw new Error(`Facebook API error: ${response.statusText}`)
  }

  const data = await response.json()
  
  // Process and store the listings
  let propertiesFound = 0
  let propertiesAdded = 0
  
  for (const listing of data.data || []) {
    propertiesFound++
    
    // Check if property already exists
    const { data: existing } = await supabase
      .from('properties')
      .select('id')
      .eq('source_url', listing.permalink_url)
      .maybeSingle()
    
    if (!existing) {
      // Add new property
      await supabase
        .from('properties')
        .insert({
          title: listing.title || 'Unlisted Property',
          description: listing.description,
          price: parseFloat(listing.price) || 0,
          price_unit: 'MAD',
          source_name: 'Facebook Marketplace',
          source_url: listing.permalink_url,
          images: listing.images || [],
          type: 'other',
          status: 'for-sale',
          address: listing.location?.address || '',
          city: listing.location?.city || 'Unknown',
          district: listing.location?.city || 'Unknown',
          contact_name: listing.seller?.name || 'Unknown',
          area: 0
        })
      
      propertiesAdded++
    }
  }
  
  // Update log with results
  await supabase
    .from('scraping_logs')
    .update({
      status: 'completed',
      properties_found: propertiesFound,
      properties_added: propertiesAdded,
      completed_at: new Date().toISOString()
    })
    .eq('id', logId)
}

async function processWebsite(supabase, item, logId) {
  const BRIGHT_USERNAME = Deno.env.get('BRIGHT_DATA_USERNAME')
  const BRIGHT_PASSWORD = Deno.env.get('BRIGHT_DATA_PASSWORD')
  
  if (!BRIGHT_USERNAME || !BRIGHT_PASSWORD) {
    throw new Error('Bright Data credentials not configured')
  }

  // Use Bright Data proxy for scraping
  const proxyUrl = `http://${BRIGHT_USERNAME}:${BRIGHT_PASSWORD}@brd.superproxy.io:22225`
  
  // Initialize properties counter
  let propertiesFound = 0
  let propertiesAdded = 0

  try {
    const response = await fetch(item.property_sources.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      proxy: proxyUrl
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    
    // Basic scraping logic - would need to be customized per website
    // This is a simplified example
    const propertyMatches = html.match(/<div class="property-listing">(.*?)<\/div>/g) || []
    
    propertiesFound = propertyMatches.length
    
    // Update log with initial count
    await supabase
      .from('scraping_logs')
      .update({
        properties_found: propertiesFound,
        status: 'processing'
      })
      .eq('id', logId)

    // Process each property
    for (const propertyHtml of propertyMatches) {
      // Extract property details (simplified example)
      const title = propertyHtml.match(/<h2>(.*?)<\/h2>/)?.[1] || 'Unlisted Property'
      const price = parseFloat(propertyHtml.match(/price">(.*?)<\/span>/)?.[1] || '0')
      
      // Add property to database if it's new
      const { data: existing } = await supabase
        .from('properties')
        .select('id')
        .eq('title', title)
        .eq('source_name', item.property_sources.name)
        .maybeSingle()
      
      if (!existing) {
        await supabase
          .from('properties')
          .insert({
            title,
            price,
            price_unit: 'MAD',
            source_name: item.property_sources.name,
            source_url: item.property_sources.url,
            type: 'other',
            status: 'for-sale',
            city: 'Unknown',
            district: 'Unknown',
            address: 'Unknown',
            contact_name: 'Unknown',
            area: 0
          })
        
        propertiesAdded++
      }
    }
    
    // Update log with final results
    await supabase
      .from('scraping_logs')
      .update({
        status: 'completed',
        properties_found: propertiesFound,
        properties_added: propertiesAdded,
        completed_at: new Date().toISOString()
      })
      .eq('id', logId)

  } catch (error) {
    throw new Error(`Error scraping ${item.property_sources.name}: ${error.message}`)
  }
}
