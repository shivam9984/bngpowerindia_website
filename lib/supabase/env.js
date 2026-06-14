function missingKeys(url, anonKey) {
  const missing = []
  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return missing
}

export function getSupabaseAuthRedirectUrl() {
  const appUrl = getAppUrl()

  return `${appUrl.replace(/\/$/, '')}/auth/callback`
}

export function getAppUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!appUrl) {
    throw new Error(
      '[supabase] Missing environment variable: NEXT_PUBLIC_APP_URL. Set it to your app origin, for example https://your-domain.vercel.app.',
    )
  }

  return appUrl
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
