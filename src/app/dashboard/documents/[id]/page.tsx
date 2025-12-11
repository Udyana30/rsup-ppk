import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { documentService } from '@/services/document.service'
import { DocumentDetailView } from '@/components/features/documents/document-detail-view'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DocumentDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: document } = await documentService.getDocumentById(supabase, id)

  if (!document) {
    return <DocumentDetailView documentId={id} initialDocument={null} />
  }

  return (
    <DocumentDetailView 
      documentId={id} 
      initialDocument={document} 
    />
  )
}