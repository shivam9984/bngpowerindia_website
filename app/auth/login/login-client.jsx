'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, CheckCircle2, Loader, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import {
  resendSignupConfirmationEmailAction,
  sendPasswordResetEmailAction,
  signInAction,
  updatePasswordAction,
} from '@/app/api/auth/auth-actions'
import { useAuth } from '@/lib/auth/use-auth'
import { GuestGuard } from '@/lib/rbac/guards'

const VIEW_COPY = {
  login: {
    title: 'BNGPowerIndia',
    subtitle: 'Sign in to your account',
    detail: 'CBG · Biodiesel · Clean fuel solutions',
    loading: 'Signing you in',
  },
  forgot: {
    title: 'Reset your password',
    subtitle: "Enter your email and we'll send a secure reset link.",
    detail: 'CBG · Biodiesel · Clean fuel solutions',
    loading: 'Sending reset email',
  },
  reset: {
    title: 'Create a new password',
    subtitle: 'Use at least 8 characters for your new password.',
    detail: 'CBG · Biodiesel · Clean fuel solutions',
    loading: 'Updating password',
  },
}

function emailIsValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function LoginClient() {
  const { syncSession } = useAuth()
  const [view, setView] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [registeredNotice, setRegisteredNotice] = useState(false)
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false)
  const [resendBusy, setResendBusy] = useState(false)
  const copy = VIEW_COPY[view] || VIEW_COPY.login

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setRegisteredNotice(params.get('registered') === '1')
    if (params.get('mode') === 'reset-password') {
      setView('reset')
    }
  }, [])

  const updateView = (nextView) => {
    setView(nextView)
    setError('')
    setNotice('')
    setPassword('')
    setConfirmPassword('')
    setNeedsEmailVerification(false)
    const nextUrl = nextView === 'login' ? '/auth/login' : `/auth/login?mode=${nextView === 'forgot' ? 'forgot-password' : 'reset-password'}`
    window.history.replaceState(null, '', nextUrl)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
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

  const handleForgotPassword = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')

    const emailValue = String(email || '').trim().toLowerCase()
    if (!emailValue) return setError('Email is required.')
    if (!emailIsValid(emailValue)) return setError('Enter a valid email address.')

    setLoading(true)
    try {
      const response = await sendPasswordResetEmailAction(emailValue)
      if (!response?.success) {
        setError(response?.error || 'Could not send password reset email.')
        return
      }
      setNotice('Password reset email sent. Check your inbox for the secure reset link.')
    } catch {
      setError('Could not send password reset email. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')

    if (String(password || '').length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirmPassword) return setError('Passwords do not match.')

    setLoading(true)
    try {
      const response = await updatePasswordAction(password)
      if (!response?.success) {
        setError(response?.error || 'Could not update your password.')
        return
      }
      setPassword('')
      setConfirmPassword('')
      setNotice('Password updated. You can now sign in with your new password.')
      await syncSession()
    } catch {
      setError('Could not update your password. Try requesting a new reset link.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setNotice('')
    setResendBusy(true)
    try {
      const response = await resendSignupConfirmationEmailAction(email)
      if (!response.success) {
        setError(response.error || 'Could not resend verification email.')
        return
      }
      setNotice('Verification email sent. Check your inbox (and spam) for the confirmation link.')
    } catch {
      setError('Could not resend verification email.')
    } finally {
      setResendBusy(false)
    }
  }

  const content = (
    <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6">
      <LoadingOverlay open={loading} variant="page" message={copy.loading} />
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
            {copy.title}
          </h1>
          <p className="mt-2 text-sm text-emerald-100/90 sm:text-base">{copy.subtitle}</p>
          <p className="mt-1 text-xs text-emerald-200/75 sm:text-sm">{copy.detail}</p>
        </div>

        <div className="relative rounded-xl border border-white/20 bg-card/95 p-8 shadow-2xl shadow-black/20 backdrop-blur-md">
          <LoadingOverlay open={resendBusy && !loading} message="Sending verification email" />
          {registeredNotice && view === 'login' ? (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              Registration complete. Sign in with your email and password.
            </div>
          ) : null}

          {notice ? (
            <div className="mb-6 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
              <p className="text-sm text-emerald-900">{notice}</p>
            </div>
          ) : null}

          {error ? (
            <div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ) : null}

          {view === 'login' ? (
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
                  <button
                    type="button"
                    onClick={() => updateView('forgot')}
                    className="text-sm text-action transition hover:text-action/80"
                  >
                    Forgot?
                  </button>
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
          ) : null}

          {view === 'forgot' ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="resetEmail" className="mb-2 block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="resetEmail"
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-action py-2 font-semibold text-action-foreground transition hover:bg-action/90"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Sending reset link...
                  </span>
                ) : (
                  'Send reset link'
                )}
              </Button>

              <Button type="button" variant="ghost" className="w-full" onClick={() => updateView('login')}>
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Button>
            </form>
          ) : null}

          {view === 'reset' ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-foreground">
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    disabled={loading || !!notice}
                    className="pl-10"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground">
                  Confirm new password
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
                    disabled={loading || !!notice}
                    className="pl-10"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {!notice ? (
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-action py-2 font-semibold text-action-foreground transition hover:bg-action/90"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      Updating password...
                    </span>
                  ) : (
                    'Update password'
                  )}
                </Button>
              ) : null}

              <Button type="button" variant="ghost" className="w-full" onClick={() => updateView('login')}>
                Sign in
              </Button>
            </form>
          ) : null}

          {view === 'login' ? (
            <>
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
            </>
          ) : null}
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
  )

  if (view === 'reset') return content

  return <GuestGuard redirectTo="/dashboard">{content}</GuestGuard>
}
