'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MENU_ITEMS } from '@/constants/menu'
import { cn } from '@/lib/utils'
import { ChevronDown, PanelLeftClose } from 'lucide-react'
import { SidebarItem } from '@/types'
import { useSidebar } from '@/contexts/sidebar-context'

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <div 
      className={cn(
        "flex h-full flex-col border-r bg-white transition-[width] duration-300 ease-in-out will-change-[width]",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <button 
        onClick={toggleSidebar}
        className={cn(
          "flex h-20 items-center w-full border-b transition-all duration-300 hover:bg-gray-50 focus:outline-none overflow-hidden",
          isCollapsed ? "justify-center px-0" : "justify-between px-6"
        )}
        title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
      >
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 shrink-0">
            <Image 
              src="/logo.svg" 
              alt="Logo RSUP" 
              fill
              className="object-contain"
            />
          </div>
          <div className={cn(
            "flex flex-col items-start overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap",
            isCollapsed ? "w-0 opacity-0 -translate-x-2.5" : "w-auto opacity-100 translate-x-0"
          )}>
            <span className="text-lg font-bold text-[#41A67E]">
              RSUP Admin
            </span>
          </div>
        </div>

        <div className={cn(
          "text-gray-400 hover:text-[#41A67E] transition-all duration-300",
          isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
        )}>
          <PanelLeftClose className="h-5 w-5" />
        </div>
      </button>

      <nav className="flex-1 space-y-2 p-4 overflow-y-auto overflow-x-hidden">
        {MENU_ITEMS.map((item) => (
          <SidebarMenuItem key={item.title} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>
    </div>
  )
}

function SidebarMenuItem({ item, isCollapsed }: { item: SidebarItem, isCollapsed: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === item.href || (item.children && item.children.some(c => pathname === c.href))
  const [isOpen, setIsOpen] = useState(isActive)

  const Icon = item.icon

  if (item.children) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => !isCollapsed && setIsOpen(!isOpen)}
          className={cn(
            'group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 overflow-hidden whitespace-nowrap',
            isActive 
              ? 'bg-[#41A67E]/10 text-[#41A67E]' 
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? item.title : undefined}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-[#41A67E]" : "text-gray-500 group-hover:text-gray-700")} />}
            <span className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            )}>
              {item.title}
            </span>
          </div> 
          
          <ChevronDown 
            className={cn(
              "h-4 w-4 text-gray-400 transition-all duration-300 ease-in-out shrink-0",
              isOpen ? "rotate-180" : "",
              isCollapsed ? "w-0 opacity-0" : "w-4 opacity-100"
            )} 
          />
        </button>
        
        <div className={cn(
          "grid transition-all duration-300 ease-in-out overflow-hidden",
          isOpen && !isCollapsed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}>
          <div className="overflow-hidden">
            <div className="ml-4 space-y-1 border-l border-gray-100 pl-3 pt-1">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    'flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    pathname === child.href
                      ? 'text-[#41A67E] bg-[#41A67E]/5' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  )}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 overflow-hidden whitespace-nowrap',
        isActive 
          ? 'bg-[#41A67E]/10 text-[#41A67E] font-semibold' 
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
        isCollapsed && 'justify-center px-2'
      )}
      title={isCollapsed ? item.title : undefined}
    >
      {Icon && <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-[#41A67E]" : "text-gray-500 group-hover:text-gray-700")} />}
      <span className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden",
        isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
      )}>
        {item.title}
      </span>
    </Link>
  )
}