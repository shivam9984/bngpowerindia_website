'use client'

import { useAuth } from '@/lib/auth/use-auth'
import { Users, Settings, TrendingUp, Shield, AlertCircle, BarChart3 } from 'lucide-react'

export default function AdminDashboard() {
  const { profile } = useAuth()

  const stats = [
    {
      label: 'Total Users',
      value: '248',
      icon: <Users className="w-6 h-6" />,
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Revenue',
      value: '$856,200',
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-green-100',
    },
    {
      label: 'System Health',
      value: '99.8%',
      icon: <Shield className="w-6 h-6" />,
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Active Issues',
      value: '2',
      icon: <AlertCircle className="w-6 h-6" />,
      bgColor: 'bg-red-100',
    },
  ]

  return (
    <div className="p-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Full system control and user management
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

      {/* Admin Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Management */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">User Management</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-action text-action-foreground rounded-lg hover:bg-action/90 transition font-medium">
              Manage Users
            </button>
            <button className="w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition font-medium">
              User Roles & Permissions
            </button>
            <button className="w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition font-medium">
              Pending Approvals
            </button>
          </div>
        </div>

        {/* System Management */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">System</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-action text-action-foreground rounded-lg hover:bg-action/90 transition font-medium">
              View Reports
            </button>
            <button className="w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition font-medium">
              System Settings
            </button>
            <button className="w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-secondary transition font-medium">
              Audit Logs
            </button>
          </div>
        </div>
      </div>

      {/* User Overview */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">User Distribution by Role</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-secondary/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-action">48</p>
            <p className="text-sm text-muted-foreground">Admins</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-action">52</p>
            <p className="text-sm text-muted-foreground">Managers</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-action">68</p>
            <p className="text-sm text-muted-foreground">Salespersons</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-action">80</p>
            <p className="text-sm text-muted-foreground">Customers</p>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Registrations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-border hover:bg-secondary/30 transition">
                  <td className="px-4 py-3 text-foreground">User {i}</td>
                  <td className="px-4 py-3 text-foreground">user{i}@example.com</td>
                  <td className="px-4 py-3 text-foreground capitalize">
                    {['customer', 'salesperson', 'manager'][i - 1]}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-action hover:text-action/80 transition text-sm font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
