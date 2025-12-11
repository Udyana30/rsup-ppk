'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Profile } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { useUserActions } from '@/hooks/use-user-actions'
import { UserFilters } from '@/components/features/users/user-filters'
import { Plus, User, Shield, Pencil, Trash2, AlertCircle, UserCircle, Loader2 } from 'lucide-react'

const Modal = dynamic(() => import('@/components/ui/modal').then(mod => mod.Modal))
const CreateUserModal = dynamic(() => import('@/components/features/users/modal/create-user-modal').then(mod => mod.CreateUserModal))
const EditUserModal = dynamic(() => import('@/components/features/users/modal/edit-user-modal').then(mod => mod.EditUserModal))

interface UsersClientViewProps {
  initialUsers: Profile[]
  currentUser: Profile
}

export function UsersClientView({ initialUsers, currentUser }: UsersClientViewProps) {
  const router = useRouter()
  const { deleteUser, isProcessing } = useUserActions()
  
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredUsers = initialUsers.filter(u => {
    const isNotMe = u.id !== currentUser.id
    const matchSearch = u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
                       u.username?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter ? u.role === roleFilter : true
    
    return isNotMe && matchSearch && matchRole
  })

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    const success = await deleteUser(deleteId)
    if (success) setDeleteId(null)
  }

  const canManageUser = (targetUser: Profile) => {
    if (currentUser.is_super_admin) return true
    if (currentUser.role === 'admin' && targetUser.role === 'user') return true
    return false
  }

  if (currentUser.role !== 'admin') {
    return <div className="p-8 text-center text-red-500 font-bold">Akses Ditolak: Halaman khusus Admin.</div>
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manajemen User</h1>
          <p className="text-gray-500">Kelola akun dokter dan staff admin.</p>
          <p className="mt-2 text-sm font-medium text-gray-700">
            Total User: <span className="text-[#41A67E]">{filteredUsers.length}</span>
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-[#41A67E] hover:bg-[#368f6b] shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Tambah User Baru
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <UserFilters 
          search={search} setSearch={setSearch}
          roleFilter={roleFilter} setRoleFilter={setRoleFilter}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-bold">Nama User</th>
              <th className="px-6 py-4 font-bold">Username / NIP</th>
              <th className="px-6 py-4 font-bold">Role</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 text-right font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{u.full_name}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <UserCircle className="h-4 w-4 text-gray-400" />
                    {u.username || '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-700 font-bold capitalize">
                    <Shield className="h-4 w-4 text-gray-400" />
                    {u.role}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={u.is_active !== false ? 'success' : 'outline'}>
                    {u.is_active !== false ? 'Aktif' : 'Dibekukan'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  {canManageUser(u) && (
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setEditingUser(u)}
                        className="h-8 w-8 p-0 text-[#41A67E] border-[#41A67E]"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => setDeleteId(u.id)}
                        disabled={isProcessing}
                        className="h-8 w-8 p-0 bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <AlertCircle className="h-10 w-10 text-gray-300" />
                    <span className="font-medium">Tidak ada user ditemukan</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Tambah User Baru"
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
          title="Edit Data User"
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
        title="Hapus User"
        description="Yakin ingin menghapus user ini secara permanen? Akun yang dihapus tidak dapat dipulihkan."
        confirmLabel="Hapus Permanen"
        variant="destructive"
        isProcessing={isProcessing}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}