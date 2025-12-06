import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    success: 'bg-[#41A67E]/10 text-[#41A67E] ring-[#41A67E]/20',
    warning: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
    outline: 'bg-white text-gray-700 ring-gray-200'
  }

  return (
    <span className={cn(
      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}