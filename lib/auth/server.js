import 'server-only'

import { redirect } from 'next/navigation'
import { getApiServerClient } from '@/lib/api/server'
import { DEV_MOCK_ENABLED, getMockUser } from './dev-mock'

export async function getServerAuthState() {
  if (DEV_MOCK_ENABLED) {
    return {
      claims: null,
      error: null,
      supabase: null,
      user: getMockUser(),
    }
  }

  const supabase = await getApiServerClient()
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()

  if (claimsError || !claimsData?.claims?.sub) {
    return {
      claims: claimsData?.claims ?? null,
      error: claimsError ?? null,
      supabase,
      user: null,
    }
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  return {
    claims: claimsData.claims ?? null,
    error: userError ?? null,
    supabase,
    user: user ?? null,
  }
}

export async function requireServerUser(redirectTo = '/auth/login') {
  const { user } = await getServerAuthState()

  if (!user) {
    redirect(redirectTo)
  }

  return user
}
