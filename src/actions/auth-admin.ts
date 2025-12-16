'use server'

import { createClient } from '@supabase/supabase-js'
import { ENV } from '@/constants/config'
import { formatUsernameToEmail } from '@/lib/auth-helpers'

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

export async function adminCreateUser(formData: { username: string, fullName: string, role: string }) {
  const username = formData.username
  const email = formatUsernameToEmail(username)
  const password = Math.random().toString(36).slice(-8)
  const fullName = formData.fullName
  const role = formData.role

  const { error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: role,
      username: username 
    }
  })

  if (authError) {
    return { success: false, error: authError.message }
  }

  return { success: true, tempPassword: password, username: username }
}

export async function adminUpdateUser(userId: string, data: { fullName?: string, role?: string, isActive?: boolean }) {
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({
      full_name: data.fullName,
      role: data.role,
      is_active: data.isActive
    })
    .eq('id', userId)

  if (profileError) {
    return { success: false, error: profileError.message }
  }

  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: {
      full_name: data.fullName,
      role: data.role
    },
    ban_duration: data.isActive === false ? '876000h' : 'none'
  })

  if (authError) {
    return { success: false, error: authError.message }
  }

  return { success: true }
}

export async function adminDeleteUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true }
}

export async function adminResetPassword(userId: string, newPassword: string) {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function adminUpdateUserEmail(userId: string, newEmail: string) {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    email: newEmail,
    email_confirm: true
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}