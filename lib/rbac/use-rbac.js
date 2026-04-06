'use client'

import { useMemo } from 'react'
import { useAuth } from '@/lib/auth/use-auth'

export function useRBAC() {
  const { user, profile, loading, error } = useAuth()
  const email = user?.email ?? null
  const role = profile?.role ?? null
  const isAuthenticated = Boolean(user)

  return useMemo(
    () => ({
      email,
      loading,
      error,
      role,
      isAuthenticated,
    }),
    [email, error, isAuthenticated, loading, role],
  )
}
