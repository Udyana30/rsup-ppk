'use client'

import { useDocuments } from '@/hooks/use-documents'
import { Button } from '@/components/ui/button'
import { Trash2, FileText, Download } from 'lucide-react'

export function DocumentTable() {
  const { documents, loading, error, deleteDocument } = useDocuments()

  if (loading) return <div className="p-4 text-center">Loading documents...</div>
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>
  if (documents.length === 0) return <div className="p-4 text-center">No documents found.</div>

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document permanently?')) {
      await deleteDocument(id)
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3 font-medium">Document Title</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">KSM Group</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-gray-900">{doc.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{doc.ppk_types?.name || '-'}</td>
                <td className="px-6 py-4 text-gray-600">{doc.medical_staff_groups?.name || '-'}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                        </Button>
                    </a>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}