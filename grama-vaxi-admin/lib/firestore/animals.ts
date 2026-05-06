
import { adminDb } from '@/lib/firebase/admin'
import type { Animal, Species, VaccineStatus, PaginatedResult } from '@/types'

function toDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate()
  }
  if (typeof value === 'string') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return null
}

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
    const now = new Date()
    const data = snap.docs.slice(0, animalsPerPage).map((d) => {
      const data = d.data()
      const purgeAt = toDate(data.accountPurgeAt)
      const shouldRedactOwner = purgeAt !== null && purgeAt.getTime() <= now.getTime()

      return {
        id: d.id,
        ...data,
        ownerName: shouldRedactOwner ? 'Deleted User' : (data.ownerName ?? 'Unknown'),
        ownerId: shouldRedactOwner ? 'REDACTED' : (data.ownerId ?? data.ownerUid ?? ''),
        // If nextVaccineDate is absent or is the epoch sentinel (Timestamp(0,0)), return null
        // so the UI shows "Not scheduled" instead of "01/01/1970" or today's date.
        nextVaccineDate: (() => {
          const raw = data.nextVaccineDate
          if (!raw) return null
          const d = typeof raw.toDate === 'function' ? raw.toDate() : new Date(raw)
          if (isNaN(d.getTime()) || d.getTime() === 0) return null
          return d.toISOString()
        })(),
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
