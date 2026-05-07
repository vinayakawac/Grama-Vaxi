import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { getAdminSessionFromRequest } from '@/lib/auth/session'
import { dispatchCampAlert } from '@/lib/notifications/campDispatch'

export async function POST(req: NextRequest) {
  try {
    // 1. Verify admin session
    const session = await getAdminSessionFromRequest(req)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { village, date, time, location, message } = body
    const parsedDate = new Date(date)

    if (!village || !date || Number.isNaN(parsedDate.getTime()) || !time || !location) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: 'village, date, and time are required with a valid date',
        },
        { status: 400 }
      )
    }

    // 2. Write to Firestore /camps/{id}
    const campData = {
      village,
      date: parsedDate,
      time,
      location,
      message: message || '',
      createdAt: new Date(),
      acknowledgedCount: 0,
      createdBy: session.uid,
      dispatchStatus: 'QUEUED',
      deliveredCount: 0,
      failedCount: 0,
    }

    const campRef = await adminDb.collection('camps').add(campData)

    const result = await dispatchCampAlert({
      campId: campRef.id,
      village,
      date: parsedDate,
      time,
      location,
      message,
    })

    return NextResponse.json({
      success: true,
      campId: campRef.id,
      dispatchStatus: result.dispatchStatus,
    })
  } catch (error: any) {
    console.error('API Error in broadcast:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
