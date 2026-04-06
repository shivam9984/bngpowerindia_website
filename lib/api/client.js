'use client'

import { createClient } from '@/lib/supabase/client'

export function getApiClient() {
  return createClient()
}
