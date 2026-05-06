'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CampAlertForm } from '@/components/camps/CampAlertForm'
import { CampPreviewCard } from '@/components/camps/CampPreviewCard'

export function CampFutureEnhancementCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">Future enhancement</CardTitle>
          <Badge variant="secondary" className="bg-amber-50 text-amber-700">
            disabled
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          The current camp alert broadcaster is preserved here for a later rollout, but it is not part of the active dashboard flow.
        </p>
        <div className="pointer-events-none space-y-4 opacity-60">
          <CampAlertForm
            onSuccess={() => {}}
            onValuesChange={() => {}}
          />
          <CampPreviewCard />
        </div>
      </CardContent>
    </Card>
  )
}