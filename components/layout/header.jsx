'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Menu, X, LogOut, LayoutDashboard, User, ChevronDown } from 'lucide-react'
import { useAuth } from '@/lib/auth/use-auth'
import { useRBAC } from '@/lib/rbac/use-rbac'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false)
  const { loading, isAuthenticated, email } = useRBAC()
  const { profile, signOut } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  const closeMenu = () => {
    setIsOpen(false)
    setMobileUserMenuOpen(false)
  }

  const handleLogout = async () => {
    closeMenu()
    setUserMenuOpen(false)
    await signOut()
    window.location.assign('/')
  }

  const displayName = profile?.full_name || email || 'Account'

  useEffect(() => {
    if (!userMenuOpen) return

    const onPointerDown = (event) => {
      if (!userMenuRef.current) return
      if (!userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setUserMenuOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown, { passive: true })
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [userMenuOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-card flex items-center justify-center">
              <Image
                src="/bng-logo.png"
                alt="BNGPowerIndia logo"
                width={40}
                height={40}
                className="h-full w-full object-contain p-1"
                priority
              />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-base sm:text-lg text-foreground block">
                BNGPowerIndia
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                CBG • Biodiesel • Fuel Station
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-info transition-colors">
              Home
            </Link>
            <Link href="/business" className="text-foreground hover:text-info transition-colors">
              Businesses
            </Link>
            <Link href="/services" className="text-foreground hover:text-info transition-colors">
              Services
            </Link>
            <Link href="/about" className="text-foreground hover:text-info transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-foreground hover:text-info transition-colors">
              Contact
            </Link>
            {!loading && isAuthenticated && (
              <Link
                href="/dashboard"
                className="text-foreground hover:text-info transition-colors inline-flex items-center gap-1.5"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            {!loading && !isAuthenticated && (
              <Link href="/auth/login" className="text-foreground hover:text-info transition-colors font-medium">
                Login
              </Link>
            )}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3 ml-auto flex-nowrap">
            <Link
              href="/contact"
              className="bg-action text-action-foreground hover:bg-action/90 px-6 py-2 rounded-lg font-semibold transition-colors shadow-sm"
            >
              Book Consultation
            </Link>
            {!loading && isAuthenticated && (
              <div ref={userMenuRef} className="relative">
                <div className="group relative">
                  <button
                    type="button"
                    aria-label="Open profile menu"
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-border bg-card text-foreground hover:bg-secondary transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </button>

                  <div className="pointer-events-none opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition absolute right-0 mt-2">
                    <div className="rounded-md border border-border bg-card px-3 py-1.5 shadow-md">
                      <p className="text-xs text-foreground font-medium max-w-[220px] truncate" title={displayName}>
                        {displayName}
                      </p>
                    </div>
                  </div>
                </div>

                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-card shadow-lg overflow-hidden z-50"
                  >
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
                      role="menuitem"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        setUserMenuOpen(false)
                        await handleLogout()
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-secondary transition-colors"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-4">
            <Link href="/" className="text-foreground hover:text-info transition-colors" onClick={closeMenu}>
              Home
            </Link>
            <Link href="/business" className="text-foreground hover:text-info transition-colors" onClick={closeMenu}>
              Businesses
            </Link>
            <Link href="/services" className="text-foreground hover:text-info transition-colors" onClick={closeMenu}>
              Services
            </Link>
            <Link href="/about" className="text-foreground hover:text-info transition-colors" onClick={closeMenu}>
              About
            </Link>
            <Link href="/contact" className="text-foreground hover:text-info transition-colors" onClick={closeMenu}>
              Contact
            </Link>
            {!loading && isAuthenticated && (
              <Link
                href="/dashboard"
                className="text-foreground hover:text-info transition-colors inline-flex items-center gap-2"
                onClick={closeMenu}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            {!loading && isAuthenticated && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setMobileUserMenuOpen((v) => !v)}
                  className="inline-flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-left text-foreground"
                  aria-expanded={mobileUserMenuOpen}
                  aria-label="Open account menu"
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background">
                      <User className="h-4 w-4" />
                    </span>
                    <span className="truncate font-medium">{displayName}</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileUserMenuOpen ? (
                  <div className="ml-3 flex flex-col gap-3 border-l border-border pl-4">
                    <Link
                      href="/dashboard/profile"
                      className="text-foreground hover:text-info transition-colors font-medium"
                      onClick={closeMenu}
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-left inline-flex items-center gap-2 text-red-600 font-semibold"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                ) : null}
              </div>
            )}
            {!loading && !isAuthenticated && (
              <Link
                href="/auth/login"
                className="text-foreground hover:text-info transition-colors font-medium"
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
            <Link
              href="/contact"
              className="bg-action text-action-foreground hover:bg-action/90 px-6 py-2 rounded-lg font-semibold transition-colors text-center shadow-sm"
              onClick={closeMenu}
            >
              Book Consultation
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
