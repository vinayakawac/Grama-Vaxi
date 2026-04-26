'use client'

import { ReportFilters } from '@/components/reports/ReportFilters'
import { ReportsTable } from '@/components/reports/ReportsTable'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <ReportFilters />
      <ReportsTable />
    </div>
  )
}
