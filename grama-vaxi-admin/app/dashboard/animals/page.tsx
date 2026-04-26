'use client'

import { AnimalFilters } from '@/components/animals/AnimalFilters'
import { AnimalsTable } from '@/components/animals/AnimalsTable'

export default function AnimalsPage() {
  return (
    <div className="space-y-6">
      <AnimalFilters />
      <AnimalsTable />
    </div>
  )
}
