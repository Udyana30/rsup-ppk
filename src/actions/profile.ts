'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { adminUpdateUserEmail } from './auth-admin'
import { formatUsernameToEmail } from '@/lib/auth-helpers'

export async function updateProfile(userId: string, data: { fullName: string; username: string }) {
  const supabase = await createClient()

  // 1. Get current profile to check if username changed
  const { data: currentProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .single()

  if (fetchError) {
    return { success: false, error: fetchError.message }
  }

  // 2. Update Profile Data
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: data.fullName,
      username: data.username,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    return { success: false, error: error.message }
  }

  // 3. If username changed, sync email (using admin action to bypass verification)
  if (currentProfile.username !== data.username) {
    const newEmail = formatUsernameToEmail(data.username)
    const emailUpdateRes = await adminUpdateUserEmail(userId, newEmail)
    
    if (!emailUpdateRes.success) {
      // Note: Profile is updated but email sync failed. 
      // Ideally we might want to rollback profile update or warn user.
      // For now, we return error.
      return { success: false, error: `Profil diperbarui tapi gagal sync email: ${emailUpdateRes.error}` }
    }
  }

  revalidatePath('/dashboard/profile')
  return { success: true }
}

export async function changePassword(newPassword: string) {
  const supabase = await createClient()

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true }
}