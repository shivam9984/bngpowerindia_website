'use server'

import { redirect } from 'next/navigation'
import { getProfileById, updateProfileById } from '@/lib/api/profiles.server'
import { getApiServerClient } from '@/lib/api/server'
import { normalizeProfile } from '@/lib/auth/profile'
import { ensureUserProfile } from '@/lib/auth/profile.server'
import { DEFAULT_PUBLIC_ROLE, toStoredRole } from '@/lib/auth/roles'

/** Normalize to E.164; defaults 10-digit India numbers to +91 */
function normalizePhoneToE164(input) {
  const s = String(input || '')
    .trim()
    .replace(/\s/g, '')
  if (!s) return null
  if (s.startsWith('+')) {
    const d = s.slice(1).replace(/\D/g, '')
    return d ? `+${d}` : null
  }
  const digits = s.replace(/\D/g, '')
  if (digits.length === 10) return `+91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
  if (digits.length >= 10) return `+${digits}`
  return null
}

/** Legacy password signup — all new public users default to the customer role. */
export async function signUpAction(email, password, fullName, role = DEFAULT_PUBLIC_ROLE) {
  const supabase = await getApiServerClient()
  const trimmedEmail = String(email || '').trim().toLowerCase()
  const trimmedName = String(fullName || '').trim()
  const storedRole = toStoredRole(role || DEFAULT_PUBLIC_ROLE)

  const { data, error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      data: {
        full_name: trimmedName,
        role: storedRole,
      },
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  const user = data?.user ?? null
  const identities = Array.isArray(user?.identities) ? user.identities : []

  // Supabase can return a user object without a hard error for duplicate signups
  // when email enumeration protection is enabled. In that case identities is empty
  // and we should not treat the request as a fresh successful registration.
  if (user && identities.length === 0) {
    return {
      success: false,
      error: 'An account with this email already exists. Please sign in or verify your email.',
      errorCode: 'EMAIL_ALREADY_REGISTERED',
    }
  }

  if (user) {
    await ensureUserProfile(user, {
      email: trimmedEmail,
      full_name: trimmedName,
      role: storedRole,
    })
  }

  return { success: true, data }
}

/** Step 1 — sends a one-time code to the email (enable Email OTP in Supabase Auth templates). */
export async function sendSignupEmailOtp(email) {
  const supabase = await getApiServerClient()
  const trimmed = String(email || '').trim()
  if (!trimmed) {
    return { success: false, error: 'Email is required.' }
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: trimmed,
    options: {
      shouldCreateUser: true,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/** Step 2 — verify email OTP; creates a session (cookie). */
export async function verifySignupEmailOtp(email, token) {
  const supabase = await getApiServerClient()
  const trimmedEmail = String(email || '').trim()
  const trimmedToken = String(token || '').trim().replace(/\s/g, '')
  if (!trimmedEmail || !trimmedToken) {
    return { success: false, error: 'Email and verification code are required.' }
  }

  const { error } = await supabase.auth.verifyOtp({
    email: trimmedEmail,
    token: trimmedToken,
    type: 'email',
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/** Step 3 — after email is verified; sends SMS OTP (configure SMS provider in Supabase). */
export async function sendSignupPhoneOtp(phone) {
  const supabase = await getApiServerClient()
  const e164 = normalizePhoneToE164(phone)
  if (!e164) {
    return { success: false, error: 'Enter a valid phone number (10 digits or +country code).' }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Verify your email with the code first.' }
  }

  const { error } = await supabase.auth.updateUser({ phone: e164 })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/** Step 4 — verify SMS code for the phone on file. */
export async function verifySignupPhoneOtp(phone, token) {
  const supabase = await getApiServerClient()
  const e164 = normalizePhoneToE164(phone)
  const trimmedToken = String(token || '').trim().replace(/\s/g, '')
  if (!e164 || !trimmedToken) {
    return { success: false, error: 'Phone and SMS code are required.' }
  }

  const { error } = await supabase.auth.verifyOtp({
    phone: e164,
    token: trimmedToken,
    type: 'sms',
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Final step — set password + applicant profile metadata, end session, redirect to sign-in.
 * Requires an authenticated session with email + phone verified via OTP.
 */
export async function completeApplicantRegistrationAction(fullName, password) {
  const supabase = await getApiServerClient()
  const name = String(fullName || '').trim()
  if (!name) {
    return { success: false, error: 'Full name is required.' }
  }
  if (!password || String(password).length < 8) {
    return { success: false, error: 'Password must be at least 8 characters.' }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Session expired. Open this page again and request a new email code.' }
  }

  if (!user.phone_confirmed_at) {
    return {
      success: false,
      error: 'Please verify your phone number with the SMS code before continuing.',
    }
  }

  const { error: authErr } = await supabase.auth.updateUser({
    password,
    data: {
      full_name: name,
      role: DEFAULT_PUBLIC_ROLE,
    },
  })

  if (authErr) {
    return { success: false, error: authErr.message }
  }

  await ensureUserProfile(user, {
    full_name: name,
    role: DEFAULT_PUBLIC_ROLE,
  })

  await supabase.auth.signOut()
  return { success: true }
}

export async function signInAction(email, password) {
  const supabase = await getApiServerClient()
  const trimmedEmail = String(email || '').trim().toLowerCase()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  })

  if (error) {
    const msg = String(error.message || 'Login failed')
    const normalized = msg.toLowerCase()
    if (
      normalized.includes('email not confirmed') ||
      normalized.includes('not confirmed') ||
      normalized.includes('confirm your email')
    ) {
      return { success: false, error: msg, errorCode: 'EMAIL_NOT_CONFIRMED' }
    }
    return { success: false, error: msg }
  }

  const user = data?.user ?? data?.session?.user ?? null
  if (user) {
    await ensureUserProfile(user)
  }

  return { success: true, data }
}

export async function resendSignupConfirmationEmailAction(email) {
  const supabase = await getApiServerClient()
  const trimmed = String(email || '').trim()
  if (!trimmed) return { success: false, error: 'Email is required.' }

  const emailRedirectTo =
    process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: trimmed,
    options: { emailRedirectTo },
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function signOutAction() {
  const supabase = await getApiServerClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function getUserProfile() {
  const supabase = await getApiServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data: profile } = await getProfileById(user.id)

  if (!profile) {
    return await ensureUserProfile(user)
  }

  return normalizeProfile(profile, user)
}

export async function updateProfileAction(updates) {
  const supabase = await getApiServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data, error } = await updateProfileById(user.id, updates, {
    returnSingle: true,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
