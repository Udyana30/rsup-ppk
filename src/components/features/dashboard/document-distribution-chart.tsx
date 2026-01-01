'use client'

import { useState, useMemo } from 'react'
import { PpkDocument, MedicalStaffGroup, PpkType } from '@/types'
import { Circle } from 'lucide-react'

interface DocumentDistributionChartProps {
    documents: PpkDocument[]
    groups: MedicalStaffGroup[]
    types: PpkType[]
}

export function DocumentDistributionChart({ documents, groups, types }: DocumentDistributionChartProps) {
    const [filterBy, setFilterBy] = useState<'group' | 'type'>('group')

    const chartData = useMemo(() => {
        const dataMap = new Map<string, number>()
        let total = 0

        documents.forEach(doc => {
            let key = 'Lainnya'
            if (filterBy === 'group') {
                const group = groups.find(g => g.id === doc.group_id)
                key = group ? group.name : 'Tidak Diketahui'
            } else {
                const type = types.find(t => t.id === doc.type_id)
                key = type ? type.name : 'Tidak Diketahui'
            }

            dataMap.set(key, (dataMap.get(key) || 0) + 1)
            total++
        })

        // Convert to array and sort by value desc
        return Array.from(dataMap.entries())
            .map(([name, value]) => ({ name, value, percentage: (value / total) * 100 }))
            .sort((a, b) => b.value - a.value)
        // Removed slice to allow scrolling for all items
    }, [documents, groups, types, filterBy])

    // Calculate max value for opacity calculation
    const maxValue = Math.max(...chartData.map(d => d.value), 1)

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col h-[280px] transition-all duration-300 hover:shadow-md overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-4 shrink-0">
                <h3 className="font-semibold text-gray-900 text-sm">Distribusi Dokumen</h3>
                <div className="flex bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                    <button
                        onClick={() => setFilterBy('group')}
                        className={`px-2 py-1 text-[10px] font-medium rounded-md transition-all duration-200 ${filterBy === 'group'
                            ? 'bg-white text-[#41A67E] shadow-sm ring-1 ring-gray-100'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        KSM
                    </button>
                    <button
                        onClick={() => setFilterBy('type')}
                        className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all duration-200 ${filterBy === 'type'
                            ? 'bg-white text-[#41A67E] shadow-sm ring-1 ring-gray-100'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Jenis
                    </button>
                </div>
            </div>

            {/* Increased padding x to 6 to make items shorter horizontally */}
            <div className="flex-1 overflow-y-auto px-6 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
                <div className="space-y-2">
                    {chartData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <p className="text-xs">Belum ada data</p>
                        </div>
                    ) : (
                        chartData.map((item, index) => {
                            const ratio = item.value / maxValue
                            const opacity = Math.pow(ratio, 1.5) * 0.85 + 0.15

                            return (
                                <div
                                    key={index}
                                    className="group flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-sm border border-transparent hover:border-gray-100 relative overflow-hidden"
                                    style={{
                                        backgroundColor: `rgba(65, 166, 126, ${opacity * 0.2})`
                                    }}
                                >
                                    <div
                                        className="absolute left-0 top-0 bottom-0 bg-[#41A67E] transition-all duration-500 ease-out"
                                        style={{
                                            width: '3px',
                                            opacity: opacity
                                        }}
                                    />

                                    <div className="flex items-center gap-3 pl-2 min-w-0 flex-1">
                                        <div
                                            className="p-1 rounded-full transition-colors shrink-0"
                                            style={{ backgroundColor: `rgba(65, 166, 126, ${opacity * 0.4})` }}
                                        >
                                            <Circle
                                                className="h-2 w-2"
                                                style={{
                                                    color: '#41A67E',
                                                    fill: '#41A67E',
                                                    opacity: Math.max(opacity, 0.6)
                                                }}
                                            />
                                        </div>
                                        <span className="font-medium text-gray-900 text-xs group-hover:text-[#41A67E] transition-colors truncate">
                                            {item.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 pl-2 shrink-0">
                                        <span className="font-bold text-gray-900 text-xs bg-white/60 px-1.5 py-0.5 rounded-md border border-black/5 min-w-[24px] text-center">
                                            {item.value}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
