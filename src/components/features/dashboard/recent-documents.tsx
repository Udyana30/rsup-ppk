'use client'

import { PpkDocument } from '@/types'
import { FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface RecentDocumentsProps {
  documents: PpkDocument[]
}

export function RecentDocuments({ documents }: RecentDocumentsProps) {
  // Limit to 7 items
  const recentDocs = documents.slice(0, 7)

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col h-[400px] transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between pl-6 pt-6 pb-2 shrink-0 border-b border-gray-50">
        <h3 className="font-semibold text-gray-900 text-sm">Dokumen Terbaru</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
        <div className="space-y-2.5">
          {recentDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-xs">Belum ada dokumen</p>
            </div>
          ) : (
            recentDocs.map((doc) => (
              <Link
                key={doc.id}
                href={`/dashboard/documents/${doc.id}`}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 group cursor-pointer border border-transparent hover:border-gray-100 hover:shadow-sm hover:scale-[1.01]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#41A67E] group-hover:bg-[#41A67E] group-hover:text-white transition-colors duration-300 shadow-sm">
                  <FileText className="h-4.5 w-4.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate text-xs group-hover:text-[#41A67E] transition-colors" title={doc.title}>
                    {doc.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-0.5">
                    <span className="truncate max-w-[120px]">
                      {doc.group_id ? 'KSM' : '-'}
                    </span>
                    <span>•</span>
                    <span className="truncate max-w-[80px]">
                      {doc.type_id ? 'Tipe' : '-'}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <p className="text-[10px] font-medium text-gray-900">
                      {new Date(doc.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    <div className={`text-[9px] px-1.5 py-0.5 rounded-full inline-block mt-0.5 border ${doc.is_active
                      ? 'bg-green-50 text-green-700 border-green-100'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                      }`}>
                      {doc.is_active ? 'Aktif' : 'Non-Aktif'}
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#41A67E] group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}