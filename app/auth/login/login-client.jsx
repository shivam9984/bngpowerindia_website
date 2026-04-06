'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { resendSignupConfirmationEmailAction, signInAction } from '@/app/api/auth/auth-actions'
import { useAuth } from '@/lib/auth/use-auth'
import { GuestGuard } from '@/lib/rbac/guards'

export default function LoginClient() {
  const { syncSession } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registeredNotice, setRegisteredNotice] = useState(false)
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false)
  const [resendBusy, setResendBusy] = useState(false)
  const [resendNotice, setResendNotice] = useState('')

  useEffect(() => {
    setRegisteredNotice(new URLSearchParams(window.location.search).get('registered') === '1')
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setResendNotice('')
    setNeedsEmailVerification(false)
    setLoading(true)
    const emailValue = String(email || '').trim().toLowerCase()

    try {
      const result = await signInAction(emailValue, password)

      if (!result.success) {
        if (result.errorCode === 'EMAIL_NOT_CONFIRMED') {
          setNeedsEmailVerification(true)
        }
        setError(result.error || 'Login failed')
      } else {
        const next = new URLSearchParams(window.location.search).get('next') || '/dashboard'
        await syncSession()
        window.location.assign(next)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setResendNotice('')
    setResendBusy(true)
    try {
      const response = await resendSignupConfirmationEmailAction(email)
      if (!response.success) {
        setError(response.error || 'Could not resend verification email.')
        return
      }
      setResendNotice('Verification email sent. Check your inbox (and spam) for the confirmation link.')
    } catch {
      setError('Could not resend verification email.')
    } finally {
      setResendBusy(false)
    }
  }

  return (
    <GuestGuard redirectTo="/dashboard">
      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6">
        <LoadingOverlay open={loading} variant="page" message="Signing you in" />
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

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="relative mx-auto mb-5 h-[5.25rem] w-[16rem] sm:h-[6rem] sm:w-[18.5rem]">
              <Image
                src="/bng-brand-logo.png"
                alt=""
                aria-hidden
                fill
                className="object-contain object-center [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.85))_drop-shadow(0_4px_20px_rgba(0,0,0,0.5))_drop-shadow(0_0_28px_rgba(255,255,255,0.12))]"
                sizes="(max-width: 640px) 256px, 296px"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
              BNGPowerIndia
            </h1>
            <p className="mt-2 text-sm text-emerald-100/90 sm:text-base">Sign in to your account</p>
            <p className="mt-1 text-xs text-emerald-200/75 sm:text-sm">CBG · Biodiesel · Clean fuel solutions</p>
          </div>

          <div className="relative rounded-xl border border-white/20 bg-card/95 p-8 shadow-2xl shadow-black/20 backdrop-blur-md">
            <LoadingOverlay open={resendBusy && !loading} message="Sending verification email" />
            {registeredNotice ? (
              <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                Registration complete. Sign in with your email and password.
              </div>
            ) : null}
            {resendNotice ? (
              <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                {resendNotice}
              </div>
            ) : null}
            {error ? (
              <div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : null}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                  Email Address
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
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-action transition hover:text-action/80"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    disabled={loading}
                    className="pl-10"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-action py-2 font-semibold text-action-foreground transition hover:bg-action/90"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>

              {needsEmailVerification ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleResend}
                  disabled={loading || resendBusy || !email.trim()}
                >
                  {resendBusy ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      Sending verification email...
                    </span>
                  ) : (
                    'Resend verification email'
                  )}
                </Button>
              ) : null}
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <p className="text-center text-sm text-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="font-semibold text-action transition hover:text-action/80">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center text-sm text-emerald-100/85">
            <p>By signing in, you agree to our</p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-1">
              <Link href="/terms" className="text-white underline-offset-4 transition hover:text-white hover:underline">
                Terms
              </Link>
              <span className="text-emerald-200/80">•</span>
              <Link href="/privacy" className="text-white underline-offset-4 transition hover:text-white hover:underline">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GuestGuard>
  )
}
