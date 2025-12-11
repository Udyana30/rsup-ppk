import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { sha1 } from "https://esm.sh/js-sha1@0.6.0"

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
    if (!authHeader) throw new Error('Missing Authorization Header')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      console.error("Auth failed:", authError)
      throw new Error('Unauthorized')
    }

    console.log(`Generating signature for user: ${user.id}`)

    const { uploadPreset } = await req.json()
    if (!uploadPreset) throw new Error('Upload Preset required')

    const timestamp = Math.round((new Date()).getTime() / 1000)
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY')
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')

    if (!apiSecret || !apiKey || !cloudName) {
      console.error("Missing Cloudinary Configuration")
      throw new Error('Server Configuration Error')
    }

    const paramsToSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}`
    const stringToSign = `${paramsToSign}${apiSecret}`
    const signature = sha1(stringToSign)

    console.log(`Signature generated successfully for preset: ${uploadPreset}`)

    return new Response(
      JSON.stringify({ 
        signature, 
        timestamp, 
        apiKey, 
        cloudName 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error: any) {
    console.error("Signature generation failed:", error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})