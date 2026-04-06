'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '@/lib/auth/use-auth'

export default function DashboardHeader() {
  const { profile, isAdmin, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    window.location.assign('/')
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-action flex items-center justify-center">
            <div className="w-4 h-4 rounded bg-action-foreground" />
          </div>
          <span className="font-bold text-foreground hidden sm:inline">FuelHub</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* User Info (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-6 h-6 text-foreground" />
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="p-2 hover:bg-secondary rounded-lg transition"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition border-b border-border"
                >
                  <User className="w-4 h-4 text-action" />
                  <span className="text-sm text-foreground">Profile</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition border-b border-border"
                  >
                    <Settings className="w-4 h-4 text-action" />
                    <span className="text-sm text-foreground">Settings</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition text-left text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
