import { MasterDataProvider } from '@/contexts/master-data-context'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <MasterDataProvider>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </MasterDataProvider>
      </div>
    </div>
  )
}