'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MENU_ITEMS } from '@/constants/menu'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { SidebarItem } from '@/types'

export function Sidebar() {
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
        {MENU_ITEMS.map((item) => (
          <SidebarMenuItem key={item.title} item={item} />
        ))}
      </nav>
    </div>
  )
}

function SidebarMenuItem({ item }: { item: SidebarItem }) {
  const pathname = usePathname()
  const isActive = pathname === item.href || (item.children && item.children.some(c => pathname === c.href))
  const [isOpen, setIsOpen] = useState(isActive)

  const Icon = item.icon

  if (item.children) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
            isActive ? 'text-[#41A67E] bg-[#41A67E]/5' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className={cn("h-5 w-5", isActive ? "text-[#41A67E]" : "text-gray-400")} />}
            {item.title}
          </div> 
        </button>
        
        {isOpen && (
          <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-3">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  'flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                  pathname === child.href
                    ? 'bg-[#41A67E]/10 text-[#41A67E]' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
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
}