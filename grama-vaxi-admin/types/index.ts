export type Species = 'COW' | 'GOAT' | 'SHEEP'
export type ReportStatus = 'PENDING' | 'REVIEWED'
export type VaccineStatus = 'UP_TO_DATE' | 'UPCOMING' | 'OVERDUE'

export interface Animal {
  id: string
  ownerId: string
  ownerName: string
  village: string
  species: Species
  breed: string
  ageMonths: number
  photoUrl: string
  nextVaccineDate: string | null
  vaccineStatus: VaccineStatus
  registeredAt: string
}

export interface CampAlert {
  id: string
  location?: string
  village: string
  date: string
  time: string
  message: string
  createdBy: string
  createdAt: string
  acknowledgedCount: number
  dispatchStatus?: 'QUEUED' | 'SENT' | 'PARTIAL' | 'NO_RECIPIENTS' | 'SKIPPED_DISABLED' | 'SCHEDULED'
  deliveredCount?: number
  failedCount?: number
  dispatchedAt?: string
}

export interface DiseaseReport {
  id: string
  animalId: string
  farmerId: string
  farmerName: string
  village: string
  symptoms: string
  affectedCount: number
  status: ReportStatus
  severity: 'CRITICAL' | 'STANDARD'
  reportedAt: string
}

export interface NotificationConfig {
  campAlertsEnabled: boolean
  vaccineRemindersEnabled: boolean
  defaultLeadTimeDays: 1 | 3 | 7
}

/** Paginated result wrapper for Firestore cursor-based pagination */
export interface PaginatedResult<T> {
  data: T[]
  lastDocId: string | null
  hasMore: boolean
}

/** Filter types for Zustand store */
export interface ReportFilters {
  village?: string
  status?: ReportStatus | 'ALL'
  severity?: 'CRITICAL' | 'STANDARD' | 'ALL'
  pageSize?: number
}

export interface AnimalFilters {
  village?: string
  species?: Species | 'ALL'
  vaccineStatus?: VaccineStatus | 'ALL'
  pageSize?: number
}
