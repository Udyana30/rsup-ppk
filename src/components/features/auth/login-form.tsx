'use client'

import { useState } from 'react'
import { useLogin } from '@/hooks/use-login'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, FileText, Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
  const { handleLogin, isLoading, error } = useLogin()
  
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full max-w-[450px] space-y-8 rounded-2xl bg-white/95 p-10 shadow-2xl backdrop-blur-md ring-1 ring-black/5">
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#41A67E]/10">
          <FileText className="h-7 w-7 text-[#41A67E]" />
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight text-[#41A67E]">
          RSUP NGOERAH
        </h2>
        <p className="mt-2 text-sm font-medium text-gray-500">
          Sistem Manajemen Dokumen PPK
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="space-y-5">
          <div>
            <label 
              htmlFor="email" 
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="nama@rsup.com"
              className="h-11 border-gray-300 bg-gray-50 px-4 text-sm text-gray-800 shadow-sm transition-all placeholder:text-gray-400 focus:border-[#41A67E] focus:bg-white focus:ring-[#41A67E]"
              disabled={isLoading}
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="h-11 border-gray-300 bg-gray-50 pl-4 pr-10 text-sm text-gray-800 shadow-sm transition-all placeholder:text-gray-400 focus:border-[#41A67E] focus:bg-white focus:ring-[#41A67E]"
                disabled={isLoading}
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 flex h-11 w-10 items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="h-11 w-full rounded-xl bg-[#41A67E] text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#368f6b] hover:shadow-lg mb-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            'Masuk ke Dashboard'
          )}
        </Button>
      </form>
    </div>
  )
}