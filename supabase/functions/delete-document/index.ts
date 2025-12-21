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

    const { data: doc, error: fetchError } = await supabaseAdmin
      .from('ppk_documents')
      .select('cloudinary_public_id')
      .eq('id', documentId)
      .single()

    if (fetchError || !doc) {
      console.error('Document not found or fetch error:', fetchError)
      throw new Error('Document not found')
    }

    if (doc.cloudinary_public_id) {
      try {
        const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')
        const apiKey = Deno.env.get('CLOUDINARY_API_KEY')
        const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')
        const authString = btoa(`${apiKey}:${apiSecret}`)

        console.log(`Deleting image from Cloudinary: ${doc.cloudinary_public_id}`)

        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?public_ids[]=${doc.cloudinary_public_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Basic ${authString}`
          }
        })

        if (!cloudinaryRes.ok) {
          const errorText = await cloudinaryRes.text()
          console.error('Cloudinary delete failed:', errorText)
        }
      } catch (cloudError) {
        console.error('Error deleting from Cloudinary:', cloudError)
      }
    }

    const { error: deleteError } = await supabaseAdmin
      .from('ppk_documents')
      .delete()
      .eq('id', documentId)

    if (deleteError) {
      console.error('Database delete error:', deleteError)
      throw deleteError
    }

    console.log(`Document ${documentId} deleted successfully`)

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