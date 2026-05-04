import { NextResponse } from 'next/server'
import { getAnimals } from '@/lib/firestore/animals'
import { Species, VaccineStatus } from '@/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const village = searchParams.get('village') || undefined
  const species = (searchParams.get('species') || undefined) as Species | 'ALL' | undefined
  const vaccineStatus = (searchParams.get('vaccineStatus') || undefined) as VaccineStatus | 'ALL' | undefined
  const cursorId = searchParams.get('cursorId') || undefined
  const pageSize = parseInt(searchParams.get('pageSize') || '25', 10)

  try {
    const data = await getAnimals({ village, species, vaccineStatus, cursorId, pageSize })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
