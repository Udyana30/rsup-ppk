'use client'

import { Pencil, Trash2, File, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MedicalStaffGroup, PpkType } from '@/types'

type MasterData = MedicalStaffGroup | PpkType

interface MasterDataCardsProps {
    data: MasterData[]
    onEdit: (item: MasterData) => void
    onDelete: (id: string) => void
    isProcessing?: boolean
    isAdmin: boolean
}

export function MasterDataCards({
    data,
    onEdit,
    onDelete,
    isProcessing,
    isAdmin
}: MasterDataCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => (
                <div
                    key={item.id}
                    className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200"
                >
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            {'description' in item ? <Users className="h-6 w-6" /> : <File className="h-6 w-6" />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                                {item.name}
                            </h3>

                            {'description' in item && (
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                    {item.description || 'Tidak ada deskripsi'}
                                </p>
                            )}

                            <p className="text-xs text-gray-500">
                                Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEdit(item)}
                                className="flex-1 h-9 text-[#41A67E] border-[#41A67E]/30 hover:bg-[#41A67E]/5 hover:border-[#41A67E]"
                            >
                                <Pencil className="h-3.5 w-3.5 mr-2" />
                                Edit
                            </Button>

                            <Button
                                size="sm"
                                variant="destructive"
                                disabled={isProcessing}
                                onClick={() => onDelete(item.id)}
                                className="flex-1 h-9 bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200"
                            >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                Hapus
                            </Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
