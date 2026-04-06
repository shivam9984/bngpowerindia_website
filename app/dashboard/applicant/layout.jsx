import { requireRole } from '@/lib/rbac/require-role'

export default async function ApplicantDashboardLayout({ children }) {
  await requireRole(['customer'])
  return children
}
