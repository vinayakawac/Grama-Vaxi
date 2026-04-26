import { db } from '@/lib/firebase/client'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  updateDoc,
  writeBatch,
  DocumentSnapshot,
} from 'firebase/firestore'
import type { DiseaseReport, ReportStatus, PaginatedResult } from '@/types'

/**
 * Fetches paginated disease reports from Firestore.
 * Filters by village, status, and severity if provided.
 * Uses cursor-based pagination.
 */
export async function getReports(filters: {
  village?: string
  status?: ReportStatus | 'ALL'
  severity?: 'CRITICAL' | 'STANDARD' | 'ALL'
  cursor?: DocumentSnapshot
  pageSize?: number
}): Promise<PaginatedResult<DiseaseReport>> {
  try {
    const reportsPerPage = filters.pageSize ?? 25
    let q = query(
      collection(db, 'reports'),
      orderBy('reportedAt', 'desc'),
      limit(reportsPerPage + 1) // Fetch one extra to check for hasMore
    )

    if (filters.village && filters.village !== '') {
      q = query(q, where('village', '==', filters.village))
    }
    if (filters.status && filters.status !== 'ALL') {
      q = query(q, where('status', '==', filters.status))
    }
    if (filters.severity && filters.severity !== 'ALL') {
      q = query(q, where('severity', '==', filters.severity))
    }
    if (filters.cursor) {
      q = query(q, startAfter(filters.cursor))
    }

    const snap = await getDocs(q)
    const data = snap.docs.slice(0, reportsPerPage).map((d) => ({
      id: d.id,
      ...d.data(),
      reportedAt: d.data().reportedAt?.toDate(), // Convert Firestore Timestamp to JS Date
    })) as DiseaseReport[]

    return {
      data,
      lastDoc: snap.docs[reportsPerPage - 1] || null,
      hasMore: snap.docs.length > reportsPerPage,
    }
  } catch (error) {
    console.error('Error fetching reports:', error)
    throw new Error('Failed to fetch disease reports')
  }
}

/**
 * Marks a single report as reviewed.
 */
export async function markReportReviewed(reportId: string): Promise<void> {
  try {
    const reportRef = doc(db, 'reports', reportId)
    await updateDoc(reportRef, { status: 'REVIEWED' })
  } catch (error) {
    console.error('Error marking report reviewed:', error)
    throw new Error('Failed to update report status')
  }
}

/**
 * Marks multiple reports as reviewed in a single batch.
 */
export async function bulkMarkReviewed(reportIds: string[]): Promise<void> {
  try {
    const batch = writeBatch(db)
    reportIds.forEach((id) => {
      const reportRef = doc(db, 'reports', id)
      batch.update(reportRef, { status: 'REVIEWED' })
    })
    await batch.commit()
  } catch (error) {
    console.error('Error in bulk mark reviewed:', error)
    throw new Error('Failed to perform bulk update')
  }
}
