'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalCount: number
    pageSize: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export function Pagination({
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    hasNextPage,
    hasPreviousPage,
}: PaginationProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const navigateToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', String(page))
        router.push(`?${params.toString()}`)
    }

    const getPageNumbers = (): (number | 'ellipsis')[] => {
        const pages: (number | 'ellipsis')[] = []
        const maxVisible = 7

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1)

            if (currentPage <= 3) {
                for (let i = 2; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push('ellipsis')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push('ellipsis')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push('ellipsis')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push('ellipsis')
                pages.push(totalPages)
            }
        }

        return pages
    }

    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalCount)

    if (totalCount === 0 || totalPages <= 1) {
        return null
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
            {/* Info: Showing X-Y of Z */}
            <div className="text-sm text-gray-600">
                Menampilkan <span className="font-medium text-gray-900">{startItem}</span> -{' '}
                <span className="font-medium text-gray-900">{endItem}</span> dari{' '}
                <span className="font-medium text-gray-900">{totalCount}</span> data
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
                {/* First Page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToPage(1)}
                    disabled={!hasPreviousPage}
                    className="h-9 w-9 p-0 border-2 border-gray-300 hover:border-[#41A67E] hover:bg-gray-50"
                    aria-label="Halaman pertama"
                >
                    <ChevronsLeft className="h-4 w-4 text-gray-500" />
                </Button>

                {/* Previous Page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToPage(currentPage - 1)}
                    disabled={!hasPreviousPage}
                    className="h-9 w-9 p-0 border-2 border-gray-300 hover:border-[#41A67E] hover:bg-gray-50"
                    aria-label="Halaman sebelumnya"
                >
                    <ChevronLeft className="h-4 w-4 text-gray-500" />
                </Button>

                {/* Page Numbers */}
                <div className="hidden sm:flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                        if (page === 'ellipsis') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="flex h-9 w-9 items-center justify-center text-gray-400"
                                >
                                    ...
                                </span>
                            )
                        }

                        return (
                            <Button
                                key={page}
                                variant={page === currentPage ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => navigateToPage(page)}
                                className={cn(
                                    'h-9 w-9 p-0 font-semibold transition-all',
                                    page === currentPage
                                        ? 'bg-[#41A67E] hover:bg-[#368f6b] text-white border-2 border-[#41A67E] shadow'
                                        : 'bg-white hover:bg-gray-50 text-gray-500 border-2 border-gray-300 hover:border-[#41A67E]'
                                )}
                                aria-label={`Halaman ${page}`}
                                aria-current={page === currentPage ? 'page' : undefined}
                            >
                                {page}
                            </Button>
                        )
                    })}
                </div>

                {/* Mobile: Current Page Indicator */}
                <div className="flex sm:hidden items-center justify-center min-w-[80px]">
                    <span className="text-sm font-medium text-gray-700">
                        {currentPage} / {totalPages}
                    </span>
                </div>

                {/* Next Page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToPage(currentPage + 1)}
                    disabled={!hasNextPage}
                    className="h-9 w-9 p-0 border-2 border-gray-300 hover:border-[#41A67E] hover:bg-gray-50"
                    aria-label="Halaman selanjutnya"
                >
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                </Button>

                {/* Last Page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToPage(totalPages)}
                    disabled={!hasNextPage}
                    className="h-9 w-9 p-0 border-2 border-gray-300 hover:border-[#41A67E] hover:bg-gray-50"
                    aria-label="Halaman terakhir"
                >
                    <ChevronsRight className="h-4 w-4 text-gray-500" />
                </Button>
            </div>
        </div>
    )
}
