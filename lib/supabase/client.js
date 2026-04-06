import { createBrowserClient } from '@supabase/ssr'
import { requireSupabaseEnv } from './env'

let browserClient = null

export function createClient() {
  if (browserClient) {
    return browserClient
  }

  const { url, anonKey } = requireSupabaseEnv()
  browserClient = createBrowserClient(
    url,
    anonKey,
  )

  return browserClient
}
