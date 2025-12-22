import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization Header')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const supabaseUserClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { global: { headers: { Authorization: authHeader } } }
    )

    const {
      data: { user },
    } = await supabaseUserClient.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    )

    let documentId
    try {
      const bodyText = await req.text()
      console.log('Raw request body:', bodyText)
      if (!bodyText) throw new Error('Empty request body')
      
      const body = JSON.parse(bodyText)
      documentId = body.documentId
    } catch (e) {
      console.error('Body parsing error:', e)
      throw new Error('Invalid request body')
    }

    if (!documentId) throw new Error('Document ID is required')

    console.log(`Attempting to delete document: ${documentId}`)

    // 1. Fetch document and its versions to get all Cloudinary IDs
    const { data: doc, error: fetchError } = await supabaseAdmin
      .from('ppk_documents')
      .select('cloudinary_public_id')
      .eq('id', documentId)
      .single()

    if (fetchError || !doc) {
      console.error('Document not found or fetch error:', fetchError)
      throw new Error('Document not found')
    }

    const { data: versions, error: versionsError } = await supabaseAdmin
      .from('ppk_document_versions')
      .select('cloudinary_public_id')
      .eq('document_id', documentId)

    if (versionsError) {
      console.error('Error fetching versions:', versionsError)
      throw versionsError
    }

    // Collect all unique Cloudinary IDs
    const publicIds = new Set<string>()
    if (doc.cloudinary_public_id) publicIds.add(doc.cloudinary_public_id)
    if (versions) {
      versions.forEach(v => {
        if (v.cloudinary_public_id) publicIds.add(v.cloudinary_public_id)
      })
    }

    // 2. Delete images from Cloudinary
    if (publicIds.size > 0) {
      const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')
      const apiKey = Deno.env.get('CLOUDINARY_API_KEY')
      const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')
      const authString = btoa(`${apiKey}:${apiSecret}`)

      const idsArray = Array.from(publicIds)
      const batchSize = 20 // Reduced to 20 to ensure URL length stays within safe limits
      
      for (let i = 0; i < idsArray.length; i += batchSize) {
        const batch = idsArray.slice(i, i + batchSize)
        const queryParams = batch.map(id => `public_ids[]=${encodeURIComponent(id)}`).join('&')
        
        console.log(`Deleting batch of ${batch.length} images from Cloudinary`)

        try {
          const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?${queryParams}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Basic ${authString}`
            }
          })

          if (!cloudinaryRes.ok) {
            const errorText = await cloudinaryRes.text()
            console.error('Cloudinary delete failed for batch:', errorText)
            // We continue even if image delete fails, to ensure DB consistency
          }
        } catch (cloudError) {
          console.error('Error deleting from Cloudinary:', cloudError)
        }
      }
    }

    // 3. Delete from Database (Child records first)
    
    // Delete Logs
    const { error: logsError } = await supabaseAdmin
      .from('ppk_document_logs')
      .delete()
      .eq('document_id', documentId)

    if (logsError) {
      console.error('Error deleting logs:', logsError)
      throw logsError
    }

    // Delete Versions
    const { error: versionsDeleteError } = await supabaseAdmin
      .from('ppk_document_versions')
      .delete()
      .eq('document_id', documentId)

    if (versionsDeleteError) {
      console.error('Error deleting versions:', versionsDeleteError)
      throw versionsDeleteError
    }

    // Delete Document
    const { error: deleteError } = await supabaseAdmin
      .from('ppk_documents')
      .delete()
      .eq('id', documentId)

    if (deleteError) {
      console.error('Database delete error:', deleteError)
      throw deleteError
    }

    console.log(`Document ${documentId} and all related data deleted successfully`)

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error: any) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})