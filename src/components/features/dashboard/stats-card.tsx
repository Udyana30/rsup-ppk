import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  trend?: string
  trendUp?: boolean
  icon: LucideIcon
  className?: string
}

export function StatsCard({ title, value, trend, trendUp, icon: Icon, className }: StatsCardProps) {
  return (
    <div className={cn("rounded-xl border bg-white p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <Icon className="h-6 w-6 text-gray-700" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          <span className={cn("font-medium", trendUp ? "text-green-600" : "text-red-600")}>
            {trend}
          </span>
          <span className="text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  )
}