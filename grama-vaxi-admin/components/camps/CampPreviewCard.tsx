'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Megaphone } from 'lucide-react'

interface CampPreviewCardProps {
  village?: string
  date?: string
  time?: string
  message?: string
}

export function CampPreviewCard({ village, date, time, message }: CampPreviewCardProps) {
  return (
    <Card className="border-dashed border-grama/30 bg-grama-50/30">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
          📱 Notification Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl bg-white p-4 shadow-lg border border-black/5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-grama text-white shadow-md shadow-grama/20">
              <Megaphone className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-foreground truncate">
                  Camp Alert — Grama-Vaxi
                </p>
                <span className="text-[10px] text-muted-foreground ml-2">now</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Doctor arriving at{' '}
                <span className={village ? 'font-bold text-foreground' : 'italic text-muted-foreground'}>
                  {village || '[village]'}
                </span>{' '}
                on{' '}
                <span className={date ? 'font-bold text-foreground' : 'italic text-muted-foreground'}>
                  {date || '[date]'}
                </span>{' '}
                at{' '}
                <span className={time ? 'font-bold text-foreground' : 'italic text-muted-foreground'}>
                  {time || '[time]'}
                </span>.
                {message && (
                  <span className="block mt-2 font-medium text-foreground italic">
                    "{message}"
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-[10px] text-muted-foreground italic">
          This is exactly how farmers will see it on their mobile lockscreen.
        </p>
      </CardContent>
    </Card>
  )
}
