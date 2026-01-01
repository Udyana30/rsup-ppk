'use client'

import { Profile } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Shield, Pencil, Trash2, UserCircle, AlertCircle } from 'lucide-react'

interface UserTableProps {
    users: Profile[]
    currentUser: Profile
    onEdit: (user: Profile) => void
    onDelete: (id: string) => void
    isProcessing: boolean
}

export function UserTable({ users, currentUser, onEdit, onDelete, isProcessing }: UserTableProps) {

    const canManageUser = (targetUser: Profile) => {
        if (currentUser.is_super_admin) return true
        if (currentUser.role === 'admin' && targetUser.role === 'user') return true
        return false
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
            {/* Header Table - Fixed */}
            <div className="overflow-hidden bg-gray-50 shrink-0 border-b border-gray-100">
                <table className="w-full text-left text-sm table-fixed">
                    <thead className="text-gray-700 shadow-sm">
                        <tr className="flex pr-[17px]">
                            <th className="px-6 py-4 font-bold" style={{ width: '35%' }}>Nama User</th>
                            <th className="px-6 py-4 font-bold" style={{ width: '30%' }}>Username</th>
                            <th className="px-6 py-4 font-bold" style={{ width: '10%' }}>Role</th>
                            <th className="px-6 py-4 font-bold" style={{ width: '10%' }}>Status</th>
                            <th className="px-6 py-4 text-right font-bold" style={{ width: '15%' }}>Aksi</th>
                        </tr>
                    </thead>
                </table>
            </div>

            {/* Body Table - Scrollable */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ scrollbarGutter: 'stable' }}>
                <table className="w-full text-left text-sm table-fixed">
                    <tbody className="divide-y divide-gray-100">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-10 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-3">
                                        <AlertCircle className="h-10 w-10 text-gray-300" />
                                        <span className="font-medium">Tidak ada user ditemukan</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id} className="group hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4" style={{ width: '35%' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-gray-900 truncate" title={u.full_name || ''}>
                                                    {u.full_name}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4" style={{ width: '30%' }}>
                                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                                            <UserCircle className="h-4 w-4 text-gray-400 shrink-0" />
                                            <span className="truncate" title={u.username || '-'}>{u.username || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4" style={{ width: '10%' }}>
                                        <Badge
                                            variant="outline"
                                            className={
                                                u.role === 'admin'
                                                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
                                                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50"
                                            }
                                        >
                                            {u.role === 'admin' ? 'Admin' : 'User'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4" style={{ width: '10%' }}>
                                        <Badge variant={u.is_active !== false ? 'success' : 'outline'}>
                                            {u.is_active !== false ? 'Aktif' : 'Dibekukan'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right" style={{ width: '15%' }}>
                                        {canManageUser(u) && (
                                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onEdit(u)}
                                                    className="h-8 w-8 p-0 text-[#41A67E] border-[#41A67E] hover:bg-[#41A67E] hover:text-white"
                                                    title="Edit User"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => onDelete(u.id)}
                                                    disabled={isProcessing}
                                                    className="h-8 w-8 p-0 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-100"
                                                    title="Hapus User"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
