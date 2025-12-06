import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.jpg"
          alt="RSUP Background"
          fill
          priority
          className="object-cover blur-[6px] scale-105 brightness-75"
        />
      </div>
      <div className="relative z-10 flex w-full justify-center px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}