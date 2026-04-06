'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { roleMatches } from '@/lib/auth/roles'
import { useRBAC } from './use-rbac'

/* ---------- Loading spinner ---------- */
function LoadingScreen() {
  return <LoadingOverlay open variant="page" message="Authenticating" className="bg-stone-950/95" />
}

/* ---------- AuthGuard — redirect to /login if not logged in ---------- */
export function AuthGuard({ children, redirectTo = '/auth/login' }) {
  const { isAuthenticated, loading } = useRBAC()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace(redirectTo)
  }, [isAuthenticated, loading, router, redirectTo])

  if (loading) return <LoadingScreen />
  if (!isAuthenticated) return null
  return <>{children}</>
}

/* ---------- GuestGuard — redirect to /dashboard if already logged in ---------- */
export function GuestGuard({ children, redirectTo = '/dashboard' }) {
  const { isAuthenticated, loading } = useRBAC()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) router.replace(redirectTo)
  }, [isAuthenticated, loading, router, redirectTo])

  // Prevent SSR/CSR hydration mismatches on public pages (e.g. /auth/login) by
  // always rendering the page HTML and only redirecting after hydration.
  return <>{children}</>
}

/* ---------- PermissionGate — show/hide UI when role matches (optional role prop) ---------- */
export function PermissionGate({ children, role, fallback = null }) {
  const { loading, isAuthenticated, role: ctxRole } = useRBAC()

  if (loading || !isAuthenticated) return <>{fallback}</>
  if (role != null && !roleMatches(ctxRole, role)) return <>{fallback}</>

  return <>{children}</>
}

/* ---------- RoleGuard — redirect if role is not in allowed list ---------- */
export function RoleGuard({ children, roles, redirectTo = '/dashboard' }) {
  const { role, loading, isAuthenticated } = useRBAC()
  const router = useRouter()
  const allowed = Array.isArray(roles) ? roles : [roles]
  const rolesKey = JSON.stringify(allowed)

  useEffect(() => {
    if (loading || !isAuthenticated) return
    const list = JSON.parse(rolesKey)
    if (!roleMatches(role, list)) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, loading, redirectTo, role, rolesKey, router])

  if (loading) return <LoadingScreen />
  if (!isAuthenticated) return null
  if (!roleMatches(role, allowed)) return null

  return <>{children}</>
}
