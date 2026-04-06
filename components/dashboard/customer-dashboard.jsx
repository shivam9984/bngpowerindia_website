'use client'

import { useAuth } from '@/lib/auth/use-auth'
import { ShoppingCart, FileText, Package, TrendingUp } from 'lucide-react'

export default function CustomerDashboard() {
  const { profile } = useAuth()

  const stats = [
    {
      label: 'Active Orders',
      value: '3',
      icon: <ShoppingCart className="w-6 h-6" />,
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Pending Quotes',
      value: '2',
      icon: <FileText className="w-6 h-6" />,
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Total Spent',
      value: '$12,450',
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-green-100',
    },
    {
      label: 'Favorite Businesses',
      value: '8',
      icon: <Package className="w-6 h-6" />,
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="p-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome, {profile?.full_name}!
        </h1>
        <p className="text-muted-foreground">
          Manage your fuel orders and quotes from your personal dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-lg border border-border p-6 hover:border-action/50 transition"
          >
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}>
              <div className="text-foreground">{stat.icon}</div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-action text-action-foreground rounded-lg hover:bg-action/90 transition font-medium">
              Request Quote
            </button>
            <button className="w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition font-medium">
              Browse Businesses
            </button>
            <button className="w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition font-medium">
              View Invoices
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="pb-4 border-b border-border last:border-b-0">
              <p className="text-sm font-medium text-foreground">Order #12345</p>
              <p className="text-xs text-muted-foreground">Delivered • 2 hours ago</p>
            </div>
            <div className="pb-4 border-b border-border last:border-b-0">
              <p className="text-sm font-medium text-foreground">Quote Approved</p>
              <p className="text-xs text-muted-foreground">Standard Fuel • 1 day ago</p>
            </div>
            <div className="pb-4 border-b border-border last:border-b-0">
              <p className="text-sm font-medium text-foreground">Invoice #INV-001</p>
              <p className="text-xs text-muted-foreground">Paid • 3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
