import { NextResponse } from 'next/server'
import { getCampHistory } from '@/lib/firestore/camps'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cursorId = searchParams.get('cursorId') || undefined
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)

  try {
    const data = await getCampHistory({ cursorId, pageSize })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
