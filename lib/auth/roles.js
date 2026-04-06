const STORAGE_ROLE_ALIASES = {
  customer: 'customer',
  manager: 'manager',
  admin: 'admin',
}

export const DEFAULT_PUBLIC_ROLE = 'customer'

export function toStoredRole(role) {
  const normalized = String(role || '').trim().toLowerCase()
  return STORAGE_ROLE_ALIASES[normalized] ?? DEFAULT_PUBLIC_ROLE
}

export function toDisplayRole(role) {
  const normalized = String(role || '').trim().toLowerCase()
  if (!normalized) return null
  return normalized
}

export function expandAllowedRoles(roles) {
  const list = Array.isArray(roles) ? roles : [roles]
  const expanded = new Set()

  list.forEach((role) => {
    const normalized = String(role || '').trim().toLowerCase()
    if (!normalized) return

    expanded.add(normalized)
  })

  return [...expanded]
}

export function roleMatches(userRole, allowedRoles) {
  const normalizedUserRole = String(userRole || '').trim().toLowerCase()
  if (!normalizedUserRole) return false
  return expandAllowedRoles(allowedRoles).includes(normalizedUserRole)
}
