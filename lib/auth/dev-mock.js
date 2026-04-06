export const DEV_MOCK_ROLE = 'admin'

// Opt-in only. Set `NEXT_PUBLIC_DEV_MOCK_AUTH=1` in `.env.local` when you
// explicitly want local fake auth for UI work.
export const DEV_MOCK_ENABLED =
  process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_DEV_MOCK_AUTH === '1'

export function getMockUser() {
  return {
    id: 'dev-mock-user',
    email: 'admin@dev.local',
  }
}

export function getMockProfile() {
  return {
    id: 'dev-mock-user',
    full_name: 'Dev Admin',
    role: DEV_MOCK_ROLE,
  }
}
