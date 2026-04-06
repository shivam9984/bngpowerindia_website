import 'server-only'

import { getApiServerClient } from './server'

export async function getProfileById(userId, columns = '*') {
  if (!userId) return { data: null, error: null }

  const supabase = await getApiServerClient()
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

  const supabase = await getApiServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .select(columns)
    .in('id', ids)

  return { data: Array.isArray(data) ? data : [], error }
}

export async function updateProfileById(userId, payload, options = {}) {
  if (!userId) return { data: null, error: null }

  const supabase = await getApiServerClient()
  let query = supabase.from('profiles').update(payload).eq('id', userId)

  if (options.returnSingle) {
    query = query.select(options.columns || '*').single()
  }

  const { data, error } = await query
  return { data: data ?? null, error }
}

export async function upsertProfile(payload, options = { onConflict: 'id' }) {
  const supabase = await getApiServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, options)
    .select('*')
    .single()

  return { data: data ?? null, error }
}
