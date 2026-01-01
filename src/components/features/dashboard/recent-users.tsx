'use client'

import { useState, useRef, useEffect } from 'react'
import { Profile } from '@/types'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useUserActions } from '@/hooks/users/use-user-actions'
import { AlertDialog } from '@/components/ui/alert-dialog'

const Modal = dynamic(() => import('@/components/ui/modal').then(mod => mod.Modal))
const EditUserModal = dynamic(() => import('@/components/features/users/modal/edit-user-modal').then(mod => mod.EditUserModal))

interface RecentUsersProps {
  users: Profile[]
  currentUser: Profile | null
}

export function RecentUsers({ users, currentUser }: RecentUsersProps) {
  const router = useRouter()
  const { deleteUser, isProcessing } = useUserActions()
  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const recentUsers = users.filter(u => u.is_super_admin !== true).slice(0, 7)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
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

  const canManageUser = (targetUser: Profile) => {
    if (!currentUser) return false
    if (currentUser.is_super_admin) return true
    if (currentUser.role === 'admin' && targetUser.role === 'user') return true
    return false
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col h-[400px] transition-all duration-300 hover:shadow-md">
        <div className="flex items-center justify-between pl-6 pt-6 pb-2 shrink-0 border-b border-gray-50">
          <h3 className="font-semibold text-gray-900 text-sm">Pengguna Terbaru</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
          <div className="space-y-2">
            {recentUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-xs">Belum ada user baru</p>
              </div>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-100 hover:shadow-sm relative"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium text-xs group-hover:bg-[#41A67E] group-hover:text-white transition-colors duration-300 shadow-sm">
                    {user.full_name?.charAt(0).toUpperCase() || '?'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate text-xs group-hover:text-[#41A67E] transition-colors" title={user.full_name || ''}>
                      {user.full_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] text-gray-500 truncate max-w-[100px]">
                        {user.username || '-'}
                      </p>
                      <div className={`text-[9px] px-2 py-0.5 rounded-full inline-block border ${user.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                        : 'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    {/* Action Menu */}
                    {canManageUser(user) && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenMenuId(openMenuId === user.id ? null : user.id)
                          }}
                          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {openMenuId === user.id && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-200"
                          >
                            <button
                              onClick={() => {
                                setEditingUser(user)
                                setOpenMenuId(null)
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(user.id)
                                setOpenMenuId(null)
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <Modal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          title="Edit Data Pengguna"
        >
          <EditUserModal
            user={editingUser}
            currentUser={currentUser!}
            onSuccess={() => {
              setEditingUser(null)
              router.refresh()
            }}
          />
        </Modal>
      )}

      {/* Delete Confirmation */}
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
    </>
  )
}