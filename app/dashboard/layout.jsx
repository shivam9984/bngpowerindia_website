import { redirect } from 'next/navigation'
import { DEV_MOCK_ENABLED } from '@/lib/auth/dev-mock'
import { requireServerUser } from '@/lib/auth/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Dashboard - FuelHub',
  description: 'Manage your fuel business with FuelHub dashboard',
}
// Admin and manager users are redirected to their respective home pages in dashboard/page.jsx, so this layout is only rendered for applicants and is protected by server-side auth check. If user is not authenticated, they will be redirected to /auth/login before this layout or any child page is rendered.
export default async function DashboardLayout({
  children,
}) {
  if (!DEV_MOCK_ENABLED) {
    await requireServerUser('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 min-w-0">{children}</main>
      <Footer />
    </div>
  )
}
