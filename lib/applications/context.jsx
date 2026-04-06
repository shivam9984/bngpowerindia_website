'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEV_MOCK_ENABLED } from '@/lib/auth/dev-mock'
import { useAuth } from '@/lib/auth/use-auth'
import { fetchApplications } from '@/lib/services/applications'

const ApplicationsContext = createContext({
  applications: [],
  myApplications: [],
  loading: true,
  refreshApplications: async () => [],
  removeApplication: async () => ({ ok: false }),
  clearApplications: async () => ({ ok: false }),
})

export function ApplicationsProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const refreshApplications = useCallback(async () => {
    if (DEV_MOCK_ENABLED) {
      setApplications([])
      setLoading(false)
      return []
    }

    if (!user?.id) {
      setApplications([])
      setLoading(false)
      return []
    }

    setLoading(true)
    try {
      const { data, error } = await fetchApplications()
      if (error) throw error

      const nextApplications = data || []
      setApplications(nextApplications)
      return nextApplications
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (authLoading) return

    refreshApplications().catch(() => {
      setApplications([])
      setLoading(false)
    })
  }, [authLoading, refreshApplications])

  const removeApplication = useCallback(async () => {
    return { ok: false, error: 'Deleting applications is not enabled.' }
  }, [])

  const clearApplications = useCallback(async () => {
    return { ok: false, error: 'Bulk application delete is not enabled.' }
  }, [])

  const myApplications = useMemo(() => {
    if (!user?.id) return []
    return applications.filter((application) => application?.submittedByUserId === user.id)
  }, [applications, user?.id])

  const value = useMemo(
    () => ({
      applications,
      myApplications,
      loading,
      refreshApplications,
      removeApplication,
      clearApplications,
    }),
    [applications, myApplications, loading, refreshApplications, removeApplication, clearApplications],
  )

  return <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>
}

export const useApplications = () => useContext(ApplicationsContext)
