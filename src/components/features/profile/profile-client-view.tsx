'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'
import { ProfileForm } from './profile-form'
import { PasswordForm } from './password-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarClock, ShieldCheck, LogOut } from 'lucide-react'
import { useToast } from '@/contexts/toast-context'
import { AlertDialog } from '@/components/ui/alert-dialog'

interface ProfileClientViewProps {
  profile: Profile
}

export function ProfileClientView({ profile }: ProfileClientViewProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const userInitial = (profile.full_name || 'A').charAt(0).toUpperCase()
  const lastUpdate = new Date(profile.updated_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const confirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()

      toast({
        title: 'Logout Berhasil',
        message: 'Anda telah keluar dari sistem',
        type: 'success'
      })

      router.replace('/login')
    } catch (error) {
      toast({
        title: 'Logout Gagal',
        message: 'Terjadi kesalahan saat logout',
        type: 'error'
      })
      setIsLoggingOut(false)
      setShowLogoutDialog(false)
    }
  }

  return (
    <>
      <div className="h-full overflow-y-auto max-w-5xl mx-auto space-y-8 pb-10 pr-2">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Pengaturan Profil</h1>
            <p className="text-gray-500">Kelola informasi akun dan keamanan login Anda.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          {/* Left Column: Profile Form */}
          <div className="lg:col-span-2 h-full">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
                <div className="h-16 w-16 rounded-full bg-[#41A67E] flex items-center justify-center text-white text-2xl font-bold shadow-md ring-4 ring-[#41A67E]/10">
                  {userInitial}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{profile.full_name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-white text-gray-600 border-gray-300">
                      @{profile.username}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`gap-1 pl-1.5 border-0 ${profile.role?.toLowerCase() === 'admin'
                        ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                        : 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                        }`}
                    >
                      <ShieldCheck className={`h-3 w-3 ${profile.role?.toLowerCase() === 'admin' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      {profile.role}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1">
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900">Informasi Dasar</h3>
                  <p className="text-sm text-gray-500">Perbarui nama dan username akun Anda.</p>
                </div>
                <ProfileForm profile={profile} />
              </div>
            </div>
          </div>

          {/* Right Column: Last Update, Password, Logout */}
          <div className="space-y-6 flex flex-col h-full">
            {/* Last Update Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <CalendarClock className="h-4 w-4" />
                <span className="text-sm font-medium">Terakhir diupdate</span>
              </div>
              <p className="text-sm font-bold text-green-600">
                {lastUpdate}
              </p>
            </div>

            {/* Password Form Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex-1">
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900">Keamanan</h3>
                <p className="text-sm text-gray-500">Ganti password akun secara berkala.</p>
              </div>
              <PasswordForm />
            </div>

            {/* Logout Button */}
            <Button
              variant="outline"
              onClick={handleLogoutClick}
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 justify-end"
            >
              Keluar dari Aplikasi
              <LogOut className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        isOpen={showLogoutDialog}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin keluar dari aplikasi? Anda perlu login kembali untuk mengakses sistem."
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        variant="destructive"
        isProcessing={isLoggingOut}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </>
  )
}