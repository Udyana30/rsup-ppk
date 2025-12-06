import { createClient } from '@/lib/supabase/server'
import { documentService } from '@/services/document.service'
import { DocumentsClientView } from '@/components/features/documents/documents-client-view'

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: documents } = await documentService.getDocuments(supabase)
  
  return (
    <DocumentsClientView 
      initialDocuments={documents || []} 
    />
  )
}