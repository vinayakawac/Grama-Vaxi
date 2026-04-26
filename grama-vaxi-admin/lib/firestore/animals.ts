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
  deleteDoc,
  DocumentSnapshot,
} from 'firebase/firestore'
import type { Animal, Species, VaccineStatus, PaginatedResult } from '@/types'

/**
 * Fetches paginated animals from Firestore.
 * Filters by village, species, and vaccine status.
 */
export async function getAnimals(filters: {
  village?: string
  species?: Species | 'ALL'
  vaccineStatus?: VaccineStatus | 'ALL'
  cursor?: DocumentSnapshot
  pageSize?: number
}): Promise<PaginatedResult<Animal>> {
  try {
    const animalsPerPage = filters.pageSize ?? 25
    let q = query(
      collection(db, 'animals'),
      orderBy('registeredAt', 'desc'),
      limit(animalsPerPage + 1)
    )

    if (filters.village && filters.village !== '') {
      q = query(q, where('village', '==', filters.village))
    }
    if (filters.species && filters.species !== 'ALL') {
      q = query(q, where('species', '==', filters.species))
    }
    if (filters.vaccineStatus && filters.vaccineStatus !== 'ALL') {
      q = query(q, where('vaccineStatus', '==', filters.vaccineStatus))
    }
    if (filters.cursor) {
      q = query(q, startAfter(filters.cursor))
    }

    const snap = await getDocs(q)
    const data = snap.docs.slice(0, animalsPerPage).map((d) => ({
      id: d.id,
      ...d.data(),
      nextVaccineDate: d.data().nextVaccineDate?.toDate(),
      registeredAt: d.data().registeredAt?.toDate(),
    })) as Animal[]

    return {
      data,
      lastDoc: snap.docs[animalsPerPage - 1] || null,
      hasMore: snap.docs.length > animalsPerPage,
    }
  } catch (error) {
    console.error('Error fetching animals:', error)
    throw new Error('Failed to fetch animal records')
  }
}

/**
 * Updates an animal record.
 */
export async function updateAnimal(
  animalId: string,
  updates: Partial<Animal>
): Promise<void> {
  try {
    const animalRef = doc(db, 'animals', animalId)
    await updateDoc(animalRef, updates)
  } catch (error) {
    console.error('Error updating animal:', error)
    throw new Error('Failed to update animal record')
  }
}

/**
 * Deletes an animal record.
 */
export async function deleteAnimal(animalId: string): Promise<void> {
  try {
    const animalRef = doc(db, 'animals', animalId)
    await deleteDoc(animalRef)
  } catch (error) {
    console.error('Error deleting animal:', error)
    throw new Error('Failed to delete animal record')
  }
}
