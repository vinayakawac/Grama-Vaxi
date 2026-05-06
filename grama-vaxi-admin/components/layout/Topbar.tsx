'use client'

import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard Overview',
  '/dashboard/camps': 'Camp Planning Hub',
  '/dashboard/reports': 'Disease Reports',
  '/dashboard/animals': 'Animal Management',
  '/dashboard/settings': 'Notification Settings',
}

export function Topbar() {
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? 'Dashboard'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-background/80 px-8 backdrop-blur-md">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-grama-50 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-grama animate-pulse" />
            <span className="text-xs font-medium text-grama-800">
              Connected
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
