import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { getAdminSessionFromRequest } from '@/lib/auth/session'
import { dispatchCampAlert } from '@/lib/notifications/campDispatch'

function toDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate()
  }
  if (typeof value === 'string') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(req)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { campId } = await req.json()
    if (!campId || typeof campId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'campId is required' },
        { status: 400 }
      )
    }

    const campRef = adminDb.collection('camps').doc(campId)
    const campSnap = await campRef.get()

    if (!campSnap.exists) {
      return NextResponse.json(
        { success: false, error: 'Camp not found' },
        { status: 404 }
      )
    }

    const camp = campSnap.data() as {
      village?: string
      date?: unknown
      time?: string
      message?: string
    }

    const parsedDate = toDate(camp.date)
    if (!camp.village || !camp.time || !parsedDate) {
      return NextResponse.json(
        { success: false, error: 'Camp data is invalid for retry' },
        { status: 400 }
      )
    }

    await campRef.set(
      {
        dispatchStatus: 'QUEUED',
        retryRequestedAt: new Date(),
        retryRequestedBy: session.uid,
      },
      { merge: true }
    )

    const result = await dispatchCampAlert({
      campId,
      village: camp.village,
      date: parsedDate,
      time: camp.time,
      message: camp.message,
    })

    return NextResponse.json({
      success: true,
      campId,
      dispatchStatus: result.dispatchStatus,
      deliveredCount: result.deliveredCount,
      failedCount: result.failedCount,
    })
  } catch (error: any) {
    console.error('Retry API error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
