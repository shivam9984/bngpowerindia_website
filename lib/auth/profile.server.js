import 'server-only'

import { upsertProfile } from '@/lib/api/profiles.server'
import { normalizeProfile } from './profile'
import { toStoredRole } from './roles'

function getUserMetadata(user) {
  return user?.user_metadata ?? user?.raw_user_meta_data ?? {}
}

export async function ensureUserProfile(user, overrides = {}) {
  if (!user?.id) return null

  const normalizedOverrideRole =
    overrides.role == null ? undefined : toStoredRole(overrides.role)
  const metadata = getUserMetadata(user)

  const payload = {
    id: user.id,
    email: overrides.email ?? user.email ?? null,
    full_name: overrides.full_name ?? metadata.full_name ?? metadata.name ?? null,
    role: normalizedOverrideRole ?? toStoredRole(metadata.role),
  }

  if (!payload.email) return null

  const { data, error } = await upsertProfile(payload, { onConflict: 'id' })

  if (error) {
    return null
  }

  return normalizeProfile(data, user)
}
