'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminCreateUser } from '@/actions/auth-admin'
import { Profile } from '@/types'
import { Loader2, UserCircle, User, Shield, CheckCircle, Copy } from 'lucide-react'
import { useToast } from '@/contexts/toast-context'

interface CreateUserModalProps {
  currentUser: Profile
  onSuccess: () => void
}

export function CreateUserModal({ currentUser, onSuccess }: CreateUserModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [tempResult, setTempResult] = useState<{ username: string, pass: string } | null>(null)

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('user')

  const canCreateAdmin = currentUser.is_super_admin === true

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await adminCreateUser({ fullName, username, role })

      if (result.success && result.tempPassword) {
        setTempResult({ username: result.username!, pass: result.tempPassword })
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (tempResult?.pass) {
      navigator.clipboard.writeText(tempResult.pass)
      toast({
        title: 'Disalin!',
        message: 'Password berhasil disalin ke clipboard',
        type: 'success'
      })
    }
  }

  if (tempResult) {
    return (
      <div className="space-y-6 py-4">
        <div className="rounded-xl bg-green-50 p-6 text-center border border-green-200">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-900">User Berhasil Dibuat</h3>
          <p className="text-sm font-medium text-green-800 mt-2">
            User <strong>{tempResult.username}</strong> telah aktif.
          </p>
        </div>

        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Password Sementara</p>
          <div className="mt-2 flex items-center justify-between rounded-md bg-gray-50 p-3 border border-gray-200">
            <code className="text-xl font-mono font-bold text-gray-900 tracking-wider">{tempResult.pass}</code>
            <Button
              size="sm"
              className="bg-gray-400 text-white hover:bg-gray-600 gap-2"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
              Salin Password
            </Button>
          </div>
        </div>

        <Button onClick={onSuccess} className="w-full h-12 bg-[#41A67E] hover:bg-[#368f6b] text-base font-bold text-white">
          Selesai
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">Nama Lengkap</label>
        <div className="relative">
          <Input
            required
            value={fullName}
            onChange={(e) => {
              const val = e.target.value.replace(/[^a-zA-Z\s.]/g, '')
              setFullName(val)
            }}
            placeholder="Dr. Nama Lengkap"
            className="pl-11 h-12 border-gray-300 bg-white text-base font-medium text-gray-900 focus:border-[#41A67E] focus:ring-[#41A67E]"
          />
          <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-500" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">Username</label>
        <div className="relative">
          <Input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
            placeholder="nip12345"
            className="pl-11 h-12 border-gray-300 bg-white text-base font-medium text-gray-900 focus:border-[#41A67E] focus:ring-[#41A67E]"
          />
          <UserCircle className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-500" />
        </div>
        <p className="text-xs text-gray-500">Gunakan NIP atau ID Staff tanpa spasi.</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">Role Akses</label>
        <div className="relative">
          <select
            className="h-12 w-full appearance-none rounded-md border border-gray-300 bg-white pl-11 px-4 text-base font-medium text-gray-900 focus:border-[#41A67E] focus:outline-none focus:ring-1 focus:ring-[#41A67E]"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User (Dokter/Staff)</option>
            {canCreateAdmin && <option value="admin">Admin</option>}
          </select>
          <Shield className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-500" />
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-[#41A67E] hover:bg-[#368f6b] text-base font-bold text-white shadow-md"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Buat User'}
        </Button>
      </div>
    </form>
  )
}