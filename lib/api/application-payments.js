'use client'

import { getApiClient } from './client'

export async function listApplicationPaymentsByApplicationIds(applicationIds, columns = '*') {
  const ids = [...new Set((applicationIds || []).filter(Boolean))]
  if (!ids.length) return { data: [], error: null }

  const supabase = getApiClient()
  const { data, error } = await supabase
    .from('application_payments')
    .select(columns)
    .in('application_id', ids)
    .order('created_at', { ascending: false })

  return { data: Array.isArray(data) ? data : [], error }
}

export async function listApplicationPaymentsByApplicationId(applicationId, columns = '*') {
  if (!applicationId) return { data: [], error: null }

  const supabase = getApiClient()
  const { data, error } = await supabase
    .from('application_payments')
    .select(columns)
    .eq('application_id', applicationId)
    .order('created_at', { ascending: false })

  return { data: Array.isArray(data) ? data : [], error }
}

export async function createApplicationPayment(payload, options = {}) {
  const supabase = getApiClient()
  let query = supabase.from('application_payments').insert(payload)

  if (options.returnSingle) {
    query = query.select(options.columns || '*').single()
  }

  const { data, error } = await query
  return { data: data ?? null, error }
}

export async function updateApplicationPaymentById(paymentId, payload, options = {}) {
  if (!paymentId) return { data: null, error: null }

  const supabase = getApiClient()
  let query = supabase
    .from('application_payments')
    .update(payload)
    .eq('id', paymentId)

  if (options.returnSingle) {
    query = query.select(options.columns || '*').single()
  }

  const { data, error } = await query
  return { data: data ?? null, error }
}

export async function deleteApplicationPaymentById(paymentId) {
  if (!paymentId) return { data: null, error: null }

  const supabase = getApiClient()
  const { data, error } = await supabase
    .from('application_payments')
    .delete()
    .eq('id', paymentId)

  return { data: data ?? null, error }
}
