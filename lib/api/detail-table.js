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

export function createApplicationDetailApi(table) {
  return {
    async listByApplicationIds(applicationIds, columns = '*') {
      const ids = [...new Set((applicationIds || []).filter(Boolean))]
      if (!ids.length) return { data: [], error: null }

      const supabase = getApiClient()
      const { data, error } = await supabase
        .from(table)
        .select(columns)
        .in('application_id', ids)

      return { data: Array.isArray(data) ? data : [], error }
    },

    async getByApplicationId(applicationId, columns = '*') {
      if (!applicationId) return { data: null, error: null }

      const supabase = getApiClient()
      const { data, error } = await supabase
        .from(table)
        .select(columns)
        .eq('application_id', applicationId)
        .single()

      return { data: data ?? null, error }
    },

    async createForApplication(payload, options = {}) {
      const supabase = getApiClient()
      let query = supabase.from(table).insert(payload)

      if (options.returnSingle) {
        query = query.select(options.columns || '*').single()
      }

      const result = await withTimeout(
        query,
        INSERT_TIMEOUT_MS,
        'Application detail insert timed out.',
      )
      return result
    },

    async updateByApplicationId(applicationId, payload, options = {}) {
      if (!applicationId) return { data: null, error: null }

      const supabase = getApiClient()
      let query = supabase
        .from(table)
        .update(payload)
        .eq('application_id', applicationId)

      if (options.returnSingle) {
        query = query.select(options.columns || '*').single()
      }

      const { data, error } = await query
      return { data: data ?? null, error }
    },

    async deleteByApplicationId(applicationId) {
      if (!applicationId) return { data: null, error: null }

      const supabase = getApiClient()
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('application_id', applicationId)

      return { data: data ?? null, error }
    },
  }
}
