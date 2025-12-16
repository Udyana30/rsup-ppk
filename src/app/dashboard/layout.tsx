import { MasterDataProvider } from '@/contexts/master-data-context'
import { SidebarProvider } from '@/contexts/sidebar-context'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out">
          <Header />
          <MasterDataProvider>
            <main className="flex-1 flex flex-col overflow-hidden p-4 md:p-8">
              {children}
            </main>
          </MasterDataProvider>
        </div>
      </div>
    </SidebarProvider>
  )
}