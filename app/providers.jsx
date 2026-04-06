'use client'

import { AuthProvider } from '@/lib/auth/auth-provider'
import { ApplicationsProvider } from '@/lib/applications/context'
import { RBACDebugPanel } from '@/lib/rbac/debug-panel'

export function Providers({
  children,
  initialUser = null,
  initialProfile = null,
  initialAuthResolved = false,
}) {
  const rbacDebug =
    process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_RBAC_DEBUG === '1'

  return (
    <AuthProvider
      initialUser={initialUser}
      initialProfile={initialProfile}
      initialAuthResolved={initialAuthResolved}
    >
      {rbacDebug ? <RBACDebugPanel /> : null}
      <ApplicationsProvider>{children}</ApplicationsProvider>
    </AuthProvider>
  )
}
