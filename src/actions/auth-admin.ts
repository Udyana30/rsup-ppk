'use server'

import { createClient } from '@supabase/supabase-js'
import { ENV } from '@/constants/config'

const supabaseAdmin = createClient(
  ENV.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function adminCreateUser(formData: any) {
  const email = formData.email
  const password = Math.random().toString(36).slice(-8)
  const fullName = formData.fullName
  const role = formData.role

  const { error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: role
    }
  })

  if (authError) {
    return { success: false, error: authError.message }
  }

  return { success: true, tempPassword: password }
}

export async function adminDeleteUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true }
}