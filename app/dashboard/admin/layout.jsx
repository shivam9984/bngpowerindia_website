import { requireRole } from '@/lib/rbac/require-role'

export default async function AdminDashboardLayout({ children }) {
  await requireRole(['admin'])
  return children
}
