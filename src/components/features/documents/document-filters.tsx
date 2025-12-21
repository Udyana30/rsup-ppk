'use client'

import { useState } from 'react'
import { Search, Filter, X, Calendar, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCategories } from '@/hooks/master/use-categories'
import { cn } from '@/lib/utils'

interface DocumentFiltersProps {
  search: string
  setSearch: (value: string) => void
  groupFilter: string
  setGroupFilter: (value: string) => void
  typeFilter: string
  setTypeFilter: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  startDate: string
  setStartDate: (value: string) => void
  endDate: string
  setEndDate: (value: string) => void
}

export function DocumentFilters({
  search, setSearch,
  groupFilter, setGroupFilter,
  typeFilter, setTypeFilter,
  statusFilter, setStatusFilter,
  startDate, setStartDate,
  endDate, setEndDate
}: DocumentFiltersProps) {
  const { groups, types } = useCategories()
  const [isExpanded, setIsExpanded] = useState(false)

  const activeFiltersCount = [groupFilter, typeFilter, statusFilter, startDate, endDate].filter(Boolean).length

  const clearFilters = () => {
    setGroupFilter('')
    setTypeFilter('')
    setStatusFilter('')
    setStartDate('')
    setEndDate('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cari berdasarkan judul dokumen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-[#41A67E] focus:ring-[#41A67E]"
          />
        </div>
        <Button
          variant={isExpanded ? 'primary' : 'outline'}
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-[#41A67E] focus-visible:ring-[#41A67E]",
            (isExpanded || activeFiltersCount > 0) && "border-[#41A67E] text-[#41A67E] bg-[#41A67E]/5"
          )}
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#41A67E] text-[10px] text-white">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-5">

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Mulai Tanggal</label>
              <div className="relative">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10 bg-white border-gray-300 text-gray-900 text-sm focus:border-[#41A67E] focus:ring-[#41A67E] pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Sampai Tanggal</label>
              <div className="relative">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-10 bg-white border-gray-300 text-gray-900 text-sm focus:border-[#41A67E] focus:ring-[#41A67E] pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Status</label>
              <div className="relative">
                <select
                  className="h-10 w-full appearance-none rounded-md border border-gray-300 bg-white pl-3 pr-10 text-sm text-gray-900 focus:border-[#41A67E] focus:outline-none focus:ring-1 focus:ring-[#41A67E]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="active">Aktif (Published)</option>
                  <option value="inactive">Non-Aktif (Archived)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Kelompok Staff Medis</label>
              <div className="relative">
                <select
                  className="h-10 w-full appearance-none rounded-md border border-gray-300 bg-white pl-3 pr-10 text-sm text-gray-900 focus:border-[#41A67E] focus:outline-none focus:ring-1 focus:ring-[#41A67E]"
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                >
                  <option value="">Semua KSM</option>
                  {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Jenis Dokumen</label>
              <div className="relative">
                <select
                  className="h-10 w-full appearance-none rounded-md border border-gray-300 bg-white pl-3 pr-10 text-sm text-gray-900 focus:border-[#41A67E] focus:outline-none focus:ring-1 focus:ring-[#41A67E]"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">Semua Jenis</option>
                  {types.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end border-t border-gray-200 pt-3">
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-gray-600 hover:text-red-600 flex items-center gap-1.5 transition-colors px-2 py-1 rounded hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" />
              Reset Semua Filter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}