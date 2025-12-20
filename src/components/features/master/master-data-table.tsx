'use client'

import { useState } from 'react'
import { Pencil, Trash2, Search, Plus, Filter, ArrowUpDown, Activity } from 'lucide-react'
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

    const filteredData = data.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
        let matchStatus = true
        if (statusFilter === 'active') matchStatus = item.is_active === true
        if (statusFilter === 'inactive') matchStatus = item.is_active === false
        return matchSearch && matchStatus
    }).sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
        if (sortBy === 'name_desc') return b.name.localeCompare(a.name)
        return 0
    })

    const getColWidths = () => {
        if (extraColumnName) {
            return isAdmin 
                ? { name: 'w-[30%]', extra: 'w-[20%]', status: 'w-[15%]', date: 'w-[20%]', action: 'w-[15%]' }
                : { name: 'w-[35%]', extra: 'w-[25%]', status: 'w-[20%]', date: 'w-[20%]', action: 'hidden' }
        } else {
            return isAdmin
                ? { name: 'w-[40%]', extra: 'hidden', status: 'w-[20%]', date: 'w-[25%]', action: 'w-[15%]' }
                : { name: 'w-[50%]', extra: 'hidden', status: 'w-[25%]', date: 'w-[25%]', action: 'hidden' }
        }
    }

    const colWidths = getColWidths()

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
                    <p className="text-gray-500">Kelola master data sistem.</p>
                </div>
                {isAdmin && (
                    <Button onClick={onAdd} className="bg-[#41A67E] hover:bg-[#368f6b] shadow-sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Data
                    </Button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm shrink-0">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={`Cari ${title}...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10"
                    />
                </div>
                <div className="flex gap-3">
                    <div className="relative min-w-[160px]">
                        <select
                            className="h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-[#41A67E] focus:outline-none focus:ring-1 focus:ring-[#41A67E]"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Non-Aktif</option>
                        </select>
                        <Activity className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative min-w-[180px]">
                        <select
                            className="h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-[#41A67E] focus:outline-none focus:ring-1 focus:ring-[#41A67E]"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Terbaru</option>
                            <option value="oldest">Terlama</option>
                            <option value="name_asc">Nama (A-Z)</option>
                            <option value="name_desc">Nama (Z-A)</option>
                        </select>
                        <ArrowUpDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-700 shadow-sm table w-full table-fixed">
                        <tr>
                            <th className={`px-6 py-4 font-bold align-middle ${colWidths.name}`}>Nama</th>
                            {extraColumnName && <th className={`px-6 py-4 font-bold align-middle ${colWidths.extra}`}>{extraColumnName}</th>}
                            <th className={`px-6 py-4 font-bold align-middle ${colWidths.status}`}>Status</th>
                            <th className={`px-6 py-4 font-bold align-middle ${colWidths.date}`}>Terakhir Update</th>
                            {isAdmin && <th className={`px-6 py-4 text-right font-bold align-middle ${colWidths.action}`}>Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 block overflow-y-auto max-h-[calc(100vh-320px)] w-full">
                        {filteredData.length === 0 ? (
                            <tr className="table w-full table-fixed">
                                <td colSpan={isAdmin ? (extraColumnName ? 5 : 4) : (extraColumnName ? 4 : 3)} className="p-8 text-center text-gray-500">
                                    Data tidak ditemukan.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item) => (
                                <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors table w-full table-fixed">
                                    <td className={`px-6 py-4 font-medium text-gray-900 align-middle ${colWidths.name}`}>{item.name}</td>
                                    {extraColumnName && (
                                        <td className={`px-6 py-4 text-gray-600 align-middle ${colWidths.extra}`}>
                                            {'code' in item ? item.code : 'description' in item ? item.description || '-' : '-'}
                                        </td>
                                    )}
                                    <td className={`px-6 py-4 align-middle ${colWidths.status}`}>
                                        <Badge variant={item.is_active ? 'success' : 'outline'} className={cn(!item.is_active && "text-gray-500")}>
                                            {item.is_active ? 'Aktif' : 'Non-Aktif'}
                                        </Badge>
                                    </td>
                                    <td className={`px-6 py-4 text-gray-500 align-middle ${colWidths.date}`}>
                                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    {isAdmin && (
                                        <td className={`px-6 py-4 text-right align-middle ${colWidths.action}`}>
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
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}