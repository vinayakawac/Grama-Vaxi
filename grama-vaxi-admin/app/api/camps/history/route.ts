import { NextRequest, NextResponse } from 'next/server'
import { deleteCampAlert, getCampHistory } from '@/lib/firestore/camps'
import { getAdminSessionFromRequest } from '@/lib/auth/session'

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

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { campId } = await request.json()
    if (!campId || typeof campId !== 'string') {
      return NextResponse.json({ error: 'campId is required' }, { status: 400 })
    }

    await deleteCampAlert(campId)
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Delete failed'
    const status = message === 'Camp not found' ? 404 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
