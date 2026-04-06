'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

function AppShell({ children }) {
  const pathname = usePathname()
  const isAuthRoute = pathname?.startsWith('/auth')
  const isDashboardRoute = pathname?.startsWith('/dashboard')

  if (isAuthRoute || isDashboardRoute) {
    return children
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 min-w-0">{children}</main>
      <Footer />
    </div>
  )
}

export { AppShell }
