import { PpkDocument } from '@/types'
import { FileText, MoreHorizontal, FilePlus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface RecentDocumentsProps {
  documents: PpkDocument[]
}

export function RecentDocuments({ documents }: RecentDocumentsProps) {
  if (documents.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border bg-white p-8 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          Belum ada dokumen
        </h3>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Data dokumen PPK belum tersedia. Silakan unggah dokumen pertama Anda untuk memulai.
        </p>
        <div className="mt-6 text-gray-600 font-medium">
          <Link href="/dashboard/documents">
            <Button variant="outline" className="gap-2">
              <FilePlus className="h-4 w-4" />
              Upload Dokumen
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h3 className="font-semibold text-gray-900">Recent Documents</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.slice(0, 5).map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded bg-blue-50 p-2 text-blue-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-900">{doc.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {doc.medical_staff_groups?.name || 'General'}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    Published
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(doc.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}