'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Loader2, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import {
  markReportReviewed,
  bulkMarkReviewed,
  deleteReport,
} from '@/app/actions/reportActions'
import { useFiltersStore } from '@/store/filters'
import type { DiseaseReport } from '@/types'
import { toast } from 'sonner'
import { formatDate } from '@/lib/dateUtils'

export function ReportsTable() {
  const { reportsVillage, reportsStatus, reportsSeverity } = useFiltersStore()
  const [data, setData] = useState<DiseaseReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cursors, setCursors] = useState<Array<string | null>>([null])
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({})
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null)

  const fetchReports = async (page: number) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (reportsVillage) params.append('village', reportsVillage)
      if (reportsStatus) params.append('status', reportsStatus)
      if (reportsSeverity) params.append('severity', reportsSeverity)
      if (cursors[page]) params.append('cursorId', cursors[page]!)
      params.append('pageSize', '10')

      const response = await fetch(`/api/reports?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()

      setData(result.data)
      setHasMore(result.hasMore)
      if (result.hasMore && result.lastDocId && cursors.length <= page + 1) {
        setCursors((prev): Array<string | null> => [...prev, result.lastDocId])
      }
    } catch (error) {
      toast.error('Failed to fetch reports')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Reset to page 0 when filters change
    setCurrentPage(0)
    setCursors([null])
    fetchReports(0)
  }, [reportsVillage, reportsStatus, reportsSeverity])

  const handleReview = async (id: string) => {
    try {
      await markReportReviewed(id)
      toast.success('Report marked as reviewed')
      fetchReports(currentPage) // Refresh
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleBulkReview = async () => {
    const ids = Object.keys(selectedRows).filter((id) => selectedRows[id])
    if (ids.length === 0) return
    try {
      await bulkMarkReviewed(ids)
      toast.success(`Marked ${ids.length} reports as reviewed`)
      setSelectedRows({})
      fetchReports(currentPage)
    } catch (error) {
      toast.error('Bulk update failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return

    setDeletingReportId(id)
    try {
      await deleteReport(id)
      toast.success('Report deleted')
      fetchReports(currentPage)
    } catch (error) {
      toast.error('Failed to delete report')
    } finally {
      setDeletingReportId(null)
    }
  }

  const columns = useMemo<ColumnDef<DiseaseReport>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            className="rounded border-border"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="rounded border-border"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        accessorKey: 'id',
        header: 'Report ID',
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.id.slice(0, 8)}...</span>,
      },
      {
        accessorKey: 'animalId',
        header: 'Animal ID',
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.animalId}</span>,
      },
      {
        accessorKey: 'farmerName',
        header: 'Farmer',
        cell: ({ row }) => <span className="font-medium">{row.original.farmerName}</span>,
      },
      {
        accessorKey: 'village',
        header: 'Village',
      },
      {
        accessorKey: 'symptoms',
        header: 'Symptoms',
        cell: ({ row }) => <span className="max-w-48 truncate block text-muted-foreground">{row.original.symptoms}</span>,
      },
      {
        accessorKey: 'reportedAt',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.reportedAt),
      },
      {
        accessorKey: 'severity',
        header: 'Severity',
        cell: ({ row }) => (
          <Badge variant={row.original.severity === 'CRITICAL' ? 'destructive' : 'secondary'} className="text-[10px]">
            {row.original.severity}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant={row.original.status === 'PENDING' ? 'outline' : 'secondary'}
            className={row.original.status === 'REVIEWED' ? 'border-grama/30 bg-grama-50 text-grama-800' : ''}
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            {row.original.status === 'PENDING' && (
              <button
                onClick={() => handleReview(row.original.id)}
                className="inline-flex h-7 items-center gap-1 rounded-md bg-grama/10 px-2.5 text-xs font-medium text-grama transition-all hover:bg-grama/20"
              >
                <CheckCircle className="h-3 w-3" />
                Review
              </button>
            )}

            <button
              onClick={() => handleDelete(row.original.id)}
              disabled={deletingReportId === row.original.id}
              className="inline-flex h-7 items-center gap-1 rounded-md border border-destructive/25 px-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deletingReportId === row.original.id ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
              Delete
            </button>
          </div>
        ),
      },
    ],
    [currentPage, deletingReportId]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: (updater) => {
      if (typeof updater === 'function') {
        const next = updater(selectedRows)
        setSelectedRows(next)
      } else {
        setSelectedRows(updater)
      }
    },
    state: {
      rowSelection: selectedRows,
    },
    getRowId: (row) => row.id,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">Disease Reports</h2>
          <Badge variant="secondary">{data.length} visible</Badge>
        </div>
        {Object.keys(selectedRows).length > 0 && (
          <button
            onClick={handleBulkReview}
            className="inline-flex h-8 items-center gap-1 rounded-md bg-grama/10 px-3 text-xs font-medium text-grama transition-colors hover:bg-grama/20"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Mark {Object.keys(selectedRows).length} as Reviewed
          </button>
        )}
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-grama" />
                    <p className="text-sm text-muted-foreground">Loading reports...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <p className="text-sm text-muted-foreground">No reports found matching your filters.</p>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="group hover:bg-muted/40 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-2">
        <p className="text-xs text-muted-foreground">
          Page {currentPage + 1}
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 0 || isLoading}
            onClick={() => {
              setCurrentPage(currentPage - 1)
              fetchReports(currentPage - 1)
            }}
            className="flex h-8 items-center gap-1 rounded-md border border-input bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            <ChevronLeft className="h-3 w-3" />
            Previous
          </button>
          <button
            disabled={!hasMore || isLoading}
            onClick={() => {
              setCurrentPage(currentPage + 1)
              fetchReports(currentPage + 1)
            }}
            className="flex h-8 items-center gap-1 rounded-md border border-input bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
