'use server'

import { adminDb } from '@/lib/firebase/admin'
import type { Animal } from '@/types'

/**
 * Updates an animal record.
 * This is a Server Action that can be called directly from client components.
 */
export async function updateAnimal(
  animalId: string,
  updates: Partial<Animal>
): Promise<void> {
  try {
    const animalRef = adminDb.collection('animals').doc(animalId)
    await animalRef.update(updates)
  } catch (error) {
    console.error('Error updating animal:', error)
    throw new Error('Failed to update animal record')
  }
}

/**
 * Deletes an animal record.
 * This is a Server Action that can be called directly from client components.
 */
export async function deleteAnimal(animalId: string): Promise<void> {
  try {
    const animalRef = adminDb.collection('animals').doc(animalId)
    await animalRef.delete()
  } catch (error) {
    console.error('Error deleting animal:', error)
    throw new Error('Failed to delete animal record')
  }
}
