import { DocumentDetailView } from '@/components/features/documents/document-detail-view'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DocumentDetailPage({ params }: PageProps) {
  const { id } = await params
  return <DocumentDetailView documentId={id} />
}