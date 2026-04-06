'use client'

import { useAuth } from '@/lib/auth/use-auth'
import { Users, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react'

export default function ManagerDashboard() {
  const { profile } = useAuth()

  const stats = [
    {
      label: 'Total Team Members',
      value: '12',
      icon: <Users className="w-6 h-6" />,
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Monthly Orders',
      value: '156',
      icon: <ShoppingCart className="w-6 h-6" />,
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total Revenue',
      value: '$245,600',
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Pending Issues',
      value: '3',
      icon: <AlertCircle className="w-6 h-6" />,
      bgColor: 'bg-red-100',
    },
  ]

  return (
    <div className="p-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Management Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor team performance, orders, and business metrics
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

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Overview */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Team Performance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm font-medium text-foreground">John Smith (Salesperson)</span>
              <span className="text-sm font-bold text-action">95%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm font-medium text-foreground">Sarah Johnson (Salesperson)</span>
              <span className="text-sm font-bold text-action">88%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm font-medium text-foreground">Mike Davis (Salesperson)</span>
              <span className="text-sm font-bold text-action">76%</span>
            </div>
            <button className="w-full mt-4 px-4 py-2 border border-action text-action rounded-lg hover:bg-action/10 transition font-medium text-sm">
              View Full Team Report
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Manager Actions</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-action text-action-foreground rounded-lg hover:bg-action/90 transition font-medium">
              View Reports
            </button>
            <button className="w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition font-medium">
              Approve Quotes
            </button>
            <button className="w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition font-medium">
              Manage Inventory
            </button>
            <button className="w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition font-medium">
              Team Settings
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-6 bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Order ID</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-secondary/30 transition">
                <td className="px-4 py-3 text-foreground">#ORD-001</td>
                <td className="px-4 py-3 text-foreground">Acme Corp</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Delivered
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-foreground font-semibold">$5,200</td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary/30 transition">
                <td className="px-4 py-3 text-foreground">#ORD-002</td>
                <td className="px-4 py-3 text-foreground">Tech Industries</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    Processing
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-foreground font-semibold">$3,850</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
