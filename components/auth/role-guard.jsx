'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/use-auth'
import { LoadingOverlay } from '@/components/ui/loading-overlay'

export default function RoleGuard({ allow = [], redirectTo = '/dashboard', children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { loading, isAuthenticated, profile, hasAnyRole } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!isAuthenticated) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`)
      return
    }

    if (allow.length > 0 && !hasAnyRole(allow)) {
      router.replace(redirectTo)
    }
  }, [allow, hasAnyRole, isAuthenticated, loading, pathname, redirectTo, router])

  if (loading || !isAuthenticated) {
    return <LoadingOverlay open variant="page" message="Checking access" />
  }

  if (allow.length > 0 && !hasAnyRole(allow)) {
    return null
  }

  if (!profile?.role) {
    return (
      <div className="p-6">
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <p className="text-muted-foreground">Your account role is not set yet.</p>
        </div>
      </div>
    )
  }

  return children
}
