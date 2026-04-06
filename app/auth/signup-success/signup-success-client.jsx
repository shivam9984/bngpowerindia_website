'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { CheckCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { resendSignupConfirmationEmailAction } from '@/app/api/auth/auth-actions'

export default function SignupSuccessClient({ email }) {
  const safeEmail = useMemo(() => String(email || '').trim(), [email])
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const handleResend = async () => {
    if (!safeEmail) return
    setNotice('')
    setBusy(true)
    try {
      const r = await resendSignupConfirmationEmailAction(safeEmail)
      if (!r.success) {
        setNotice(r.error || 'Could not resend verification email.')
        return
      }
      setNotice('Verification email sent. Please check your inbox (and spam).')
    } catch {
      setNotice('Could not resend verification email.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">Account created</h1>

          <p className="text-foreground mb-6">
            We&apos;ve sent a confirmation link to{safeEmail ? ` ${safeEmail}` : ' your email'}.
          </p>

          <div className="bg-secondary/50 rounded-lg p-4 border border-border mb-6">
            <div className="flex items-center gap-3 text-left">
              <Mail className="w-5 h-5 text-action flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Verify your email</p>
                <p className="text-xs text-muted-foreground">
                  Click the link in your email to verify your account.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            You must verify your email before you can sign in.
          </p>

          <div className="space-y-3">
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-action hover:bg-action/90 text-action-foreground font-semibold">
                Sign In
              </Button>
            </Link>

            <Button
              type="button"
              variant="outline"
              className="w-full border-border text-foreground hover:bg-secondary transition"
              onClick={handleResend}
              disabled={!safeEmail || busy}
            >
              {busy ? 'Sending…' : 'Resend verification email'}
            </Button>

            <Link href="/" className="block">
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-secondary transition"
              >
                Return Home
              </Button>
            </Link>
          </div>

          {notice ? (
            <p className="text-xs text-muted-foreground mt-4">{notice}</p>
          ) : null}

          <p className="text-xs text-muted-foreground mt-6">
            Didn&apos;t receive the email?{' '}
            <a
              href="mailto:support@bngpowerindia.com"
              className="text-action hover:text-action/80"
              suppressHydrationWarning
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
