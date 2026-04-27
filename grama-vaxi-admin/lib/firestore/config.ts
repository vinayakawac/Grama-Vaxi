'use server'

import { adminDb } from '@/lib/firebase/admin'
import type { NotificationConfig } from '@/types'

const CONFIG_DOC_PATH = 'config/notifications'

/**
 * Fetches notification configuration from Firestore.
 * Returns default values if doc doesn't exist.
 */
export async function getNotificationConfig(): Promise<NotificationConfig> {
  try {
    const configRef = adminDb.doc(CONFIG_DOC_PATH)
    const snap = await configRef.get()

    if (snap.exists) {
      return snap.data() as NotificationConfig
    }

    // Default configuration
    return {
      campAlertsEnabled: true,
      vaccineRemindersEnabled: true,
      defaultLeadTimeDays: 3,
    }
  } catch (error) {
    console.error('Error fetching notification config:', error)
    throw new Error('Failed to fetch notification settings')
  }
}

/**
 * Saves notification configuration to Firestore.
 */
export async function saveNotificationConfig(
  config: NotificationConfig
): Promise<void> {
  try {
    const configRef = adminDb.doc(CONFIG_DOC_PATH)
    await configRef.set(config)
  } catch (error) {
    console.error('Error saving notification config:', error)
    throw new Error('Failed to save notification settings')
  }
}
