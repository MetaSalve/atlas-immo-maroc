
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { processFacebookMarketplace } from './facebook.ts'
import { processWebsite } from './website.ts'

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
