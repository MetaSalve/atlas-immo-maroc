
import { createClient } from '@supabase/supabase-js'

export async function processFacebookMarketplace(supabase: any, item: any, logId: string) {
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
