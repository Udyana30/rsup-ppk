import { LoginForm } from '@/components/features/auth/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - RSUP Admin',
  description: 'Login to access the internal dashboard',
}

export default function LoginPage() {
  return <LoginForm />
}