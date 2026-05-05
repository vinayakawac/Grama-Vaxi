'use server'

import { adminDb } from '@/lib/firebase/admin'

/**
 * Marks a single report as reviewed.
 * This is a Server Action that can be called directly from client components.
 */
export async function markReportReviewed(reportId: string): Promise<void> {
  try {
    const reportRef = adminDb.collection('reports').doc(reportId)
    await reportRef.update({ status: 'REVIEWED' })
  } catch (error) {
    console.error('Error marking report reviewed:', error)
    throw new Error('Failed to update report status')
  }
}

/**
 * Marks multiple reports as reviewed in a single batch.
 * This is a Server Action that can be called directly from client components.
 */
export async function bulkMarkReviewed(reportIds: string[]): Promise<void> {
  try {
    const batch = adminDb.batch()
    reportIds.forEach((id) => {
      const reportRef = adminDb.collection('reports').doc(id)
      batch.update(reportRef, { status: 'REVIEWED' })
    })
    await batch.commit()
  } catch (error) {
    console.error('Error in bulk mark reviewed:', error)
    throw new Error('Failed to perform bulk update')
  }
}

/**
 * Deletes a single report record.
 * This is a Server Action that can be called directly from client components.
 */
export async function deleteReport(reportId: string): Promise<void> {
  try {
    const reportRef = adminDb.collection('reports').doc(reportId)
    await reportRef.delete()
  } catch (error) {
    console.error('Error deleting report:', error)
    throw new Error('Failed to delete report')
  }
}
