import { createClient } from '@/lib/supabase/server'
import { documentService } from '@/services/document.service'
import { userService } from '@/services/user.service'
import { StatsCard } from '@/components/features/dashboard/stats-card'
import { RecentDocuments } from '@/components/features/dashboard/recent-documents'
import { RecentUsers } from '@/components/features/dashboard/recent-users'
import { FileText, Users, Clock, Activity } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [documentsRes, usersData, categoriesRes] = await Promise.all([
    documentService.getDocuments(supabase),
    userService.getAllUsers(supabase),
    documentService.getCategories(supabase)
  ])

  const documents = documentsRes.data || []
  const users = usersData || []
  const groups = categoriesRes[0].data || []
  const types = categoriesRes[1].data || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Selamat datang kembali! Berikut ringkasan sistem Anda.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Dokumen"
          value={documents.length}
          trend="Data Terkini"
          trendUp={true}
          icon={FileText}
        />
        <StatsCard
          title="User Aktif"
          value={users.length}
          trend="Data Terkini"
          trendUp={true}
          icon={Users}
        />
        <StatsCard
          title="Kelompok Medis"
          value={groups.length}
          trend="Master Data"
          trendUp={true}
          icon={Activity}
        />
        <StatsCard
          title="Tipe Dokumen"
          value={types.length}
          trend="Master Data"
          trendUp={true}
          icon={Clock}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentDocuments documents={documents} />
        </div>
        <div>
          <RecentUsers users={users} />
        </div>
      </div>
    </div>
  )
}