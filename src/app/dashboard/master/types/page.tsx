import { createClient } from '@/lib/supabase/server'
import { masterService } from '@/services/master.service'
import { TypesClientView } from '@/components/features/master/types-client-view'

export default async function TypesPage() {
  const supabase = await createClient()
  const { data } = await masterService.getTypes(supabase)

  return <TypesClientView initialData={data || []} />
}