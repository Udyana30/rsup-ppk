'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, User as UserIcon, LogOut, ChevronDown, Settings, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useClickOutside } from '@/hooks/use-click-outside'
import { cn } from '@/lib/utils'

export function Header() {
  const { user, profile, loading, signOut } = useAuth() 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const dropdownRef = useClickOutside<HTMLDivElement>(() => 
    setIsDropdownOpen(false)
  )

  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'Admin User'
  const username = profile?.username || user?.user_metadata?.username || 'user'
  const userInitial = fullName.charAt(0).toUpperCase()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut()
  }

  return (
    <header className="flex h-16 items-center justify-end border-b bg-white px-6 py-3">
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        
        <div className="border-l pl-4" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50 disabled:opacity-50"
            disabled={isLoggingOut || loading}
          >
            {loading ? (
              <div className="hidden text-right sm:block space-y-1.5">
                <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                <div className="ml-auto h-3 w-16 animate-pulse rounded bg-gray-200" />
              </div>
            ) : (
              <div className="hidden text-right sm:block animate-in fade-in duration-300">
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  {fullName}
                </p>
                <p className="text-xs font-medium text-gray-500">
                  @{username}
                </p>
              </div>
            )}
            
            {loading ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#41A67E]/10 text-[#41A67E] ring-2 ring-white shadow-sm border border-[#41A67E]/20">
                <span className="font-bold text-lg">{userInitial}</span>
              </div>
            )}
            
            <ChevronDown 
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform duration-200",
                isDropdownOpen ? "rotate-180" : ""
              )} 
            />
          </button>

          {isDropdownOpen && !loading && (
            <div className="absolute right-6 top-16 z-50 w-56 origin-top-right rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-3 border-b border-gray-100 mb-2 sm:hidden bg-gray-50/50 rounded-t-lg">
                 <p className="text-sm font-bold text-gray-900">
                    {fullName}
                 </p>
                 <p className="text-xs text-gray-500">@{username}</p>
              </div>

              <Link 
                href="/dashboard/settings"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#41A67E] transition-all"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Pengaturan Akun
              </Link>
              
              <Link 
                href="/dashboard/profile"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#41A67E] transition-all"
                onClick={() => setIsDropdownOpen(false)}
              >
                <UserIcon className="h-4 w-4" />
                Profil Saya
              </Link>

              <div className="my-1.5 h-px bg-gray-100" />

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                {isLoggingOut ? 'Keluar...' : 'Keluar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}