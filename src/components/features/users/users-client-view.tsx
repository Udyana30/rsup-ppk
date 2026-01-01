'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { Profile, PaginatedResponse } from '@/types'
import { Button } from '@/components/ui/button'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { useUserActions } from '@/hooks/users/use-user-actions'
import { UserFilters } from '@/components/features/users/user-filters'
import { UserTable } from '@/components/features/users/user-table'
import { Pagination } from '@/components/ui/pagination'
import { Plus } from 'lucide-react'


const Modal = dynamic(() => import('@/components/ui/modal').then(mod => mod.Modal))
const CreateUserModal = dynamic(() => import('@/components/features/users/modal/create-user-modal').then(mod => mod.CreateUserModal))
const EditUserModal = dynamic(() => import('@/components/features/users/modal/edit-user-modal').then(mod => mod.EditUserModal))

interface UsersClientViewProps {
    initialData: PaginatedResponse<Profile>
    currentUser: Profile
}

export function UsersClientView({ initialData, currentUser }: UsersClientViewProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { deleteUser, isProcessing } = useUserActions()

    const [paginatedData, setPaginatedData] = useState(initialData)
    const { data: users, pagination } = paginatedData

    // Initialize filters from URL
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '')
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<Profile | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    // Track previous filter values untuk detect perubahan
    const prevFiltersRef = useRef({ search, roleFilter, statusFilter })

    useEffect(() => {
        setPaginatedData(initialData)
    }, [initialData])

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        const prev = prevFiltersRef.current

        // Cek apakah ada filter yang berubah
        const filterChanged =
            prev.search !== search ||
            prev.roleFilter !== roleFilter ||
            prev.statusFilter !== statusFilter

        // Update params dengan filter values
        if (search) params.set('search', search)
        else params.delete('search')

        if (roleFilter) params.set('role', roleFilter)
        else params.delete('role')

        if (statusFilter) params.set('status', statusFilter)
        else params.delete('status')

        // Hanya reset ke page 1 jika filter berubah
        if (filterChanged) {
            params.set('page', '1')
            // Update ref dengan nilai baru
            prevFiltersRef.current = { search, roleFilter, statusFilter }
        }

        const newQuery = params.toString()
        const currentQuery = searchParams.toString()

        const timeoutId = setTimeout(() => {
            if (newQuery !== currentQuery) {
                router.push(`?${newQuery}`)
                router.refresh() // Trigger server-side data refetch
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [search, roleFilter, statusFilter, router, searchParams])

    const handleDeleteConfirm = async () => {
        if (!deleteId) return
        const success = await deleteUser(deleteId)
        if (success) {
            setDeleteId(null)
            router.refresh()
        }
    }

    return (
        <div className="flex flex-col h-full space-y-4 p-4 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manajemen Pengguna</h1>
                    <p className="text-gray-500">Kelola akun dokter dan staf admin.</p>
                    <p className="mt-2 text-sm font-medium text-gray-700">
                        Total Pengguna: <span className="text-[#41A67E]">{pagination.totalCount}</span>
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-[#41A67E] hover:bg-[#368f6b] shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Pengguna
                </Button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shrink-0">
                <UserFilters
                    search={search} setSearch={setSearch}
                    roleFilter={roleFilter} setRoleFilter={setRoleFilter}
                    statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                />
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
                <UserTable
                    users={users}
                    currentUser={currentUser}
                    onEdit={setEditingUser}
                    onDelete={setDeleteId}
                    isProcessing={isProcessing}
                />

                {/* Pagination Component */}
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalCount={pagination.totalCount}
                    pageSize={pagination.pageSize}
                    hasNextPage={pagination.hasNextPage}
                    hasPreviousPage={pagination.hasPreviousPage}
                />
            </div>

            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Tambah Pengguna Baru"
            >
                <CreateUserModal
                    currentUser={currentUser}
                    onSuccess={() => {
                        setIsCreateOpen(false)
                        router.refresh()
                    }}
                />
            </Modal>

            {editingUser && (
                <Modal
                    isOpen={!!editingUser}
                    onClose={() => setEditingUser(null)}
                    title="Edit Data Pengguna"
                >
                    <EditUserModal
                        user={editingUser}
                        currentUser={currentUser}
                        onSuccess={() => {
                            setEditingUser(null)
                            router.refresh()
                        }}
                    />
                </Modal>
            )}

            <AlertDialog
                isOpen={!!deleteId}
                title="Hapus Pengguna"
                description="Yakin ingin menghapus pengguna ini secara permanen? Akun yang dihapus tidak dapat dipulihkan."
                confirmLabel="Hapus Permanen"
                variant="destructive"
                isProcessing={isProcessing}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    )
}
