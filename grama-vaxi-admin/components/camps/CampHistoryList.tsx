'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCampHistory } from '@/lib/firestore/camps'
import type { CampAlert } from '@/types'

interface CampHistoryListProps {
  refreshTrigger: number
}

export function CampHistoryList({ refreshTrigger }: CampHistoryListProps) {
  const [history, setHistory] = useState<CampAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true)
      try {
        const result = await getCampHistory({ pageSize: 10 })
        setHistory(result.data)
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
  }, [refreshTrigger])

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
                        📅 {new Date(camp.date).toLocaleDateString()} at {camp.time}
                      </span>
                      <span className="flex items-center gap-1">
                        📤 Sent: {camp.createdAt.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-grama-50 text-grama-800"
                  >
                    {camp.acknowledgedCount} ack
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
