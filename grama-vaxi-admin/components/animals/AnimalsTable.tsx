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
import { Pencil, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { deleteAnimal } from '@/app/actions/animalActions'
import { useFiltersStore } from '@/store/filters'
import type { Animal } from '@/types'
import { toast } from 'sonner'
import { AnimalEditSlideOver } from './AnimalEditSlideOver'
import { formatDate } from '@/lib/dateUtils'

export function AnimalsTable() {
  const { animalsVillage, animalsSpecies, animalsVaccineStatus } = useFiltersStore()
  const [data, setData] = useState<Animal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cursors, setCursors] = useState<Array<string | null>>([null])
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [deletingAnimalId, setDeletingAnimalId] = useState<string | null>(null)
  
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const fetchAnimals = async (page: number) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (animalsVillage) params.append('village', animalsVillage)
      if (animalsSpecies) params.append('species', animalsSpecies)
      if (animalsVaccineStatus) params.append('vaccineStatus', animalsVaccineStatus)
      if (cursors[page]) params.append('cursorId', cursors[page]!)
      params.append('pageSize', '10')

      const response = await fetch(`/api/animals?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()

      setData(result.data)
      setHasMore(result.hasMore)
      if (result.hasMore && result.lastDocId && cursors.length <= page + 1) {
        setCursors((prev): Array<string | null> => [...prev, result.lastDocId])
      }
    } catch (error) {
      toast.error('Failed to fetch animal records')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(0)
    setCursors([null])
    fetchAnimals(0)
  }, [animalsVillage, animalsSpecies, animalsVaccineStatus])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this animal record?')) return

    setDeletingAnimalId(id)
    try {
      await deleteAnimal(id)
      toast.success('Animal record deleted')
      fetchAnimals(currentPage)
    } catch (error) {
      toast.error('Failed to delete record')
    } finally {
      setDeletingAnimalId(null)
    }
  }

  const columns = useMemo<ColumnDef<Animal>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.id.slice(0, 8)}</span>,
      },
      {
        accessorKey: 'species',
        header: 'Species',
        cell: ({ row }) => {
          const colors: Record<string, string> = {
            COW: 'bg-blue-50 text-blue-800',
            GOAT: 'bg-purple-50 text-purple-800',
            SHEEP: 'bg-orange-50 text-orange-800',
          }
          return (
            <Badge variant="secondary" className={`${colors[row.original.species] || ''} text-[10px]`}>
              {row.original.species}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'breed',
        header: 'Breed',
      },
      {
        accessorKey: 'ownerName',
        header: 'Owner',
        cell: ({ row }) => <span className="font-medium">{row.original.ownerName}</span>,
      },
      {
        accessorKey: 'village',
        header: 'Village',
      },
      {
        accessorKey: 'nextVaccineDate',
        header: 'Next Vaccine',
        cell: ({ row }) => formatDate(row.original.nextVaccineDate),
      },
      {
        accessorKey: 'vaccineStatus',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.vaccineStatus
          if (status === 'OVERDUE') return <Badge variant="destructive" className="text-[10px]">Overdue</Badge>
          if (status === 'UPCOMING') return <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 text-[10px]">Upcoming</Badge>
          return <Badge variant="secondary" className="border-grama/30 bg-grama-50 text-grama-800 text-[10px]">Up to date</Badge>
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => {
                setEditingAnimal(row.original)
                setIsEditOpen(true)
              }}
              title="Edit animal"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              title="Delete animal"
              disabled={deletingAnimalId === row.original.id}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deletingAnimalId === row.original.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        ),
      },
    ],
    [currentPage, deletingAnimalId]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">Animal Records</h2>
          <Badge variant="secondary">{data.length} visible</Badge>
        </div>
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
                    <p className="text-sm text-muted-foreground">Loading animals...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <p className="text-sm text-muted-foreground">No animals found matching your filters.</p>
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
              fetchAnimals(currentPage - 1)
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
              fetchAnimals(currentPage + 1)
            }}
            className="flex h-8 items-center gap-1 rounded-md border border-input bg-background px-3 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <AnimalEditSlideOver
        animal={editingAnimal}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={() => fetchAnimals(currentPage)}
      />
    </div>
  )
}
