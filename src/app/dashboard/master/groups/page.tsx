import { createClient } from '@/lib/supabase/server'
import { masterService } from '@/services/master.service'
import { GroupsClientView } from '@/components/features/master/groups-client-view'

export default async function GroupsPage() {
  const supabase = await createClient()
  const { data } = await masterService.getGroups(supabase)

  return <GroupsClientView initialData={data || []} />
}