import { db } from '@/lib/firebase/client'
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentSnapshot,
} from 'firebase/firestore'
import type { CampAlert, PaginatedResult } from '@/types'

/**
 * Fetches paginated camp alert history from Firestore.
 */
export async function getCampHistory(filters: {
  cursor?: DocumentSnapshot
  pageSize?: number
}): Promise<PaginatedResult<CampAlert>> {
  try {
    const campsPerPage = filters.pageSize ?? 10
    let q = query(
      collection(db, 'camps'),
      orderBy('createdAt', 'desc'),
      limit(campsPerPage + 1)
    )

    if (filters.cursor) {
      q = query(q, startAfter(filters.cursor))
    }

    const snap = await getDocs(q)
    const data = snap.docs.slice(0, campsPerPage).map((d) => ({
      id: d.id,
      ...d.data(),
      date: d.data().date?.toDate ? d.data().date.toDate() : d.data().date, // Handle both Date and Timestamp
      createdAt: d.data().createdAt?.toDate(),
    })) as CampAlert[]

    return {
      data,
      lastDoc: snap.docs[campsPerPage - 1] || null,
      hasMore: snap.docs.length > campsPerPage,
    }
  } catch (error) {
    console.error('Error fetching camp history:', error)
    throw new Error('Failed to fetch camp alert history')
  }
}
