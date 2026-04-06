'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthErrorClient() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'An authentication error occurred'
  const message =
    searchParams.get('message') ||
    'Please try again or contact support if the problem persists.'

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Error Card */}
        <div className="bg-card rounded-lg shadow-lg p-8 border border-red-200 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Authentication Error
          </h1>

          {/* Error Details */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-medium text-red-900 mb-1">{error}</p>
            <p className="text-sm text-red-700">{message}</p>
          </div>

          {/* Common Issues */}
          <div className="bg-secondary/50 rounded-lg p-4 border border-border mb-6 text-left">
            <p className="text-sm font-medium text-foreground mb-3">
              Common issues:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Incorrect email or password</li>
              <li>• Email not verified yet</li>
              <li>• Account was disabled</li>
              <li>• Invalid authentication link</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-action hover:bg-action/90 text-action-foreground font-semibold">
                Try Again
              </Button>
            </Link>

            <Link href="/auth/signup" className="block">
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-secondary transition"
              >
                Create New Account
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button
                variant="ghost"
                className="w-full text-action hover:text-action/80 transition flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
          </div>

          {/* Support */}
          <p className="text-xs text-muted-foreground mt-6">
            Need help?{' '}
            <a
              href="mailto:support@fuelhub.com"
              className="text-action hover:text-action/80"
              suppressHydrationWarning
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
