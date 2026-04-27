'use server'

import { adminDb } from '@/lib/firebase/admin'

/**
 * Fetches a list of unique villages from the animals collection.
 * Uses adminDb to bypass client-side rules and SDKs.
 */
export async function getUniqueVillages(): Promise<string[]> {
  try {
    const snap = await adminDb.collection('animals').get()
    const uniqueVillages = new Set<string>()
    
    snap.docs.forEach((doc) => {
      const data = doc.data()
      if (data.village) {
        uniqueVillages.add(data.village)
      }
    })
    
    return Array.from(uniqueVillages).sort()
  } catch (error) {
    console.error('Error fetching unique villages:', error)
    return []
  }
}
