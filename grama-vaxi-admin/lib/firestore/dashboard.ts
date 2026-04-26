import { db } from '@/lib/firebase/client'
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  orderBy,
} from 'firebase/firestore'
import type { DiseaseReport, CampAlert } from '@/types'

export interface DashboardStats {
  totalAnimals: number
  totalVillages: number
  pendingReports: number
  campsThisMonth: number
}

/**
 * Fetches summary statistics for the dashboard.
 * Note: In production, these should be cached or maintained via Cloud Functions
 * for scalability, but for v1 we query collections directly.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // 1. Total Animals
    const animalsSnap = await getDocs(collection(db, 'animals'))
    const totalAnimals = animalsSnap.size

    // 2. Unique Villages
    // This is inefficient but works for small datasets. 
    // Ideally villages should be a separate collection.
    const villages = new Set<string>()
    animalsSnap.docs.forEach(doc => villages.add(doc.data().village))
    const totalVillages = villages.size

    // 3. Pending Reports
    const pendingReportsSnap = await getDocs(
      query(collection(db, 'reports'), where('status', '==', 'PENDING'))
    )
    const pendingReports = pendingReportsSnap.size

    // 4. Camps this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const campsSnap = await getDocs(
      query(collection(db, 'camps'), where('createdAt', '>=', startOfMonth))
    )
    const campsThisMonth = campsSnap.size

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
    const animalsSnap = await getDocs(collection(db, 'animals'))
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
    const reportsSnap = await getDocs(
      query(collection(db, 'reports'), orderBy('reportedAt', 'desc'), limit(10))
    )
    const campsSnap = await getDocs(
      query(collection(db, 'camps'), orderBy('createdAt', 'desc'), limit(5))
    )

    return {
      reports: reportsSnap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        reportedAt: d.data().reportedAt?.toDate()
      })) as DiseaseReport[],
      camps: campsSnap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        createdAt: d.data().createdAt?.toDate()
      })) as CampAlert[],
    }
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return { reports: [], camps: [] }
  }
}
