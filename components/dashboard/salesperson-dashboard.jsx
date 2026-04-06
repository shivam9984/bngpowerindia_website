'use client'

import { useAuth } from '@/lib/auth/use-auth'
import { Users, FileText, TrendingUp, Target } from 'lucide-react'

export default function SalespersonDashboard() {
  const { profile } = useAuth()

  const stats = [
    {
      label: 'Active Customers',
      value: '24',
      icon: <Users className="w-6 h-6" />,
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Pending Quotes',
      value: '8',
      icon: <FileText className="w-6 h-6" />,
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'This Month Revenue',
      value: '$42,300',
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-green-100',
    },
    {
      label: 'Monthly Target',
      value: '78%',
      icon: <Target className="w-6 h-6" />,
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="p-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Sales Dashboard, {profile?.full_name}
        </h1>
        <p className="text-muted-foreground">
          Manage your customers, quotes, and track your sales performance
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

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-action text-action-foreground rounded-lg hover:bg-action/90 transition font-medium">
              Create New Quote
            </button>
            <button className="w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition font-medium">
              Add New Customer
            </button>
            <button className="w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition font-medium">
              View All Orders
            </button>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Performance This Month</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Revenue Target</span>
                <span className="text-sm font-bold text-action">78%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-action h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Quote Conversion</span>
                <span className="text-sm font-bold text-green-600">65%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Customer Satisfaction</span>
                <span className="text-sm font-bold text-blue-600">92%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
