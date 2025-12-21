import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface StatsCardProps {
  title: string
  value: string | number
  trend?: string
  trendUp?: boolean
  icon: LucideIcon
  className?: string
  href?: string
}

export function StatsCard({ title, value, trend, trendUp, icon: Icon, className, href }: StatsCardProps) {
  const CardContent = (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-3xl font-bold tracking-tight text-gray-900">{value}</h3>
          </div>
          {trend && (
            <div className="flex items-center gap-2 text-xs">
              <span className={cn(
                "font-medium px-2 py-0.5 rounded-full",
                trendUp
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              )}>
                {trend}
              </span>
              <span className="text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#41A67E]/10 text-[#41A67E] transition-colors group-hover:bg-[#41A67E] group-hover:text-white">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href} className="block">{CardContent}</Link>
  }

  return CardContent
}