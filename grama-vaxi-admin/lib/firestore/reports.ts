
import { adminDb } from '@/lib/firebase/admin'
import type { DiseaseReport, ReportStatus, PaginatedResult } from '@/types'

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
 * Fetches paginated disease reports from Firestore using Admin SDK.
 * Filters by village, status, and severity if provided.
 * Uses cursor-based pagination.
 */
export async function getReports(filters: {
  village?: string
  status?: ReportStatus | 'ALL'
  severity?: 'CRITICAL' | 'STANDARD' | 'ALL'
  cursorId?: string
  pageSize?: number
}): Promise<PaginatedResult<DiseaseReport>> {
  try {
    const reportsPerPage = filters.pageSize ?? 25
    let q: FirebaseFirestore.Query = adminDb.collection('reports')
    
    q = q.orderBy('reportedAt', 'desc')

    if (filters.village && filters.village !== '') {
      q = q.where('village', '==', filters.village)
    }
    if (filters.status && filters.status !== 'ALL') {
      q = q.where('status', '==', filters.status)
    }
    if (filters.severity && filters.severity !== 'ALL') {
      q = q.where('severity', '==', filters.severity)
    }
    
    q = q.limit(reportsPerPage + 1) // Fetch one extra to check for hasMore

    if (filters.cursorId) {
      const docSnap = await adminDb.collection('reports').doc(filters.cursorId).get()
      if (docSnap.exists) {
        q = q.startAfter(docSnap)
      }
    }

    const snap = await q.get()
    const now = new Date()
    const data = snap.docs.slice(0, reportsPerPage).map((d) => {
      const data = d.data()
      const purgeAt = toDate(data.accountPurgeAt)
      const shouldRedactIdentity = purgeAt !== null && purgeAt.getTime() <= now.getTime()

      return {
        id: d.id,
        ...data,
        farmerName: shouldRedactIdentity ? 'Deleted User' : (data.farmerName ?? data.ownerName ?? 'Unknown'),
        farmerId: shouldRedactIdentity ? 'REDACTED' : (data.farmerId ?? data.ownerId ?? data.ownerUid ?? ''),
        // Convert Firestore Timestamp to JS Date then to ISO string
        reportedAt: data.reportedAt?.toDate().toISOString() || new Date().toISOString(), 
      } as DiseaseReport
    })

    return {
      data,
      lastDocId: snap.docs[reportsPerPage - 1]?.id || null,
      hasMore: snap.docs.length > reportsPerPage,
    }
  } catch (error) {
    console.error('Error fetching reports:', error)
    throw new Error('Failed to fetch disease reports')
  }
}
