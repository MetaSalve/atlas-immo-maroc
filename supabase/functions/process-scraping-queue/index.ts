
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
    console.log("Starting process-scraping-queue function")
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Get pending tasks from queue
    const { data: queueItems, error: queueError } = await supabase
      .from('scraping_queue')
      .select('*, property_sources(*)')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('priority', { ascending: false })
      .limit(5)

    if (queueError) {
      console.error('Error fetching queue items:', queueError)
      throw queueError
    }

    console.log(`Found ${queueItems?.length || 0} queue items to process`)
    
    if (!queueItems || queueItems.length === 0) {
      // For demo purposes, let's add some mock property data
      await addMockProperties(supabase)
      console.log("No pending queue items. Added mock properties instead.")
      
      return new Response(JSON.stringify({ 
        success: true,
        message: "No pending queue items. Mock properties added."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    for (const item of queueItems) {
      console.log(`Processing queue item: ${item.id}`)
      
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
        const { data: log, error: logError } = await supabase
          .from('scraping_logs')
          .insert({
            source_id: item.source_id,
            status: 'processing'
          })
          .select()
          .single()

        if (logError) {
          console.error('Error creating log entry:', logError)
          throw logError
        }

        if (!log) {
          throw new Error('Failed to create log entry')
        }

        console.log(`Created log entry: ${log.id}`)

        // Processing depends on source type if it exists
        if (item.source_id && item.property_sources) {
          console.log(`Source type: ${item.property_sources.type}, name: ${item.property_sources.name}`)
          
          if (item.property_sources.type === 'social' && 
              item.property_sources.name === 'Facebook Marketplace') {
            await processMockSocialSource(supabase, item, log.id)
          } else {
            await processMockWebsiteSource(supabase, item, log.id)
          }
        } else {
          // No source specified, use mock data
          console.log("No source specified, generating mock data")
          await processMockWebsiteSource(supabase, item, log.id)
        }

        // Mark task as completed
        await supabase
          .from('scraping_queue')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', item.id)
          
        console.log(`Queue item ${item.id} processed successfully`)

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
          .eq('source_id', item.source_id)

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

    return new Response(JSON.stringify({ 
      success: true,
      processed: queueItems.length
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

// Function to add mock properties directly
async function addMockProperties(supabase: any) {
  const mockProperties = [
    {
      title: "Bel appartement au centre-ville",
      description: "Magnifique appartement avec vue panoramique sur la ville. Proche des commodités.",
      price: 850000,
      price_unit: "MAD",
      area: 85,
      bedrooms: 2,
      bathrooms: 1,
      address: "Avenue Mohammed V",
      city: "Casablanca",
      district: "Centre-Ville",
      lat: 33.5731,
      lng: -7.5898,
      images: ["https://picsum.photos/seed/prop1/800/600", "https://picsum.photos/seed/prop2/800/600"],
      type: "apartment",
      status: "for-sale",
      features: ["Balcon", "Parking", "Ascenseur"],
      source_name: "Atlas Immo",
      source_url: "https://exemple.com/propriete/1",
      contact_name: "Ahmed Hassan"
    },
    {
      title: "Villa de luxe avec piscine",
      description: "Magnifique villa avec piscine privée et jardin. Parfait pour une famille.",
      price: 3500000,
      price_unit: "MAD",
      area: 250,
      bedrooms: 4,
      bathrooms: 3,
      address: "Rue des Jardins",
      city: "Marrakech",
      district: "Palmeraie",
      lat: 31.6295,
      lng: -7.9811,
      images: ["https://picsum.photos/seed/villa1/800/600", "https://picsum.photos/seed/villa2/800/600"],
      type: "villa",
      status: "for-sale",
      features: ["Piscine", "Jardin", "Garage", "Sécurité"],
      source_name: "Atlas Immo",
      source_url: "https://exemple.com/propriete/2",
      contact_name: "Fatima Zahra"
    },
    {
      title: "Studio meublé pour location",
      description: "Studio moderne entièrement meublé, idéal pour étudiant ou jeune professionnel.",
      price: 4500,
      price_unit: "MAD",
      area: 40,
      bedrooms: 1,
      bathrooms: 1,
      address: "Boulevard Zerktouni",
      city: "Rabat",
      district: "Agdal",
      lat: 34.0081,
      lng: -6.8344,
      images: ["https://picsum.photos/seed/studio1/800/600"],
      type: "apartment",
      status: "for-rent",
      features: ["Meublé", "Internet", "Climatisation"],
      source_name: "Atlas Immo",
      source_url: "https://exemple.com/propriete/3",
      contact_name: "Karim Idrissi"
    }
  ];

  console.log("Adding mock properties...")

  // Check if properties already exist
  for (const prop of mockProperties) {
    const { data: existing } = await supabase
      .from('properties')
      .select('id')
      .eq('title', prop.title)
      .maybeSingle()

    if (!existing) {
      const { data, error } = await supabase
        .from('properties')
        .insert(prop)

      if (error) {
        console.error('Error adding mock property:', error)
      } else {
        console.log('Added mock property:', prop.title)
      }
    } else {
      console.log('Property already exists:', prop.title)
    }
  }
}

// Function to process mock social source data
async function processMockSocialSource(supabase: any, item: any, logId: string) {
  console.log("Processing mock social source data")
  
  const mockListings = [
    {
      title: "Appartement avec vue sur mer",
      description: "Bel appartement à vendre avec vue imprenable sur l'océan",
      price: 920000,
      location: { city: "Tanger", address: "Boulevard Mohammed VI" },
      images: ["https://picsum.photos/seed/social1/800/600"],
      seller: { name: "Immobilier Méditerranée" }
    },
    {
      title: "Petit riad à rénover",
      description: "Riad traditionnel avec beaucoup de potentiel, nécessite rénovation",
      price: 650000,
      location: { city: "Fès", address: "Médina" },
      images: ["https://picsum.photos/seed/social2/800/600"],
      seller: { name: "Patrimoine Marocain" }
    }
  ];
  
  // Process and store the listings
  let propertiesFound = mockListings.length;
  let propertiesAdded = 0;
  
  for (const listing of mockListings) {
    // Check if property already exists
    const { data: existing } = await supabase
      .from('properties')
      .select('id')
      .eq('title', listing.title)
      .maybeSingle()
    
    if (!existing) {
      // Add new property
      const { error } = await supabase
        .from('properties')
        .insert({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          price_unit: 'MAD',
          source_name: 'Facebook Marketplace',
          source_url: `https://facebook.com/marketplace/item/${Math.random().toString(36).substring(2, 15)}`,
          images: listing.images,
          type: 'other',
          status: 'for-sale',
          address: listing.location?.address || '',
          city: listing.location?.city || 'Unknown',
          district: listing.location?.city || 'Unknown',
          contact_name: listing.seller?.name || 'Unknown',
          area: Math.floor(Math.random() * 100) + 50
        })
      
      if (error) {
        console.error('Error adding mock social property:', error)
      } else {
        propertiesAdded++;
      }
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
    
  console.log(`Social source processed: ${propertiesFound} found, ${propertiesAdded} added`)
}

// Function to process mock website data
async function processMockWebsiteSource(supabase: any, item: any, logId: string) {
  console.log("Processing mock website source data")
  
  const mockProperties = [
    {
      title: "Appartement neuf avec terrasse",
      price: 780000,
      city: "Agadir",
      district: "Centre",
      type: "apartment"
    },
    {
      title: "Local commercial bien situé",
      price: 1200000,
      city: "Casablanca",
      district: "Maarif",
      type: "commercial"
    },
    {
      title: "Terrain constructible 500m²",
      price: 950000,
      city: "Marrakech",
      district: "Route de l'Ourika",
      type: "land"
    }
  ];
  
  let propertiesFound = mockProperties.length;
  let propertiesAdded = 0;
  
  for (const prop of mockProperties) {
    // Check if property already exists
    const { data: existing } = await supabase
      .from('properties')
      .select('id')
      .eq('title', prop.title)
      .maybeSingle()
    
    if (!existing) {
      // Add new property
      const { error } = await supabase
        .from('properties')
        .insert({
          title: prop.title,
          description: `Découvrez ce bien immobilier exceptionnel à ${prop.city}.`,
          price: prop.price,
          price_unit: 'MAD',
          area: Math.floor(Math.random() * 150) + 50,
          bedrooms: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          address: `Rue ${Math.floor(Math.random() * 100) + 1}`,
          city: prop.city,
          district: prop.district,
          images: [`https://picsum.photos/seed/${prop.title.replace(/\s+/g, '')}/800/600`],
          type: prop.type,
          status: Math.random() > 0.3 ? 'for-sale' : 'for-rent',
          features: ['Climatisation', 'Sécurité'],
          source_name: item.property_sources?.name || 'Atlas Immo',
          source_url: `https://exemple.com/propriete/${Math.random().toString(36).substring(2, 8)}`,
          contact_name: 'Service Commercial',
          contact_email: 'contact@atlasimmo.ma'
        })
      
      if (error) {
        console.error('Error adding mock website property:', error)
      } else {
        propertiesAdded++;
      }
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
    
  console.log(`Website source processed: ${propertiesFound} found, ${propertiesAdded} added`)
}
