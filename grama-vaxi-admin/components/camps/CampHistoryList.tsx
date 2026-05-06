'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Loader2, RotateCcw, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { CampAlert } from '@/types'
import { toast } from 'sonner'
import { formatDate } from '@/lib/dateUtils'

interface CampHistoryListProps {
  refreshTrigger: number
}

function dispatchTone(status: CampAlert['dispatchStatus']) {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-emerald-50 text-emerald-700'
    case 'SENT':
      return 'bg-emerald-50 text-emerald-700'
    case 'PARTIAL':
      return 'bg-amber-50 text-amber-700'
    case 'NO_RECIPIENTS':
      return 'bg-slate-100 text-slate-700'
    case 'SKIPPED_DISABLED':
      return 'bg-zinc-100 text-zinc-700'
    default:
      return 'bg-blue-50 text-blue-700'
  }
}

export function CampHistoryList({ refreshTrigger }: CampHistoryListProps) {
  const [history, setHistory] = useState<CampAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [retryingCampId, setRetryingCampId] = useState<string | null>(null)
  const [deletingCampId, setDeletingCampId] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/camps/history?pageSize=10')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setHistory(result.data)
    } catch (error) {
      console.error('Error fetching history:', error)
      toast.error('Failed to load camp history')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const canRetry = (status: CampAlert['dispatchStatus']) =>
    status === 'PARTIAL' ||
    status === 'NO_RECIPIENTS' ||
    status === 'SKIPPED_DISABLED'

  const handleRetry = async (campId: string) => {
    setRetryingCampId(campId)
    try {
      const response = await fetch('/api/camps/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campId }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error || 'Retry failed')
      }

      toast.success(`Retry completed: ${payload.dispatchStatus ?? 'SENT'}`)
      await fetchHistory()
    } catch (error) {
      console.error('Retry failed:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to retry camp alert'
      )
    } finally {
      setRetryingCampId(null)
    }
  }

  const handleDelete = async (campId: string, village: string) => {
    const shouldDelete = window.confirm(
      `Delete this alert for ${village}? This action cannot be undone.`
    )

    if (!shouldDelete) {
      return
    }

    setDeletingCampId(campId)
    try {
      const response = await fetch('/api/camps/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campId }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.error || 'Delete failed')
      }

      toast.success('Alert deleted')
      await fetchHistory()
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete alert')
    } finally {
      setDeletingCampId(null)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [refreshTrigger, fetchHistory])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Camp Alert History</CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-grama" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Camp Alert History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground">No alerts sent yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((camp) => (
              <div
                key={camp.id}
                className="group rounded-lg border border-border p-4 transition-all duration-200 hover:border-grama/20 hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-grama" />
                      <span className="text-sm font-semibold">
                        {camp.village}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {camp.message || 'No additional message'}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        📅 {formatDate(camp.date)} at {camp.time}
                      </span>
                      <span className="flex items-center gap-1">
                        📤 Sent: {formatDate(camp.createdAt)}
                      </span>
                      <span>
                        Delivery: {camp.deliveredCount ?? 0} success · {camp.failedCount ?? 0} failed
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant="secondary"
                      className={dispatchTone(camp.dispatchStatus)}
                    >
                      {camp.dispatchStatus ?? 'QUEUED'}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-grama-50 text-grama-800"
                    >
                      {camp.acknowledgedCount} ack
                    </Badge>
                    {canRetry(camp.dispatchStatus) && (
                      <button
                        type="button"
                        onClick={() => handleRetry(camp.id)}
                        disabled={retryingCampId === camp.id}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {retryingCampId === camp.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3 w-3" />
                        )}
                        Retry
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(camp.id, camp.village)}
                      disabled={deletingCampId === camp.id}
                      className="inline-flex items-center gap-1 rounded-md border border-destructive/20 px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingCampId === camp.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
