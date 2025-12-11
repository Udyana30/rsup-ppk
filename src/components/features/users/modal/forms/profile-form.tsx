'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { userService } from '@/services/user.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Profile } from '@/types'
import { Loader2, Shield, User, CheckCircle2, XCircle, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileFormProps {
  user: Profile
  currentUser: Profile
  onSuccess: () => void
}

export function ProfileForm({ user, currentUser, onSuccess }: ProfileFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  
  const [fullName, setFullName] = useState(user.full_name || '')
  const [role, setRole] = useState<'admin' | 'user'>((user.role as 'admin' | 'user') || 'user')
  const [isActive, setIsActive] = useState(user.is_active ?? true)

  const canEditRole = currentUser.is_super_admin === true

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await userService.updateUser(supabase, user.id, {
        full_name: fullName,
        role: role,
        is_active: isActive
      })
      router.refresh()
      onSuccess()
    } catch (error) {
      console.error(error)
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
            value={user.username || ''}
            disabled
            className="pl-11 h-12 border-gray-200 bg-gray-100 text-gray-500 font-medium"
          />
          <UserCircle className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
        </div>
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
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Simpan Perubahan Profil'}
        </Button>
      </div>
    </form>
  )
}