'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { CampOverviewStats } from '@/components/camps/CampOverviewStats'
import { CampScheduleForm } from '@/components/camps/CampScheduleForm'
import { CampFutureEnhancementCard } from '@/components/camps/CampFutureEnhancementCard'
import { CampHistoryList } from '@/components/camps/CampHistoryList'
import { cn } from '@/lib/utils'

type CampTab = 'history' | 'schedule' | 'future'

export default function CampsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeTab, setActiveTab] = useState<CampTab>('history')

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const tabs: Array<{ id: CampTab; label: string; description: string }> = [
    {
      id: 'history',
      label: 'History & statistics',
      description: 'Review recent camp records and outcomes.',
    },
    {
      id: 'schedule',
      label: 'Village QR scheduler',
      description: 'Create a camp record and generate a scan-ready QR code.',
    },
    {
      id: 'future',
      label: 'Future enhancement',
      description: 'Preserved for the old broadcast flow.',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-white via-grama-50/30 to-emerald-50/40 p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <Badge variant="secondary" className="w-fit bg-grama-50 text-grama-800">
              Camps hub
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              History, schedules, and QR generation in one workspace.
            </h1>
            <p className="text-sm text-muted-foreground">
              The dashboard now focuses on the active history view and the new village QR scheduler. The old alert broadcaster is kept only as a future enhancement.
            </p>
          </div>

          <div className="rounded-2xl border border-grama-100 bg-white px-4 py-3 text-sm text-muted-foreground shadow-sm">
            Use page 1 for analytics and page 2 to create the QR code sent to the Android app.
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'min-w-[220px] rounded-2xl border px-4 py-3 text-left transition-all duration-200',
                activeTab === tab.id
                  ? 'border-grama bg-grama text-white shadow-md shadow-grama/20'
                  : 'border-border bg-white hover:border-grama/30 hover:bg-grama-50/50'
              )}
            >
              <div className="text-sm font-semibold">{tab.label}</div>
              <div className={cn('mt-1 text-xs', activeTab === tab.id ? 'text-white/85' : 'text-muted-foreground')}>
                {tab.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'history' && (
        <div className="space-y-6">
          <CampOverviewStats refreshTrigger={refreshTrigger} />
          <CampHistoryList refreshTrigger={refreshTrigger} />
        </div>
      )}

      {activeTab === 'schedule' && (
        <CampScheduleForm onSuccess={handleSuccess} />
      )}

      {activeTab === 'future' && (
        <CampFutureEnhancementCard />
      )}
    </div>
  )
}
