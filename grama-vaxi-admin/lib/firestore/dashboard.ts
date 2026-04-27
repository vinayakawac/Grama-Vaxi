import { adminDb } from '@/lib/firebase/admin'
import type { DiseaseReport, CampAlert } from '@/types'

export interface DashboardStats {
  totalAnimals: number
  totalVillages: number
  pendingReports: number
  campsThisMonth: number
}

/**
 * Fetches summary statistics for the dashboard.
 * Optimized using count() aggregations where possible.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // 1. Total Animals
    const animalsCountSnap = await adminDb.collection('animals').count().get()
    const totalAnimals = animalsCountSnap.data().count

    // 2. Unique Villages
    // Note: Admin SDK doesn't natively support "distinct" queries yet.
    // For a real prod app with 1M+ animals, this should be maintained in a separate "villages" collection.
    // But since we still need it, we'll fetch only the 'village' field to minimize payload size.
    const villagesSnap = await adminDb.collection('animals').select('village').get()
    const villages = new Set<string>()
    villagesSnap.docs.forEach((doc) => villages.add(doc.data().village))
    const totalVillages = villages.size

    // 3. Pending Reports
    const pendingReportsCountSnap = await adminDb
      .collection('reports')
      .where('status', '==', 'PENDING')
      .count()
      .get()
    const pendingReports = pendingReportsCountSnap.data().count

    // 4. Camps this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const campsCountSnap = await adminDb
      .collection('camps')
      .where('createdAt', '>=', startOfMonth)
      .count()
      .get()
    const campsThisMonth = campsCountSnap.data().count

    return {
      totalAnimals,
      totalVillages,
      pendingReports,
      campsThisMonth,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalAnimals: 0,
      totalVillages: 0,
      pendingReports: 0,
      campsThisMonth: 0,
    }
  }
}

/**
 * Fetches data for the vaccination coverage chart.
 * Returns % of vaccinated animals per village.
 */
export async function getCoverageData(): Promise<{ village: string; coverage: number }[]> {
  try {
    const animalsSnap = await adminDb.collection('animals').select('village', 'vaccineStatus').get()
    const villageData: Record<string, { total: number; vaccinated: number }> = {}

    animalsSnap.docs.forEach((doc) => {
      const data = doc.data()
      const village = data.village
      if (!villageData[village]) {
        villageData[village] = { total: 0, vaccinated: 0 }
      }
      villageData[village].total++
      if (data.vaccineStatus === 'UP_TO_DATE') {
        villageData[village].vaccinated++
      }
    })

    return Object.entries(villageData).map(([village, stats]) => ({
      village,
      coverage: Math.round((stats.vaccinated / stats.total) * 100),
    }))
  } catch (error) {
    console.error('Error fetching coverage data:', error)
    return []
  }
}

/**
 * Fetches recent activity: last 10 reports and last 5 camps.
 */
export async function getRecentActivity(): Promise<{
  reports: DiseaseReport[]
  camps: CampAlert[]
}> {
  try {
    const reportsSnap = await adminDb
      .collection('reports')
      .orderBy('reportedAt', 'desc')
      .limit(10)
      .get()
      
    const campsSnap = await adminDb
      .collection('camps')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get()

    return {
      reports: reportsSnap.docs.map((d) => {
        const data = d.data()
        return { 
          id: d.id, 
          ...data,
          reportedAt: data.reportedAt?.toDate().toISOString() || new Date().toISOString()
        } as DiseaseReport
      }),
      camps: campsSnap.docs.map((d) => {
        const data = d.data()
        return { 
          id: d.id, 
          ...data,
          date: data.date?.toDate().toISOString() || new Date().toISOString(),
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
        } as CampAlert
      }),
    }
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return { reports: [], camps: [] }
  }
}
