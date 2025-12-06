'use client'

import { useState } from 'react'
import { Bell, User, LogOut, ChevronDown, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useClickOutside } from '@/hooks/use-click-outside'
import Link from 'next/link'

export function Header() {
  const { user, signOut } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const dropdownRef = useClickOutside<HTMLDivElement>(() => 
    setIsDropdownOpen(false)
  )

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.charAt(0).toUpperCase()
    : 'A'

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
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.user_metadata?.full_name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#41A67E]/10 text-[#41A67E] ring-2 ring-white shadow-sm">
              <span className="font-bold">{userInitials}</span>
            </div>
            
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-6 top-16 z-50 w-56 origin-top-right rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-3 py-2 border-b border-gray-100 mb-2 sm:hidden">
                 <p className="text-sm font-semibold text-gray-900">
                    {user?.user_metadata?.full_name || 'Admin'}
                 </p>
                 <p className="text-xs text-gray-500">Administrator</p>
              </div>

              <Link 
                href="/dashboard/settings"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              
              <Link 
                href="/dashboard/profile"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>

              <div className="my-1 h-px bg-gray-100" />

              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}