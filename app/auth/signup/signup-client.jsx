'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader, Lock, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { signUpAction } from '@/app/api/auth/auth-actions'
import { GuestGuard } from '@/lib/rbac/guards'
import { DEFAULT_PUBLIC_ROLE } from '@/lib/auth/roles'

export default function SignupClient() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const name = String(fullName || '').trim()
    const emailValue = String(email || '').trim().toLowerCase()

    if (!name) return setError('Full name is required.')
    if (!emailValue) return setError('Email is required.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) return setError('Enter a valid email address.')
    if (String(password || '').length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirmPassword) return setError('Passwords do not match.')

    setLoading(true)
    try {
      const response = await signUpAction(emailValue, password, name, DEFAULT_PUBLIC_ROLE)
      if (response?.success) {
        router.push(`/auth/signup-success?email=${encodeURIComponent(emailValue)}`)
        return
      }
      if (response?.errorCode === 'EMAIL_ALREADY_REGISTERED') {
        setError('This email is already registered. Please sign in or use another email address.')
      } else {
        setError(response?.error || 'Could not create your account.')
      }
    } catch {
      setError('Could not create your account. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GuestGuard redirectTo="/dashboard">
      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6">
        <LoadingOverlay open={loading} variant="page" message="Creating your account" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/login-biofuel-bg.png')" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-950/75 via-teal-900/55 to-amber-950/65"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-500/10 via-transparent to-transparent"
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-md lg:max-w-2xl">
          <div className="mb-6 text-center">
            <div className="relative mx-auto mb-5 h-[4.5rem] w-[14rem] sm:h-[5rem] sm:w-[16rem]">
              <Image
                src="/bng-brand-logo.png"
                alt=""
                aria-hidden
                fill
                className="object-contain object-center [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.85))_drop-shadow(0_4px_20px_rgba(0,0,0,0.5))]"
                sizes="(max-width: 640px) 224px, 256px"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
              BNGPowerIndia
            </h1>
            <p className="mt-1 text-xs text-emerald-200/75">
              Create your account. We&apos;ll email you a verification link before you can sign in.
            </p>
          </div>

          <div className="rounded-xl border border-white/20 bg-card/95 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-7">
            {error ? (
              <div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-foreground">
                  Full name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                    disabled={loading}
                    className="pl-10"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                  Email address <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={loading}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                  Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    disabled={loading}
                    className="pl-10"
                    autoComplete="new-password"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Minimum 8 characters.</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground">
                  Confirm password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    disabled={loading}
                    className="pl-10"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-action py-2 font-semibold text-action-foreground transition hover:bg-action/90"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    'Create account'
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  We&apos;ll email you a verification link. You must verify before you can sign in.
                </p>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-action transition hover:text-action/80">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GuestGuard>
  )
}
