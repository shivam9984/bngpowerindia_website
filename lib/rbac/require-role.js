import { redirect } from 'next/navigation'
import { DEV_MOCK_ENABLED, getMockProfile } from '@/lib/auth/dev-mock'
import { getProfileById } from '@/lib/api/profiles.server'
import { ensureUserProfile } from '@/lib/auth/profile.server'
import { requireServerUser } from '@/lib/auth/server'
import { roleMatches } from '@/lib/auth/roles'

export async function requireRole(allowedRoles) {
  const list = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  if (DEV_MOCK_ENABLED) {
    const role = getMockProfile().role
    if (!roleMatches(role, list)) {
      redirect('/dashboard')
    }
    return
  }

  const user = await requireServerUser('/auth/login')

  const { data: profile } = await getProfileById(user.id, 'role')
  const nextProfile = profile ?? (await ensureUserProfile(user))
  const role = nextProfile?.role ?? user.user_metadata?.role ?? null

  if (!roleMatches(role, list)) {
    redirect('/dashboard')
  }
}
