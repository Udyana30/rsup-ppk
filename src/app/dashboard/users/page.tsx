import { createClient } from '@/lib/supabase/server'
import { userService } from '@/services/user.service'
import { UsersClientView } from '@/components/features/users/users-client-view'
import { Profile, UserFilterParams } from '@/types'
import { PAGINATION } from '@/constants/pagination-constants'

interface SearchParams {
  page?: string
  search?: string
  role?: string
  status?: string
}

interface UsersPageProps {
  searchParams: Promise<SearchParams>
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '')
    .single()

  // Await searchParams (Next.js 15+)
  const params = await searchParams

  // Parse pagination params
  const page = parseInt(params.page || String(PAGINATION.DEFAULT_PAGE))
  const pageSize = PAGINATION.PAGE_SIZE

  // Parse filter params
  const filters: UserFilterParams = {
    search: params.search,
    role: params.role,
    status: params.status,
  }

  // Fetch paginated data
  const paginatedData = await userService.getUsersPaginated(
    supabase,
    { page, pageSize },
    filters
  )

  return (
    <UsersClientView
      initialData={paginatedData}
      currentUser={currentUserProfile as Profile}
    />
  )
}