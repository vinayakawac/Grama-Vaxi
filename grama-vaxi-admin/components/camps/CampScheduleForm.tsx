'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2, QrCode, Copy, Save } from 'lucide-react'
import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const campScheduleSchema = z.object({
  village: z.string().min(1, 'Village is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required'),
  services: z.string().min(1, 'Services are required'),
  message: z.string().max(200, 'Message too long').optional(),
})

type CampScheduleFormValues = z.infer<typeof campScheduleSchema>

interface CampScheduleFormProps {
  onSuccess: () => void
}

export function CampScheduleForm({ onSuccess }: CampScheduleFormProps) {
  const [villages, setVillages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [campId, setCampId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CampScheduleFormValues>({
    resolver: zodResolver(campScheduleSchema),
    defaultValues: {
      village: '',
      date: '',
      time: '',
      location: '',
      services: 'Vaccination drive',
      message: '',
    },
  })

  const village = useWatch({ control, name: 'village' })
  const date = useWatch({ control, name: 'date' })
  const time = useWatch({ control, name: 'time' })
  const location = useWatch({ control, name: 'location' })
  const services = useWatch({ control, name: 'services' })
  const message = useWatch({ control, name: 'message' })

  useEffect(() => {
    async function fetchVillages() {
      try {
        const response = await fetch('/api/villages')
        if (response.ok) {
          const uniqueVillages = await response.json()
          setVillages(uniqueVillages)
        }
      } catch (error) {
        console.error('Error fetching villages:', error)
      }
    }

    fetchVillages()
  }, [])

  const payload = useMemo(() => ({
    type: 'camp-schedule',
    campId: campId ?? 'draft',
    village: village ?? '',
    date: date ?? '',
    time: time ?? '',
    location: location ?? '',
    services: services ?? '',
    message: message ?? '',
  }), [campId, village, date, time, location, services, message])

  const payloadJson = JSON.stringify(payload)
  const qrCodeSrc = `https://chart.googleapis.com/chart?chs=320x320&cht=qr&chl=${encodeURIComponent(payloadJson)}`

  const onSubmit = async (data: CampScheduleFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/camps/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to save schedule')
      }

      setCampId(result.campId ?? null)
      toast.success('Camp schedule saved and QR generated')
      onSuccess()
    } catch (error) {
      console.error('Error saving camp schedule:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save camp schedule')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyPayload = async () => {
    await navigator.clipboard.writeText(payloadJson)
    toast.success('QR payload copied')
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Village camp scheduler</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="village">Village</Label>
              <Select onValueChange={(value: string | null) => setValue('village', value ?? '')}>
                <SelectTrigger id="village">
                  <SelectValue placeholder="Select a village..." />
                </SelectTrigger>
                <SelectContent>
                  {villages.map((villageName) => (
                    <SelectItem key={villageName} value={villageName}>
                      {villageName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.village && <p className="text-xs text-destructive">{errors.village.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Next vaccination date</Label>
                <Input id="date" type="date" {...register('date')} />
                {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" {...register('time')} />
                {errors.time && <p className="text-xs text-destructive">{errors.time.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Camp location</Label>
              <Input id="location" placeholder="Temple square, school, panchayat hall..." {...register('location')} />
              {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="services">Services</Label>
              <Input id="services" placeholder="Vaccines, checkups, tagging..." {...register('services')} />
              {errors.services && <p className="text-xs text-destructive">{errors.services.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Note</Label>
              <textarea
                id="message"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Optional note for the QR payload"
                {...register('message')}
              />
              {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-grama px-4 text-sm font-medium text-white transition-colors hover:bg-grama-dark disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving schedule...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save schedule
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">QR code preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4">
            <img
              src={qrCodeSrc}
              alt="Camp schedule QR code"
              className="mx-auto h-auto w-full max-w-[320px] rounded-xl bg-white p-4 shadow-sm"
            />
          </div>

          <div className="space-y-2 rounded-xl border border-border bg-background p-4 text-sm">
            <p className="font-medium text-foreground">Payload snapshot</p>
            <p className="text-muted-foreground">
              {village ? village : 'Village'} · {date ? date : 'date'} · {time ? time : 'time'}
            </p>
            <p className="text-muted-foreground">
              {location || 'Location'}
            </p>
            <p className="text-muted-foreground">
              {services || 'Services'}
            </p>
          </div>

          <button
            type="button"
            onClick={copyPayload}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Copy className="h-4 w-4" />
            Copy QR payload
          </button>

          <div className="rounded-xl bg-grama-50 px-4 py-3 text-sm text-grama-900">
            QR scans in the app will open the camp record created for this village and date.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}