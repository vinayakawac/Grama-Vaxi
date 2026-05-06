'use client'

import { useCallback, useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Megaphone, CalendarRange, CheckCircle2, Users } from 'lucide-react'
import type { CampAlert } from '@/types'
import { StatCard } from '@/components/dashboard/StatCard'
import { formatDate } from '@/lib/dateUtils'

interface CampOverviewStatsProps {
  refreshTrigger: number
}

export function CampOverviewStats({ refreshTrigger }: CampOverviewStatsProps) {
  const [history, setHistory] = useState<CampAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOverview = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/camps/history?pageSize=100')
      if (!response.ok) {
        throw new Error('Failed to load camp overview')
      }

      const result = await response.json()
      setHistory(result.data ?? [])
    } catch (error) {
      console.error('Error loading camp overview:', error)
      setHistory([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOverview()
  }, [refreshTrigger, fetchOverview])

  const scheduledCount = history.filter((camp) => camp.dispatchStatus === 'SCHEDULED').length
  const dispatchedCount = history.filter((camp) => camp.dispatchStatus === 'SENT').length
  const totalAcknowledged = history.reduce((sum, camp) => sum + (camp.acknowledgedCount || 0), 0)
  const totalDelivered = history.reduce((sum, camp) => sum + (camp.deliveredCount || 0), 0)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">History & Statistics</CardTitle>
        </CardHeader>
        <CardContent className="flex h-56 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-grama" />
        </CardContent>
      </Card>
    )
  }

  const latestRecord = history[0]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Camp records"
          value={history.length.toString()}
          icon={<Megaphone className="h-5 w-5" />}
        />
        <StatCard
          label="Scheduled camps"
          value={scheduledCount.toString()}
          icon={<CalendarRange className="h-5 w-5" />}
        />
        <StatCard
          label="Delivered alerts"
          value={totalDelivered.toString()}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Acknowledgements"
          value={totalAcknowledged.toString()}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Latest record snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          {latestRecord ? (
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/20 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{latestRecord.village}</p>
                  <Badge variant="secondary" className="bg-grama-50 text-grama-800">
                    {latestRecord.dispatchStatus ?? 'QUEUED'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(latestRecord.date)} at {latestRecord.time}
                </p>
                <p className="text-sm text-muted-foreground">
                  {latestRecord.message || 'No additional note'}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {dispatchedCount} sent · {scheduledCount} scheduled
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No camp records available yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}