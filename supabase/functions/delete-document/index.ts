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

    const { documentId } = await req.json()
    if (!documentId) throw new Error('Document ID is required')

    const { data: doc, error: fetchError } = await supabaseAdmin
      .from('ppk_documents')
      .select('cloudinary_public_id')
      .eq('id', documentId)
      .single()

    if (fetchError || !doc) throw new Error('Document not found')

    if (doc.cloudinary_public_id) {
      const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')
      const apiKey = Deno.env.get('CLOUDINARY_API_KEY')
      const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')
      const authString = btoa(`${apiKey}:${apiSecret}`)

      await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?public_ids[]=${doc.cloudinary_public_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${authString}`
        }
      })
    }

    const { error: deleteError } = await supabaseAdmin
      .from('ppk_documents')
      .delete()
      .eq('id', documentId)

    if (deleteError) throw deleteError

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})