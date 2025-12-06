import { LayoutDashboard, FileText, Users, Settings } from 'lucide-react'
import { SidebarItem } from '@/types'

export const MENU_ITEMS: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'user'],
  },
  {
    title: 'Dokumen PPK',
    href: '/dashboard/documents',
    icon: FileText,
    roles: ['admin', 'user'],
  },
  {
    title: 'Manajemen User',
    href: '/dashboard/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    title: 'Pengaturan',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['admin', 'user'],
  },
]