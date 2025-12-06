import { createClient } from '@/lib/supabase/server'
import { userService } from '@/services/user.service'
import { UsersClientView } from '@/components/features/users/users-client-view'
import { Profile } from '@/types'

export default async function UsersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '')
    .single()

  const users = await userService.getAllUsers(supabase)

  return (
    <UsersClientView 
      initialUsers={users || []}
      currentUser={currentUserProfile as Profile}
    />
  )
}