'use client'

import { getApiClient } from './client'

const INSERT_TIMEOUT_MS = 15000

function buildTimeoutError(message) {
  return {
    message,
    code: 'TIMEOUT',
    details: null,
    hint: null,
  }
}

async function withTimeout(promise, timeoutMs, errorMessage, onTimeout) {
  let timeoutId

  try {
    return await Promise.race([
      promise,
      new Promise((resolve) => {
        timeoutId = window.setTimeout(() => {
          onTimeout?.()
          resolve({ data: null, error: buildTimeoutError(errorMessage) })
        }, timeoutMs)
      }),
    ])
  } finally {
    if (timeoutId) {
      window.clearTimeout(timeoutId)
    }
  }
}

export async function listApplications(columns = '*') {
  const supabase = getApiClient()
  const { data, error } = await supabase
    .from('applications')
    .select(columns)
    .order('created_at', { ascending: false })

  return { data: Array.isArray(data) ? data : [], error }
}

export async function listApplicationsByApplicantUserId(applicantUserId, columns = '*') {
  if (!applicantUserId) return { data: [], error: null }

  const supabase = getApiClient()
  const { data, error } = await supabase
    .from('applications')
    .select(columns)
    .eq('applicant_user_id', applicantUserId)
    .order('created_at', { ascending: false })

  return { data: Array.isArray(data) ? data : [], error }
}

export async function getApplicationById(applicationId, columns = '*') {
  if (!applicationId) return { data: null, error: null }

  const supabase = getApiClient()
  const { data, error } = await supabase
    .from('applications')
    .select(columns)
    .eq('id', applicationId)
    .single()

  return { data: data ?? null, error }
}

export async function createApplication(payload, options = {}) {
  const supabase = getApiClient()

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  let query = supabase.from('applications').insert(payload).select()

  if (options.returnSingle) {
    query = query.select(options.columns || '*').single()
  }

  const result = await withTimeout(
    query,
    INSERT_TIMEOUT_MS,
    'Application insert timed out.',
  )

  return result
}

export async function updateApplicationById(applicationId, payload, options = {}) {
  if (!applicationId) return { data: null, error: null }

  const supabase = getApiClient()
  let query = supabase
    .from('applications')
    .update(payload)
    .eq('id', applicationId)

  if (options.returnSingle) {
    query = query.select(options.columns || '*').single()
  }

  const { data, error } = await query
  return { data: data ?? null, error }
}

export async function updateApplicationStatus(applicationId, status, options = {}) {
  return await updateApplicationById(applicationId, { status }, options)
}

export async function setApplicationReview(applicationId, { reviewedBy, reviewedAt }, options = {}) {
  return await updateApplicationById(
    applicationId,
    {
      reviewed_by: reviewedBy ?? null,
      reviewed_at: reviewedAt ?? null,
    },
    options,
  )
}

export async function deleteApplicationById(applicationId) {
  if (!applicationId) return { data: null, error: null }

  const supabase = getApiClient()
  const { data, error } = await supabase
    .from('applications')
    .delete()
    .eq('id', applicationId)

  return { data: data ?? null, error }
}
