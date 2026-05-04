import { NextResponse } from 'next/server'
import { getReports } from '@/lib/firestore/reports'
import { ReportStatus } from '@/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const village = searchParams.get('village') || undefined
  const status = (searchParams.get('status') || undefined) as ReportStatus | 'ALL' | undefined
  const severity = (searchParams.get('severity') || undefined) as 'CRITICAL' | 'STANDARD' | 'ALL' | undefined
  const cursorId = searchParams.get('cursorId') || undefined
  const pageSize = parseInt(searchParams.get('pageSize') || '25', 10)

  try {
    const data = await getReports({ village, status, severity, cursorId, pageSize })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
