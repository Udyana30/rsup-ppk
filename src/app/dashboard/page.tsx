import { createClient } from '@/lib/supabase/server'
import { documentService } from '@/services/document.service'
import { userService } from '@/services/user.service'
import { masterService } from '@/services/master.service'
import { StatsCard } from '@/components/features/dashboard/stats-card'
import { RecentDocuments } from '@/components/features/dashboard/recent-documents'
import { RecentUsers } from '@/components/features/dashboard/recent-users'
import { FileText, Users, Clock, Activity } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()

  const [documentsRes, usersData, groupsRes, typesRes, currentUserRes] = await Promise.all([
    documentService.getDocuments(supabase),
    userService.getAllUsers(supabase),
    masterService.getGroups(supabase),
    masterService.getTypes(supabase),
    authUser ? supabase.from('profiles').select('*').eq('id', authUser.id).single() : Promise.resolve({ data: null, error: null })
  ])

  const documents = documentsRes.data || []
  const users = usersData || []
  const groups = groupsRes.data || []
  const types = typesRes.data || []
  const currentUser = currentUserRes.data

  return (
    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
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
          href="/dashboard/documents"
        />
        <StatsCard
          title="User Aktif"
          value={users.length}
          trend="Data Terkini"
          trendUp={true}
          icon={Users}
          href="/dashboard/users"
        />
        <StatsCard
          title="Kelompok Medis"
          value={groups.length}
          trend="Master Data"
          trendUp={true}
          icon={Activity}
          href="/dashboard/master/groups"
        />
        <StatsCard
          title="Tipe Dokumen"
          value={types.length}
          trend="Master Data"
          trendUp={true}
          icon={Clock}
          href="/dashboard/master/types"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentDocuments documents={documents} />
        </div>
        <div>
          <RecentUsers users={users} currentUser={currentUser} />
        </div>
      </div>
    </div>
  )
}