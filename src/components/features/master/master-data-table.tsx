'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, Activity, File, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MedicalStaffGroup, PpkType } from '@/types'
import { cn } from '@/lib/utils'
import { MasterDataFilters } from './master-data-filters'

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
    isAdmin: boolean
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
    extraColumnName,
    isAdmin
}: MasterDataTableProps) {

    const [statusFilter, setStatusFilter] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    const activeCount = data.filter(item => item.is_active).length

    const filteredData = data.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
        let matchStatus = true
        if (statusFilter === 'active') matchStatus = item.is_active === true
        if (statusFilter === 'inactive') matchStatus = item.is_active === false
        return matchSearch && matchStatus
    })

    const sortedData = [...filteredData].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
        if (sortBy === 'name_desc') return b.name.localeCompare(a.name)
        return 0
    })

    const colWidths = {
        name: 'w-[40%]',
        extra: 'w-[30%]',
        status: 'w-[15%]',
        action: 'w-[15%]'
    }

    return (
        <div className="flex flex-col h-full space-y-6 px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
                    <p className="text-gray-500">Kelola data referensi sistem.</p>
                    <p className="mt-2 text-sm font-medium text-gray-700">
                        Total Data Aktif: <span className="text-[#41A67E]">{activeCount}</span>
                        <span className="mx-2 text-gray-300">|</span>
                        Tampil: <span className="text-blue-600">{filteredData.length}</span>
                    </p>
                </div>
                {isAdmin && (
                    <Button onClick={onAdd} className="bg-[#41A67E] hover:bg-[#368f6b] shadow-sm font-semibold h-10 px-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Baru
                    </Button>
                )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shrink-0">
                <MasterDataFilters
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/50 text-gray-700 border-b border-gray-100 table w-full table-fixed">
                        <tr>
                            <th className={`px-6 py-4 font-semibold ${colWidths.name}`}>Nama</th>
                            {extraColumnName && (
                                <th className={`px-6 py-4 font-semibold ${colWidths.extra}`}>{extraColumnName}</th>
                            )}
                            <th className={`px-6 py-4 font-semibold ${colWidths.status}`}>Status</th>
                            <th className={`px-6 py-4 text-right font-semibold ${colWidths.action}`}>
                                {isAdmin ? 'Aksi' : ''}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 block overflow-y-auto max-h-[calc(100vh-340px)] w-full">
                        {sortedData.length === 0 ? (
                            <tr className="table w-full table-fixed">
                                <td colSpan={4} className="p-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                                            <Activity className="h-8 w-8 text-gray-300" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Tidak ada data ditemukan</p>
                                            <p className="text-sm mt-1">Coba sesuaikan filter pencarian Anda</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((item) => (
                                <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors table w-full table-fixed">
                                    <td className={`px-6 py-4 ${colWidths.name}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                {'code' in item ? <File className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                                            </div>
                                            <span className="font-semibold text-gray-900">{item.name}</span>
                                        </div>
                                    </td>
                                    {extraColumnName && (
                                        <td className={`px-6 py-4 ${colWidths.extra}`}>
                                            {'code' in item ? (
                                                item.code ? (
                                                    <span className="font-mono font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md text-xs border border-blue-100">
                                                        {item.code}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">Tanpa Kode</span>
                                                )
                                            ) : (
                                                <span className="text-gray-600 font-medium line-clamp-1">
                                                    {(item as any).description || '-'}
                                                </span>
                                            )}
                                        </td>
                                    )}
                                    <td className={`px-6 py-4 ${colWidths.status}`}>
                                        <Badge
                                            variant={item.is_active ? 'success' : 'outline'}
                                            className="px-2.5 py-0.5 font-medium"
                                        >
                                            {item.is_active ? 'Aktif' : 'Non-Aktif'}
                                        </Badge>
                                    </td>
                                    <td className={`px-6 py-4 text-right ${colWidths.action}`}>
                                        {isAdmin && (
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onEdit(item)}
                                                    className="h-8 w-8 p-0 text-[#41A67E] border-[#41A67E]/30 hover:bg-[#41A67E]/5 hover:border-[#41A67E]"
                                                    title="Edit Data"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    disabled={isProcessing}
                                                    onClick={() => onDelete(item.id)}
                                                    className="h-8 w-8 p-0 bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        )}
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