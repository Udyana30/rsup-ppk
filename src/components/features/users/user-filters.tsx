'use client'

import { Search, Filter, Activity } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface UserFiltersProps {
  search: string
  setSearch: (val: string) => void
  roleFilter: string
  setRoleFilter: (val: string) => void
  statusFilter: string
  setStatusFilter: (val: string) => void
}

export function UserFilters({
  search, setSearch,
  roleFilter, setRoleFilter,
  statusFilter, setStatusFilter
}: UserFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Cari nama user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10 bg-white border-gray-300 text-gray-900 focus:border-[#41A67E] focus:ring-[#41A67E]"
        />
      </div>
      <div className="flex gap-3">
        <div className="relative min-w-[160px]">
          <select
            className="h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-[#41A67E] focus:outline-none focus:ring-1 focus:ring-[#41A67E]"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="user">User / Dokter</option>
          </select>
          <Filter className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative min-w-[160px]">
          <select
            className="h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-[#41A67E] focus:outline-none focus:ring-1 focus:ring-[#41A67E]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Dibekukan</option>
          </select>
          <Activity className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}