'use client'

import { Pencil, Trash2, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MedicalStaffGroup, PpkType } from '@/types'
import { cn } from '@/lib/utils'

type MasterData = MedicalStaffGroup | PpkType

interface MasterDataTableProps {
  title: string
  data: MasterData[]
  search: string
  setSearch: (val: string) => void
  onAdd: () => void
  onEdit: (item: MasterData) => void
  onDelete: (id: string) => void
  isProcessing?: boolean
  extraColumnName?: string
}

export function MasterDataTable({
  title,
  data,
  search,
  setSearch,
  onAdd,
  onEdit,
  onDelete,
  isProcessing,
  extraColumnName
}: MasterDataTableProps) {
  
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
          <p className="text-gray-500">Kelola master data sistem.</p>
        </div>
        <Button onClick={onAdd} className="bg-[#41A67E] hover:bg-[#368f6b] shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Data
        </Button>
      </div>

      <div className="flex items-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={`Cari ${title}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-bold">Nama</th>
              {extraColumnName && <th className="px-6 py-4 font-bold">{extraColumnName}</th>}
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Terakhir Update</th>
              <th className="px-6 py-4 text-right font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Data tidak ditemukan.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  {extraColumnName && (
                    <td className="px-6 py-4 text-gray-600">
                      {'code' in item ? item.code : 'description' in item ? item.description || '-' : '-'}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <Badge variant={item.is_active ? 'success' : 'outline'} className={cn(!item.is_active && "text-gray-500")}>
                      {item.is_active ? 'Aktif' : 'Non-Aktif'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 p-0 text-[#41A67E] border-[#41A67E]"
                        title="Edit Data"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="destructive"
                        disabled={isProcessing}
                        onClick={() => onDelete(item.id)}
                        className="h-8 w-8 p-0 bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}