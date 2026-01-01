import { createClient } from '@/lib/supabase/server'
import { documentService } from '@/services/document.service'
import { DocumentsClientView } from '@/components/features/documents/documents-client-view'
import { DocumentFilterParams } from '@/types'
import { PAGINATION } from '@/constants/pagination-constants'

interface SearchParams {
  page?: string
  search?: string
  groupId?: string
  typeId?: string
  status?: string
  startDate?: string
  endDate?: string
}

interface DocumentsPageProps {
  searchParams: Promise<SearchParams>
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const supabase = await createClient()

  // Await searchParams (Next.js 15+)
  const params = await searchParams

  // Parse pagination params
  const page = parseInt(params.page || String(PAGINATION.DEFAULT_PAGE))
  const pageSize = PAGINATION.PAGE_SIZE

  // Parse filter params
  const filters: DocumentFilterParams = {
    search: params.search,
    groupId: params.groupId,
    typeId: params.typeId,
    status: params.status,
    startDate: params.startDate,
    endDate: params.endDate,
  }

  // Fetch paginated data
  const paginatedData = await documentService.getDocumentsPaginated(
    supabase,
    { page, pageSize },
    filters
  )

  return (
    <DocumentsClientView
      initialData={paginatedData}
    />
  )
}