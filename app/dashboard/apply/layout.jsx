import { requireRole } from '@/lib/rbac/require-role'

export default async function ApplyLayout({ children }) {
  await requireRole(['customer'])
  return children
}
