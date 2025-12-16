import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileClientView } from '@/components/features/profile/profile-client-view'
import { Profile } from '@/types'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return <div>Profil tidak ditemukan. Hubungi admin.</div>
  }

  return (
    <ProfileClientView
      profile={profile as unknown as Profile}
    />
  )
}