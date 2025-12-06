'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { MENU_ITEMS } from '@/constants/menu'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-20 items-center gap-3 border-b px-6">
        <div className="relative h-8 w-8 shrink-0">
          <Image 
            src="/logo.svg" 
            alt="Logo RSUP" 
            fill
            className="object-contain"
          />
        </div>
        <span className="text-lg font-bold text-[#41A67E] leading-tight">
          RSUP Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive 
                  ? 'bg-[#41A67E]/10 text-[#41A67E]' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {Icon && <Icon className={cn("h-5 w-5", isActive ? "text-[#41A67E]" : "text-gray-400")} />}
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}