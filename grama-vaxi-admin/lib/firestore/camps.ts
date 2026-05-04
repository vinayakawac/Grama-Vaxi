
import { adminDb } from '@/lib/firebase/admin'
import type { CampAlert, PaginatedResult } from '@/types'

/**
 * Fetches paginated camp alert history from Firestore.
 */
export async function getCampHistory(filters: {
  cursorId?: string
  pageSize?: number
}): Promise<PaginatedResult<CampAlert>> {
  try {
    const campsPerPage = filters.pageSize ?? 10
    let q: FirebaseFirestore.Query = adminDb
      .collection('camps')
      .orderBy('createdAt', 'desc')
      .limit(campsPerPage + 1)

    if (filters.cursorId) {
      const docSnap = await adminDb.collection('camps').doc(filters.cursorId).get()
      if (docSnap.exists) {
        q = q.startAfter(docSnap)
      }
    }

    const snap = await q.get()
    const data = snap.docs.slice(0, campsPerPage).map((d) => {
      const data = d.data()
      return {
        id: d.id,
        ...data,
        date: data.date?.toDate().toISOString() || new Date().toISOString(),
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      } as CampAlert
    })

    return {
      data,
      lastDocId: snap.docs[campsPerPage - 1]?.id || null,
      hasMore: snap.docs.length > campsPerPage,
    }
  } catch (error) {
    console.error('Error fetching camp history:', error)
    throw new Error('Failed to fetch camp alert history')
  }
}
