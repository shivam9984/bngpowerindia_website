import { requireRole } from '@/lib/rbac/require-role'

export default async function ManagerDashboardLayout({ children }) {
  await requireRole(['manager'])
  return children
}
