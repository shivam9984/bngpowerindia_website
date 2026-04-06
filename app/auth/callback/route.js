import { getApiServerClient } from '@/lib/api/server'
import { NextResponse } from 'next/server'
import { ensureUserProfile } from '@/lib/auth/profile.server'

export async function GET(request) {
  const { origin, searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = await getApiServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await ensureUserProfile(user)
      }

      return NextResponse.redirect(new URL(next, origin))
    }
  }

  return NextResponse.redirect(new URL('/auth/error?error=Could not authenticate user', origin))
}
