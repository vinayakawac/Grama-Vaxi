'use server'

import { adminDb } from '@/lib/firebase/admin'
import type { Animal, Species, VaccineStatus, PaginatedResult } from '@/types'

/**
 * Fetches paginated animals from Firestore using Admin SDK.
 * Filters by village, species, and vaccine status.
 */
export async function getAnimals(filters: {
  village?: string
  species?: Species | 'ALL'
  vaccineStatus?: VaccineStatus | 'ALL'
  cursorId?: string
  pageSize?: number
}): Promise<PaginatedResult<Animal>> {
  try {
    const animalsPerPage = filters.pageSize ?? 25
    let q: FirebaseFirestore.Query = adminDb.collection('animals')
    
    q = q.orderBy('registeredAt', 'desc')

    if (filters.village && filters.village !== '') {
      q = q.where('village', '==', filters.village)
    }
    if (filters.species && filters.species !== 'ALL') {
      q = q.where('species', '==', filters.species)
    }
    if (filters.vaccineStatus && filters.vaccineStatus !== 'ALL') {
      q = q.where('vaccineStatus', '==', filters.vaccineStatus)
    }
    
    q = q.limit(animalsPerPage + 1)

    if (filters.cursorId) {
      const docSnap = await adminDb.collection('animals').doc(filters.cursorId).get()
      if (docSnap.exists) {
        q = q.startAfter(docSnap)
      }
    }

    const snap = await q.get()
    const data = snap.docs.slice(0, animalsPerPage).map((d) => {
      const data = d.data()
      return {
        id: d.id,
        ...data,
        nextVaccineDate: data.nextVaccineDate?.toDate().toISOString() || new Date().toISOString(),
        registeredAt: data.registeredAt?.toDate().toISOString() || new Date().toISOString(),
      } as Animal
    })

    return {
      data,
      lastDocId: snap.docs[animalsPerPage - 1]?.id || null,
      hasMore: snap.docs.length > animalsPerPage,
    }
  } catch (error) {
    console.error('Error fetching animals:', error)
    throw new Error('Failed to fetch animal records')
  }
}
