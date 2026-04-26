'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Settings, Bell, Clock, Save, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getNotificationConfig, saveNotificationConfig } from '@/lib/firestore/config'
import { toast } from 'sonner'
import type { NotificationConfig } from '@/types'

export function NotificationSettingsForm() {
  const [config, setConfig] = useState<NotificationConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchConfig() {
      try {
        const data = await getNotificationConfig()
        setConfig(data)
      } catch (error) {
        toast.error('Failed to load settings')
      } finally {
        setIsLoading(false)
      }
    }
    fetchConfig()
  }, [])

  const handleSave = async () => {
    if (!config) return
    setIsSaving(true)
    try {
      await saveNotificationConfig(config)
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !config) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-grama" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-grama-50 text-grama">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Notification Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure alert behavior for the farmer app
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camp Alert Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-grama/20">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-grama" />
              <div>
                <p className="text-sm font-medium">Camp Alert Broadcasts</p>
                <p className="text-xs text-muted-foreground">
                  Enable FCM push notifications for camp alerts
                </p>
              </div>
            </div>
            <button
              onClick={() => setConfig({ ...config, campAlertsEnabled: !config.campAlertsEnabled })}
              className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                config.campAlertsEnabled ? 'bg-grama' : 'bg-muted'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  config.campAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Vaccine Reminder Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-grama/20">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-grama" />
              <div>
                <p className="text-sm font-medium">Vaccine Reminder Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Send reminders to farmers before vaccination due dates
                </p>
              </div>
            </div>
            <button
              onClick={() => setConfig({ ...config, vaccineRemindersEnabled: !config.vaccineRemindersEnabled })}
              className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                config.vaccineRemindersEnabled ? 'bg-grama' : 'bg-muted'
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  config.vaccineRemindersEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Default Lead Time */}
          <div className="flex flex-col gap-4 rounded-lg border border-border p-4 transition-colors hover:border-grama/20 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-grama" />
              <div>
                <p className="text-sm font-medium">Default Reminder Lead Time</p>
                <p className="text-xs text-muted-foreground">
                  How many days before a camp to send reminders
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[1, 3, 7].map((days) => (
                <button
                  key={days}
                  onClick={() => setConfig({ ...config, defaultLeadTimeDays: days as 1 | 3 | 7 })}
                  className={`h-8 rounded-md border px-3 text-sm font-medium transition-all ${
                    config.defaultLeadTimeDays === days
                      ? 'border-grama bg-grama text-white shadow-sm'
                      : 'border-input bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {days} day{days > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-grama px-4 text-sm font-medium text-white shadow-md shadow-grama/20 transition-all hover:bg-grama-dark hover:shadow-lg disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Settings
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Settings are written to Firestore{' '}
            <Badge variant="secondary" className="font-mono text-[10px]">
              /config/notifications
            </Badge>{' '}
            — the farmer app reads these on launch
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
