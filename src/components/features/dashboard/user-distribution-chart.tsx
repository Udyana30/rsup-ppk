'use client'

import { useMemo } from 'react'
import { Profile } from '@/types'

interface UserDistributionChartProps {
    users: Profile[]
}

export function UserDistributionChart({ users }: UserDistributionChartProps) {
    const chartData = useMemo(() => {
        const adminCount = users.filter(u => u.role === 'admin').length
        const userCount = users.filter(u => u.role === 'user').length
        const total = users.length

        const adminPercentage = total > 0 ? (adminCount / total) * 100 : 0
        const userPercentage = total > 0 ? (userCount / total) * 100 : 0

        const radius = 40
        const circumference = 2 * Math.PI * radius

        const adminStroke = (adminPercentage / 100) * circumference
        const userStroke = (userPercentage / 100) * circumference

        return {
            admin: adminCount,
            user: userCount,
            total,
            adminPercentage,
            userPercentage,
            circumference,
            adminStroke,
            userStroke
        }
    }, [users])

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col h-[280px] transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-2 shrink-0">
                <h3 className="font-semibold text-gray-900 text-sm">Role Pengguna</h3>
            </div>

            <div className="flex-1 flex items-center justify-center gap-8">
                <div className="relative h-50 w-50 flex items-center justify-center group">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                        <circle
                            className="text-gray-100"
                            strokeWidth="12"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                        />

                        <circle
                            className="text-blue-500 transition-all duration-1000 ease-out group-hover:opacity-90"
                            strokeWidth="12"
                            strokeDasharray={`${chartData.userStroke} ${chartData.circumference}`}
                            strokeDashoffset={-chartData.adminStroke}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                        />

                        <circle
                            className="text-[#41A67E] transition-all duration-1000 ease-out group-hover:opacity-90"
                            strokeWidth="12"
                            strokeDasharray={`${chartData.adminStroke} ${chartData.circumference}`}
                            strokeDashoffset="0"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                        />
                    </svg>

                    {/* Center Text */}
                    <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-gray-900">{chartData.total}</span>
                        <span className="text-[10px] text-gray-500 font-medium">Total User</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 group/item cursor-pointer">
                        <div className="h-3 w-3 rounded-full bg-[#41A67E] group-hover/item:scale-110 transition-transform" />
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-700">Admin</span>
                            <span className="text-[10px] text-gray-500">{chartData.admin} ({Math.round(chartData.adminPercentage)}%)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 group/item cursor-pointer">
                        <div className="h-3 w-3 rounded-full bg-blue-500 group-hover/item:scale-110 transition-transform" />
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-700">User</span>
                            <span className="text-[10px] text-gray-500">{chartData.user} ({Math.round(chartData.userPercentage)}%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
