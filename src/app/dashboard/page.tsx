import { createClient } from '@/lib/supabase/server'
import { documentService } from '@/services/document.service'
import { userService } from '@/services/user.service'
import { masterService } from '@/services/master.service'
import { StatsCard } from '@/components/features/dashboard/stats-card'
import { RecentDocuments } from '@/components/features/dashboard/recent-documents'
import { RecentUsers } from '@/components/features/dashboard/recent-users'
import { FileText, Users, Clock, Activity, Calendar } from 'lucide-react'
import { DocumentDistributionChart } from '@/components/features/dashboard/document-distribution-chart'
import { UserDistributionChart } from '@/components/features/dashboard/user-distribution-chart'

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

  const today = new Date()
  const day = today.getDay()

  const currentDate = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  let motivationText = ""
  if (day === 1 || day === 2) { // Mon, Tue
    motivationText = "Siapkan kopi, mari bekerja!"
  } else if (day === 3 || day === 4) { // Wed, Thu
    motivationText = "Tetap fokus, weekend segera tiba."
  } else if (day === 5) { // Fri
    motivationText = "Tuntaskan hari ini dengan baik."
  } else { // Sat, Sun
    motivationText = "Rehat sejenak itu penting."
  }

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Selamat datang kembali, <span className="font-medium text-gray-900">{currentUser?.full_name || 'Admin'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#41A67E]" />
            <span className="text-sm font-medium text-gray-700">{currentDate}</span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-xs text-gray-500 italic">
            {motivationText}
          </span>
        </div>
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
          title="Kelompok Staf Medis"
          value={groups.length}
          trend="Master Data"
          trendUp={true}
          icon={Activity}
          href="/dashboard/master/groups"
        />
        <StatsCard
          title="Jenis Dokumen"
          value={types.length}
          trend="Master Data"
          trendUp={true}
          icon={Clock}
          href="/dashboard/master/types"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <DocumentDistributionChart documents={documents} groups={groups} types={types} />
          <RecentDocuments documents={documents} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <UserDistributionChart users={users} />
          <RecentUsers users={users} currentUser={currentUser} />
        </div>
      </div>
    </div>
  )
}