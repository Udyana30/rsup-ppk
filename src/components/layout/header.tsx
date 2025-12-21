'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User as UserIcon, LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/auth/use-auth'
import { useClickOutside } from '@/hooks/ui/use-click-outside'
import { cn } from '@/lib/utils'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { useToast } from '@/contexts/toast-context'
import { createClient } from '@/lib/supabase/client'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const { user, profile, loading } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  useClickOutside(dropdownRef, () => setIsDropdownOpen(false))

  if (pathname === '/dashboard/profile') {
    return null
  }

  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'Admin User'
  const username = profile?.username || user?.user_metadata?.username || 'user'
  const userInitial = fullName.charAt(0).toUpperCase()

  const handleLogoutClick = () => {
    setIsDropdownOpen(false)
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
      <header className="flex h-20 items-center justify-end border-b bg-white px-12 transition-all duration-300">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "group flex items-center gap-4 rounded-xl py-2 pl-4 pr-2 transition-all duration-200 focus:outline-none",
              isDropdownOpen
                ? "bg-[#41A67E]/5 ring-1 ring-[#41A67E]/20"
                : "hover:bg-gray-50"
            )}
            disabled={isLoggingOut || loading}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                <div className="space-y-1.5 text-right hidden sm:block">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="ml-auto h-3 w-16 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex-col items-end text-right hidden sm:block">
                  <p className={cn("text-sm font-bold leading-none mb-1 transition-colors", isDropdownOpen ? "text-[#41A67E]" : "text-gray-900 group-hover:text-gray-900")}>
                    {fullName}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    {profile?.role || 'Admin'}
                  </p>
                </div>

                <div className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full shadow-sm ring-2 transition-all",
                  isDropdownOpen
                    ? "bg-[#41A67E] text-white ring-[#41A67E]/20"
                    : "bg-white text-[#41A67E] ring-gray-100 group-hover:ring-[#41A67E]/20"
                )}>
                  <span className="font-bold text-lg">{userInitial}</span>
                </div>
              </>
            )}
          </button>

          {isDropdownOpen && !loading && (
            <div className="absolute right-0 top-full mt-2 z-50 w-64 origin-top-right rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 mb-2 sm:hidden bg-gray-50 rounded-xl">
                <p className="text-sm font-bold text-gray-900">
                  {fullName}
                </p>
                <p className="text-xs text-gray-500">@{username}</p>
              </div>

              <Link
                href="/dashboard/profile"
                className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-400 group-hover:bg-[#41A67E] group-hover:text-white transition-colors">
                  <UserIcon className="h-4 w-4" />
                </div>
                Profil Saya
              </Link>

              <div className="my-2 h-px bg-gray-100" />

              <button
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-400 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                  {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                </div>
                {isLoggingOut ? 'Keluar...' : 'Keluar'}
              </button>
            </div>
          )}
        </div>
      </header>

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