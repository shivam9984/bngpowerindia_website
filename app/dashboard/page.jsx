import { redirect } from 'next/navigation'
import { getProfileById } from '@/lib/api/profiles.server'
import { DEV_MOCK_ENABLED, getMockProfile } from '@/lib/auth/dev-mock'
import { requireServerUser } from '@/lib/auth/server'

const ROLE_HOME = {
  admin: '/dashboard/admin',
  manager: '/dashboard/manager',
  customer: '/dashboard/applicant',
}

export default async function DashboardPage() {
  if (DEV_MOCK_ENABLED) {
    const role = getMockProfile().role
    const path = ROLE_HOME[role] ?? '/dashboard/applicant'
    redirect(path)
  }

  const user = await requireServerUser('/auth/login')

  const { data: profile } = await getProfileById(user.id, 'role')
  const role = profile?.role
  const path = ROLE_HOME[role] ?? '/dashboard/applicant'
  redirect(path)
}
