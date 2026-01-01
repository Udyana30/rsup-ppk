'use client'

import { useState } from 'react'
import { Plus, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MedicalStaffGroup, PpkType } from '@/types'
import { MasterDataFilters } from './master-data-filters'
import { MasterDataCards } from './master-data-cards'

type MasterData = MedicalStaffGroup | PpkType

interface MasterDataViewProps {
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

export function MasterDataView({
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
}: MasterDataViewProps) {

    const [sortBy, setSortBy] = useState('newest')

    const filteredData = data.filter(item => {
        return item.name.toLowerCase().includes(search.toLowerCase())
    })

    const sortedData = [...filteredData].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
        if (sortBy === 'name_desc') return b.name.localeCompare(a.name)
        return 0
    })

    return (
        <div className="flex flex-col h-full space-y-6 p-4 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
                    <p className="text-gray-500">Kelola data referensi sistem.</p>
                    <p className="mt-2 text-sm font-medium text-gray-700">
                        Total Data: <span className="text-blue-600">{filteredData.length}</span>
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
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                {sortedData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-gray-200 bg-white border-dashed">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 mb-4">
                            <Activity className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="font-semibold text-gray-900">Tidak ada data ditemukan</p>
                        <p className="text-sm text-gray-500 mt-1">Coba sesuaikan filter pencarian Anda</p>
                    </div>
                ) : (
                    <MasterDataCards
                        data={sortedData}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isProcessing={isProcessing}
                        isAdmin={isAdmin}
                    />
                )}
            </div>
        </div>
    )
}