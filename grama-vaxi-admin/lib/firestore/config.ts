import { db } from '@/lib/firebase/client'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { NotificationConfig } from '@/types'

const CONFIG_DOC_PATH = 'config/notifications'

/**
 * Fetches notification configuration from Firestore.
 * Returns default values if doc doesn't exist.
 */
export async function getNotificationConfig(): Promise<NotificationConfig> {
  try {
    const configRef = doc(db, CONFIG_DOC_PATH)
    const snap = await getDoc(configRef)

    if (snap.exists()) {
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
    const configRef = doc(db, CONFIG_DOC_PATH)
    await setDoc(configRef, config)
  } catch (error) {
    console.error('Error saving notification config:', error)
    throw new Error('Failed to save notification settings')
  }
}
