import { LayoutDashboard, FileText, Users, Settings, Database } from 'lucide-react'
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
    title: 'Manajemen Pengguna',
    href: '/dashboard/users',
    icon: Users,
    roles: ['admin'],
  },
  {
    title: 'Manajemen Master Data',
    href: '/dashboard/master',
    icon: Database,
    roles: ['admin'],
    children: [
      {
        title: 'Kelompok Staf Medis',
        href: '/dashboard/master/groups',
        icon: undefined,
        roles: ['admin'],
      },
      {
        title: 'Jenis Dokumen PPK',
        href: '/dashboard/master/types',
        icon: undefined,
        roles: ['admin'],
      },
    ]
  }
]