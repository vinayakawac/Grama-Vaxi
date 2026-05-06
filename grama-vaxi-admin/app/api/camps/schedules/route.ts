import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { getAdminSessionFromRequest } from '@/lib/auth/session'

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(req)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { village, date, time, location, services, message } = body
    const parsedDate = new Date(date)

    if (!village || !date || Number.isNaN(parsedDate.getTime()) || !time || !location || !services) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: 'village, date, time, location, and services are required with a valid date',
        },
        { status: 400 }
      )
    }

    const campData = {
      village,
      date: parsedDate,
      time,
      location,
      services,
      message: message || '',
      createdAt: new Date(),
      acknowledgedCount: 0,
      createdBy: session.uid,
      dispatchStatus: 'SCHEDULED',
      deliveredCount: 0,
      failedCount: 0,
    }

    const campRef = await adminDb.collection('camps').add(campData)

    return NextResponse.json({
      success: true,
      campId: campRef.id,
    })
  } catch (error: any) {
    console.error('API Error in schedule creation:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}