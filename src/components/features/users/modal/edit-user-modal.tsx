'use client'

import { useState } from 'react'
import { Profile } from '@/types'
import { ProfileForm } from './forms/profile-form'
import { PasswordResetForm } from './forms/password-reset'
import { ChevronDown, LockKeyhole } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditUserModalProps {
  user: Profile
  currentUser: Profile
  onSuccess: () => void
}

export function EditUserModal({ user, currentUser, onSuccess }: EditUserModalProps) {
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <section>
        <ProfileForm 
          user={user} 
          currentUser={currentUser} 
          onSuccess={onSuccess} 
        />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setIsPasswordOpen(!isPasswordOpen)}
          className="flex w-full items-center justify-between bg-gray-50/50 p-4 text-left transition-colors hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
              isPasswordOpen ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-500"
            )}>
              <LockKeyhole className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">Keamanan & Password</span>
              <span className="text-xs font-medium text-gray-500">Klik untuk mereset password user</span>
            </div>
          </div>
          <ChevronDown 
            className={cn(
              "h-5 w-5 text-gray-400 transition-transform duration-200",
              isPasswordOpen && "rotate-180"
            )} 
          />
        </button>

        {isPasswordOpen && (
          <div className="border-t border-gray-200 p-4 animate-in slide-in-from-top-2 fade-in duration-200">
            <PasswordResetForm userId={user.id} />
          </div>
        )}
      </section>
    </div>
  )
}