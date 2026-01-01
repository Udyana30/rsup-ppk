'use client'

import { useRouter } from 'next/navigation'
import { PpkDocument } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Pencil, Trash2, User } from 'lucide-react'

interface DocumentTableProps {
  documents: PpkDocument[]
  isAdmin: boolean
  onEdit: (doc: PpkDocument) => void
  onDelete: (id: string) => void
}

export function DocumentTable({ documents, isAdmin, onEdit, onDelete }: DocumentTableProps) {
  const router = useRouter()

  const handleRowClick = (docId: string) => {
    router.push(`/dashboard/documents/${docId}`)
  }

  const handleEditClick = (e: React.MouseEvent, doc: PpkDocument) => {
    e.stopPropagation()
    onEdit(doc)
  }

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    onDelete(id)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header Table - Fixed */}
      <div className="overflow-hidden bg-gray-50">
        <table className="w-full text-left text-sm table-fixed">
          <thead className="text-gray-700 shadow-sm">
            <tr className="pr-[17px] flex">
              <th className="px-6 py-4 font-bold" style={{ width: '38%' }}>Judul Dokumen</th>
              <th className="px-6 py-4 font-bold" style={{ width: '13%' }}>Jenis</th>
              <th className="px-6 py-4 font-bold" style={{ width: '16%' }}>Kategori</th>
              <th className="px-6 py-4 font-bold" style={{ width: '12%' }}>Status</th>
              <th className="px-6 py-4 font-bold" style={{ width: '13%' }}>Tanggal</th>
              <th className="px-6 py-4 text-right font-bold" style={{ width: '8%' }}>
                {isAdmin ? 'Aksi' : ''}
              </th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Body Table - Scrollable */}
      <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-400px)]">
        <table className="w-full text-left text-sm table-fixed">
          <tbody className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <tr
                key={doc.id}
                onClick={() => handleRowClick(doc.id)}
                className="group cursor-pointer hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-6 py-4" style={{ width: '38%' }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-semibold text-gray-900 line-clamp-1">
                        {doc.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.5 rounded text-[10px] font-medium gap-1.5">
                          Ver. {doc.version || '1'}
                        </span>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center min-w-0">
                          <User className="h-3 w-3 shrink-0" />
                          <span className="truncate">{doc.profiles?.full_name || 'System'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4" style={{ width: '13%' }}>
                  {doc.ppk_types?.name ? (
                    <span className="inline-block font-mono font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100 text-xs">
                      {doc.ppk_types.name}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium" style={{ width: '16%' }}>
                  <span className="line-clamp-1">{doc.medical_staff_groups?.name || '-'}</span>
                </td>
                <td className="px-6 py-4" style={{ width: '12%' }}>
                  <Badge variant={doc.is_active ? 'success' : 'outline'}>
                    {doc.is_active ? 'Aktif' : 'Non-Aktif'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap" style={{ width: '13%' }}>
                  {new Date(doc.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-right" style={{ width: '8%' }}>
                  {isAdmin && (
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleEditClick(e, doc)}
                        className="h-8 w-8 p-0 text-[#41A67E] border-[#41A67E] hover:bg-[#41A67E] hover:text-white"
                        title="Edit Data"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => handleDeleteClick(e, doc.id)}
                        className="h-8 w-8 p-0 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-100"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}