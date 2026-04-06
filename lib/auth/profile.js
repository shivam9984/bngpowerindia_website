import { toDisplayRole } from './roles'

function getUserMetadata(user) {
  return user?.user_metadata ?? user?.raw_user_meta_data ?? {}
}

export function normalizeProfile(profile, user = null) {
  if (!profile && !user) return null

  const metadata = getUserMetadata(user)
  const email = profile?.email ?? user?.email ?? null
  const fullName = profile?.full_name ?? metadata.full_name ?? metadata.name ?? null
  const rawRole = profile?.role ?? metadata.role ?? null

  return {
    ...(profile ?? {}),
    id: profile?.id ?? user?.id ?? null,
    email,
    full_name: fullName,
    role: toDisplayRole(rawRole),
  }
}
