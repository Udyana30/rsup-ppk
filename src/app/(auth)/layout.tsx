import React from 'react'
import { VideoBackground } from '@/components/ui/video-background'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <VideoBackground />
      </div>
      <div className="relative z-10 flex w-full justify-center px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}