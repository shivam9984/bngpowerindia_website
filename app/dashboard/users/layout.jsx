import { requireRole } from '@/lib/rbac/require-role'

export default async function UsersLayout({ children }) {
  await requireRole(['admin'])
  return children
}
