import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RSUP SANGLAH - PPK Management',
  description: 'Sistem Manajemen Dokumen Panduan Praktik Klinis',
  icons: {
    icon: '/logo.svg',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={cn(inter.className, 'bg-gray-50 text-gray-900 antialiased')}>
        {children}
      </body>
    </html>
  )
}