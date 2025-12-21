'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Profile } from '@/types'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useUserActions } from '@/hooks/users/use-user-actions'
import { useClickOutside } from '@/hooks/ui/use-click-outside'
import { AlertDialog } from '@/components/ui/alert-dialog'

const EditUserModal = dynamic(() =>
  import('@/components/features/users/modal/edit-user-modal').then(mod => mod.EditUserModal)
)

const Modal = dynamic(() =>
  import('@/components/ui/modal').then(mod => mod.Modal)
)

interface RecentUsersProps {
  users: Profile[]
  currentUser: Profile | null
}

export function RecentUsers({ users, currentUser }: RecentUsersProps) {
  const router = useRouter()
  const { deleteUser, isProcessing } = useUserActions()

  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [menuState, setMenuState] = useState<{
    id: string
    top: number
    left: number
  } | null>(null)

  const [mounted, setMounted] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  useClickOutside(menuRef, () => setMenuState(null))

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setMenuState(null)
    const handleResize = () => setMenuState(null)

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    const success = await deleteUser(deleteId)
    if (success) {
      setDeleteId(null)
      router.refresh()
    }
  }

  const toggleMenu = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation()
    if (menuState?.id === userId) {
      setMenuState(null)
      return
    }

    const button = e.currentTarget as HTMLButtonElement
    const rect = button.getBoundingClientRect()

    setMenuState({
      id: userId,
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX - 128 // 128px is w-32
    })
  }

  const handleEdit = (e: React.MouseEvent, user: Profile) => {
    e.stopPropagation()
    setEditingUser(user)
    setMenuState(null)
  }

  const handleDelete = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation()
    setDeleteId(userId)
    setMenuState(null)
  }

  const canManageUser = (targetUser: Profile) => {
    if (!currentUser) return false

    // Super admin can manage everyone
    if (currentUser.is_super_admin) return true

    // Regular admin can only manage 'user' role, not other admins
    if (currentUser.role === 'admin') {
      return targetUser.role === 'user'
    }

    return false
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="font-semibold text-gray-900">Users</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 text-gray-500">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.slice(0, 6).map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#41A67E]/10 text-[#41A67E] font-semibold text-xs ring-2 ring-white">
                      {user.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={user.role === 'admin'
                    ? "inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700"
                    : "inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                  }>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {canManageUser(user) && (
                    <button
                      className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={(e) => toggleMenu(e, user.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mounted && menuState && createPortal(
        <div
          ref={menuRef}
          className="absolute z-[9999] w-32 rounded-lg border border-gray-100 bg-white shadow-lg py-1"
          style={{
            top: menuState.top,
            left: menuState.left
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              const user = users.find(u => u.id === menuState.id)
              if (user) handleEdit(e, user)
            }}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={(e) => handleDelete(e, menuState.id)}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </button>
        </div>,
        document.body
      )}

      {editingUser && currentUser && (
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