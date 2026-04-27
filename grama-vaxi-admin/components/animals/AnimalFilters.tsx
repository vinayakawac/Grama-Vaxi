'use client'

import { useFiltersStore } from '@/store/filters'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PawPrint, Download, RefreshCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getUniqueVillages } from '@/app/actions/villageActions'

export function AnimalFilters() {
  const {
    animalsVillage,
    animalsSpecies,
    animalsVaccineStatus,
    setAnimalsVillage,
    setAnimalsSpecies,
    setAnimalsVaccineStatus,
    resetAnimalFilters,
  } = useFiltersStore()

  const [villages, setVillages] = useState<string[]>([])

  useEffect(() => {
    async function fetchVillages() {
      try {
        const uniqueVillages = await getUniqueVillages()
        setVillages(uniqueVillages)
      } catch (error) {
        console.error('Error fetching villages:', error)
      }
    }
    fetchVillages()
  }, [])

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-4 py-4">
        <div className="flex items-center gap-2 mr-2">
          <PawPrint className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground">
            Filters:
          </span>
        </div>

        {/* Village Filter */}
        <div className="w-44">
          <Select
            value={animalsVillage || 'ALL'}
            onValueChange={(v) => setAnimalsVillage(v === 'ALL' ? '' : (v ?? ''))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Villages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Villages</SelectItem>
              {villages.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Species Filter */}
        <div className="w-36">
          <Select
            value={animalsSpecies}
            onValueChange={(v) => setAnimalsSpecies(v as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Species</SelectItem>
              <SelectItem value="COW">Cow</SelectItem>
              <SelectItem value="GOAT">Goat</SelectItem>
              <SelectItem value="SHEEP">Sheep</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Vaccine Status Filter */}
        <div className="w-40">
          <Select
            value={animalsVaccineStatus}
            onValueChange={(v) => setAnimalsVaccineStatus(v as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Vaccine Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="UP_TO_DATE">Up to date</SelectItem>
              <SelectItem value="UPCOMING">Upcoming</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={resetAnimalFilters}
          className="flex h-9 items-center gap-1 rounded-md border border-input bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          <RefreshCcw className="h-3 w-3" />
          Reset
        </button>

        <div className="flex-1" />

        <button className="inline-flex h-9 items-center gap-2 rounded-md bg-grama px-4 text-sm font-medium text-white transition-colors hover:bg-grama-dark">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </CardContent>
    </Card>
  )
}
