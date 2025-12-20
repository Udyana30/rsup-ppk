'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminUpdateUserProfile } from '@/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Profile } from '@/types'
import { Loader2, Shield, User, CheckCircle2, XCircle, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/contexts/toast-context'

interface ProfileFormProps {
  user: Profile
  currentUser: Profile
  onSuccess: () => void
}

export function ProfileForm({ user, currentUser, onSuccess }: ProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  const [username, setUsername] = useState(user.username || '')
  const [fullName, setFullName] = useState(user.full_name || '')
  const [role, setRole] = useState<'admin' | 'user'>((user.role as 'admin' | 'user') || 'user')
  const [isActive, setIsActive] = useState(user.is_active ?? true)

  const canEditRole = currentUser.is_super_admin === true
  
  // Logic: Admin can edit username of users. 
  // Admin cannot edit username of other admins unless super admin.
  // Super admin can edit everyone.
  const canEditUsername = currentUser.is_super_admin === true || (currentUser.role === 'admin' && user.role === 'user')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await adminUpdateUserProfile(user.id, {
        fullName,
        username,
        role,
        isActive
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: 'Berhasil',
        message: 'Data user berhasil diperbarui',
        type: 'success'
      })
      
      router.refresh()
      onSuccess()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal memperbarui user'
      toast({
        title: 'Gagal',
        message: message,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">Username</label>
        <div className="relative">
          <Input 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!canEditUsername}
            className={cn(
              "pl-11 h-12 border-gray-300 bg-white text-base font-medium text-gray-900 focus:border-[#41A67E] focus:ring-[#41A67E]",
              !canEditUsername && "bg-gray-100 text-gray-500"
            )}
          />
          <UserCircle className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-500" />
        </div>
        {!canEditUsername && (
            <p className="text-xs text-gray-500">Hanya Super Admin yang dapat mengubah username Admin lain.</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">Nama Lengkap</label>
        <div className="relative">
          <Input 
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="pl-11 h-12 border-gray-300 bg-white text-base font-medium text-gray-900 focus:border-[#41A67E] focus:ring-[#41A67E]"
          />
          <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-500" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">Role Akses</label>
        <div className="relative">
          <select
            disabled={!canEditRole}
            className="h-12 w-full appearance-none rounded-md border border-gray-300 bg-white pl-11 px-4 text-base font-medium text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 focus:border-[#41A67E] focus:outline-none focus:ring-1 focus:ring-[#41A67E]"
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'user')} 
          >
            <option value="user">User (Dokter/Staff)</option>
            <option value="admin">Admin</option>
          </select>
          <Shield className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-500" />
        </div>
         {!canEditRole && (
            <p className="text-xs text-gray-500">Hanya Super Admin yang dapat mengubah Role.</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">Status Akun</label>
        <div 
          onClick={() => setIsActive(!isActive)}
          className={cn(
            "flex h-12 w-full cursor-pointer items-center justify-between rounded-lg border px-4 transition-all",
            isActive 
              ? "border-[#41A67E] bg-[#41A67E]/5 text-[#41A67E]" 
              : "border-gray-300 bg-gray-50 text-gray-500"
          )}
        >
          <span className="font-bold text-base">{isActive ? 'Aktif (Bisa Login)' : 'Dibekukan (Tidak Bisa Login)'}</span>
          {isActive ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
        </div>
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 bg-[#41A67E] hover:bg-[#368f6b] text-base font-bold text-white shadow-md"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Simpan Perubahan User'}
        </Button>
      </div>
    </form>
  )
}