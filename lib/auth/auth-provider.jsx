'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import { getProfileById } from '@/lib/api/profiles'
import { DEV_MOCK_ENABLED, getMockProfile, getMockUser } from '@/lib/auth/dev-mock'
import { normalizeProfile } from '@/lib/auth/profile'
import { expandAllowedRoles, roleMatches } from '@/lib/auth/roles'

const AuthContext = createContext(undefined)

export function AuthProvider({
  children,
  initialUser = null,
  initialProfile = null,
  initialAuthResolved = false,
}) {
  const supabase = useMemo(() => createClient(), [])
  const effectiveInitialUser = DEV_MOCK_ENABLED ? getMockUser() : initialUser
  const effectiveInitialProfile = DEV_MOCK_ENABLED ? getMockProfile() : initialProfile
  const hasInitialAuthState = DEV_MOCK_ENABLED || initialAuthResolved

  const [user, setUser] = useState(effectiveInitialUser)
  const [profile, setProfile] = useState(normalizeProfile(effectiveInitialProfile, effectiveInitialUser))
  const [loading, setLoading] = useState(!hasInitialAuthState && !effectiveInitialUser)
  const [error, setError] = useState(null)
  const skipNextProfileLoadRef = useRef(Boolean(effectiveInitialProfile && effectiveInitialUser?.id))

  const refreshProfile = useCallback(async () => {
    if (!user?.id) {
      setProfile(null)
      return null
    }
    const { data } = await getProfileById(user.id)
    const next = normalizeProfile(data, user)
    setProfile(next)
    return next
  }, [user])

  const syncSession = useCallback(async () => {
    if (DEV_MOCK_ENABLED) {
      const nextUser = getMockUser()
      const nextProfile = getMockProfile()
      setUser(nextUser)
      setProfile(nextProfile)
      setLoading(false)
      setError(null)
      return nextUser
    }

    setError(null)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const nextUser = session?.user ?? null
    setUser(nextUser)
    if (!nextUser) {
      setProfile(null)
    }
    setLoading(false)
    return nextUser
  }, [supabase])

  const signOut = useCallback(async () => {
    if (DEV_MOCK_ENABLED) {
      setUser(null)
      setProfile(null)
      setLoading(false)
      setError(null)
      return { error: null }
    }

    setError(null)
    setUser(null)
    setProfile(null)
    setLoading(false)

    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      setError(signOutError.message)
    }

    return { error: signOutError ?? null }
  }, [supabase])

  useEffect(() => {
    let cancelled = false

    async function syncFromSession() {
      setError(null)
      if (DEV_MOCK_ENABLED) {
        setUser(getMockUser())
        setProfile(getMockProfile())
        setLoading(false)
        return
      }

      if (initialAuthResolved) {
        setUser(initialUser)
        setProfile(normalizeProfile(initialProfile, initialUser))
        setLoading(false)
        return
      }

      if (initialUser) {
        setUser(initialUser)
        setProfile(normalizeProfile(initialProfile, initialUser))
        setLoading(false)
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (cancelled) return

      const u = session?.user ?? null
      setUser(u)
      if (!u) {
        setProfile(null)
      }
      if (!cancelled) setLoading(false)
    }

    syncFromSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (DEV_MOCK_ENABLED) return
      const u = session?.user ?? null
      setUser(u)
      setError(null)
      if (!u) {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [initialAuthResolved, initialUser, initialProfile, supabase])

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      if (DEV_MOCK_ENABLED) return

      if (!user?.id) {
        setProfile(null)
        return
      }

      if (
        skipNextProfileLoadRef.current &&
        user.id === effectiveInitialUser?.id
      ) {
        skipNextProfileLoadRef.current = false
        return
      }

      setLoading(true)
      try {
        const { data: profileData } = await getProfileById(user.id)
        if (cancelled) return
        setProfile(normalizeProfile(profileData, user))
        setError(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [effectiveInitialUser?.id, user])

  const isAuthenticated = !!user
  const role = profile?.role ?? null
  const isAdmin = role === 'admin'
  const hasRole = useCallback((nextRole) => roleMatches(profile?.role, nextRole), [profile?.role])
  const hasAnyRole = useCallback(
    (roles) => expandAllowedRoles(roles).some((nextRole) => roleMatches(profile?.role, nextRole)),
    [profile?.role],
  )

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      error,
      refreshProfile,
      syncSession,
      signOut,
      isAuthenticated,
      role,
      isAdmin,
      hasRole,
      hasAnyRole,
    }),
    [user, profile, loading, error, refreshProfile, syncSession, signOut, isAuthenticated, role, isAdmin, hasRole, hasAnyRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
