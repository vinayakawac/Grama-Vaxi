'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Megaphone, Send, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
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
import { toast } from 'sonner'
import { db } from '@/lib/firebase/client'
import { collection, getDocs } from 'firebase/firestore'

const campAlertSchema = z.object({
  village: z.string().min(1, 'Village is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  message: z.string().max(200, 'Message too long').optional(),
})

type CampAlertFormValues = z.infer<typeof campAlertSchema>

interface CampAlertFormProps {
  onSuccess: () => void
  onValuesChange: (values: CampAlertFormValues) => void
}

export function CampAlertForm({ onSuccess, onValuesChange }: CampAlertFormProps) {
  const [villages, setVillages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CampAlertFormValues>({
    resolver: zodResolver(campAlertSchema),
    defaultValues: {
      village: '',
      date: '',
      time: '',
      message: '',
    },
  })

  // Watch form values for live preview
  const formValues = watch()
  useEffect(() => {
    onValuesChange(formValues)
  }, [formValues, onValuesChange])

  useEffect(() => {
    async function fetchVillages() {
      try {
        const snap = await getDocs(collection(db, 'animals'))
        const uniqueVillages = new Set<string>()
        snap.docs.forEach((doc) => uniqueVillages.add(doc.data().village))
        setVillages(Array.from(uniqueVillages).sort())
      } catch (error) {
        console.error('Error fetching villages:', error)
      }
    }
    fetchVillages()
  }, [])

  const onSubmit = async (data: CampAlertFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/camps/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to broadcast alert')

      toast.success('Camp alert broadcast successfully!')
      onSuccess()
    } catch (error) {
      console.error('Error broadcasting camp:', error)
      toast.error('Failed to broadcast camp alert')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-grama-50 text-grama">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base">Create Camp Alert</CardTitle>
            <p className="text-sm text-muted-foreground">
              Broadcast a vaccination camp notification to farmers
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="village">Village</Label>
            <Select onValueChange={(val: any) => setValue('village', val ?? '')}>
              <SelectTrigger id="village">
                <SelectValue placeholder="Select a village..." />
              </SelectTrigger>
              <SelectContent>
                {villages.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.village && (
              <p className="text-xs text-destructive">{errors.village.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                {...register('time')}
              />
              {errors.time && (
                <p className="text-xs text-destructive">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <textarea
              id="message"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter a message for farmers..."
              {...register('message')}
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-grama px-4 text-sm font-medium text-white transition-colors hover:bg-grama-dark disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Broadcasting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Broadcast Alert
              </>
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  )
}
