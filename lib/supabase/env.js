function missingKeys(url, anonKey) {
  const missing = []
  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return missing
}

export function getSupabaseAuthRedirectUrl() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_AUTH_REDIRECT_URL ||
    process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`
  )
}

export function requireSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const missing = missingKeys(url, anonKey)
  if (missing.length > 0) {
    throw new Error(
      `[supabase] Missing environment variables: ${missing.join(
        ', ',
      )}. Add them to .env.local (development) or your hosting provider's env settings (production).`,
    )
  }

  return { url, anonKey }
}

export function getSupabaseEnvOrNull() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const missing = missingKeys(url, anonKey)
  if (missing.length > 0) return null

  return { url, anonKey }
}
