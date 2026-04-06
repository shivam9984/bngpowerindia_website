'use client'

import { useRBAC } from './use-rbac'

export function RBACDebugPanel() {
  const value = useRBAC()

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-[360px] max-w-[90vw] rounded-lg border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-mono text-muted-foreground">RBAC Debug</p>
        <p className="text-[10px] font-mono text-muted-foreground">
          {value.loading ? 'loading' : value.isAuthenticated ? 'authed' : 'guest'}
        </p>
      </div>
      <pre className="max-h-[220px] overflow-auto text-[11px] leading-4 text-foreground">
        {JSON.stringify(
          {
            email: value.email,
            role: value.role,
            loading: value.loading,
            error: value.error ?? null,
            isAuthenticated: value.isAuthenticated,
          },
          null,
          2,
        )}
      </pre>
    </div>
  )
}
