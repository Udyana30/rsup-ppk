'use client'

import { useState } from 'react'
import { Profile } from '@/types'
import { useProfileActions } from '@/hooks/users/use-profile-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Loader2, Save } from 'lucide-react'
import { AlertDialog } from '@/components/ui/alert-dialog'

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { updateProfileInfo, isProcessing } = useProfileActions()

  const [fullName, setFullName] = useState(profile.full_name || '')
  const [username, setUsername] = useState(profile.username || '')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmDialog(true)
  }

  const confirmUpdate = async () => {
    await updateProfileInfo(profile.id, { fullName, username })
    setShowConfirmDialog(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10 h-11 text-gray-900 bg-white"
                placeholder="Nama Lengkap Anda"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 flex h-5 w-5 items-center justify-center font-bold text-gray-400">@</span>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 h-11 text-gray-900 bg-white"
                placeholder="Username"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isProcessing}
            className="bg-[#41A67E] hover:bg-[#368f6b] text-white font-bold min-w-[140px]"
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Simpan Profil
          </Button>
        </div>
      </form>

      <AlertDialog
        isOpen={showConfirmDialog}
        title="Simpan Perubahan"
        description="Apakah Anda yakin ingin menyimpan perubahan pada profil Anda?"
        confirmLabel="Simpan"
        cancelLabel="Batal"
        isProcessing={isProcessing}
        onConfirm={confirmUpdate}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </>
  )
}