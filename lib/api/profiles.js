'use client'

import { getApiClient } from './client'

function toNormalizedEmailPath(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function normalizeDocumentType(value) {
  const nextValue = String(value || '')
    .trim()
    .toLowerCase()

  if (nextValue === 'pan') return 'pan'
  if (nextValue === 'aadhaar') return 'aadhaar'
  if (nextValue === 'aadhaar_back') return 'aadhaar_back'
  if (nextValue === 'photo') return 'photo'
  return 'document'
}

export async function getProfileById(userId, columns = '*') {
  if (!userId) return { data: null, error: null }

  const supabase = getApiClient()
  const { data, error } = await supabase
    .from('profiles')
    .select(columns)
    .eq('id', userId)
    .single()

  return { data: data ?? null, error }
}

export async function listProfilesByIds(userIds, columns = '*') {
  const ids = [...new Set((userIds || []).filter(Boolean))]
  if (!ids.length) return { data: [], error: null }

  const supabase = getApiClient()
  const { data, error } = await supabase
    .from('profiles')
    .select(columns)
    .in('id', ids)

  return { data: Array.isArray(data) ? data : [], error }
}

export async function updateProfileById(userId, payload, options = {}) {
  if (!userId) return { data: null, error: null }

  const supabase = getApiClient()
  let query = supabase.from('profiles').update(payload).eq('id', userId)

  if (options.returnSingle) {
    query = query.select(options.columns || '*').single()
  }

  const { data, error } = await query
  return { data: data ?? null, error }
}

export async function uploadProfileDocument({ bucket, user, file, documentType }) {
  if (!file || !user?.id) return { data: null, error: null }

  const supabase = getApiClient()
  const safeEmail = toNormalizedEmailPath(user?.email || user.id)
  const safeDocType = normalizeDocumentType(documentType)
  const path = `${safeEmail}/${safeDocType}/${file.name}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type })

  return { data: error ? null : path, error }
}

export async function createProfileDocumentSignedUrl({ bucket, path, expiresIn }) {
  if (!bucket || !path) return { data: null, error: null }

  const supabase = getApiClient()
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

  return { data: data?.signedUrl ?? null, error }
}
