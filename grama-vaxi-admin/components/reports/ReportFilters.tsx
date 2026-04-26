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
import { FileWarning, Download, RefreshCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase/client'
import { collection, getDocs } from 'firebase/firestore'

export function ReportFilters() {
  const {
    reportsVillage,
    reportsStatus,
    reportsSeverity,
    setReportsVillage,
    setReportsStatus,
    setReportsSeverity,
    resetReportFilters,
  } = useFiltersStore()

  const [villages, setVillages] = useState<string[]>([])

  useEffect(() => {
    async function fetchVillages() {
      try {
        const snap = await getDocs(collection(db, 'animals'))
        const uniqueVillages = new Set<string>()
        snap.docs.forEach((doc) => uniqueVillages.add(doc.data().village))
        setVillages(Array.from(uniqueVillages).sort())
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
          <FileWarning className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground">
            Filters:
          </span>
        </div>

        {/* Village Filter */}
        <div className="w-44">
          <Select
            value={reportsVillage || 'ALL'}
            onValueChange={(v) => setReportsVillage(v === 'ALL' ? '' : (v ?? ''))}
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

        {/* Severity Filter */}
        <div className="w-36">
          <Select
            value={reportsSeverity}
            onValueChange={(v) => setReportsSeverity(v as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Severity</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="STANDARD">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-36">
          <Select
            value={reportsStatus}
            onValueChange={(v) => setReportsStatus(v as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REVIEWED">Reviewed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={resetReportFilters}
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
