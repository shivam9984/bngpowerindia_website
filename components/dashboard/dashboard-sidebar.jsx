'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  FileText,
  Zap,
  Box,
} from 'lucide-react'
import { useAuth } from '@/lib/auth/use-auth'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['admin', 'manager', 'salesperson', 'applicant', 'customer'],
  },
  {
    label: 'Businesses',
    href: '/business',
    icon: <Box className="w-5 h-5" />,
    roles: ['admin', 'manager', 'salesperson', 'applicant', 'customer'],
  },
  {
    label: 'Quotes',
    href: '/dashboard/quotes',
    icon: <FileText className="w-5 h-5" />,
    roles: ['admin', 'manager', 'salesperson', 'applicant', 'customer'],
  },
  {
    label: 'Apply',
    href: '/dashboard/applicant',
    icon: <Zap className="w-5 h-5" />,
    roles: ['applicant'],
  },
  {
    label: 'Orders',
    href: '/dashboard/orders',
    icon: <ShoppingCart className="w-5 h-5" />,
    roles: ['admin', 'manager', 'salesperson', 'applicant', 'customer'],
  },
  {
    label: 'Customers',
    href: '/dashboard/customers',
    icon: <Users className="w-5 h-5" />,
    roles: ['admin', 'manager', 'salesperson'],
  },
  {
    label: 'Reports',
    href: '/dashboard/reports',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['admin', 'manager', 'salesperson'],
  },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: <Users className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['admin'],
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { profile } = useAuth()

  // Filter nav items based on user role
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (!profile?.role) return false
    return item.roles.includes(profile.role)
  })

  return (
    <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-action text-action-foreground font-semibold'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Info */}
      <div className="px-4 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{profile?.full_name}</span>
        </p>
        <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
      </div>
    </aside>
  )
}
