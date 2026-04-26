'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Megaphone,
  FileWarning,
  PawPrint,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Camps',
    href: '/dashboard/camps',
    icon: Megaphone,
  },
  {
    label: 'Reports',
    href: '/dashboard/reports',
    icon: FileWarning,
  },
  {
    label: 'Animals',
    href: '/dashboard/animals',
    icon: PawPrint,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    // Clear the session cookie
    document.cookie =
      'firebase-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    window.location.href = '/login'
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-grama text-white shadow-md shadow-grama/25">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-sidebar-foreground">
            Grama-Vaxi
          </h1>
          <p className="text-xs font-medium text-muted-foreground">
            Admin Panel
          </p>
        </div>
      </div>

      <Separator className="mx-4 w-auto" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-grama-light text-grama-dark shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon
                className={cn(
                  'h-4.5 w-4.5 shrink-0 transition-colors',
                  isActive
                    ? 'text-grama'
                    : 'text-muted-foreground group-hover:text-accent-foreground'
                )}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Separator className="mx-4 w-auto" />

      {/* Footer — Officer info + Logout */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-grama-100 text-sm font-bold text-grama-800">
            V
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              Vet Officer
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Admin
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  )
}
