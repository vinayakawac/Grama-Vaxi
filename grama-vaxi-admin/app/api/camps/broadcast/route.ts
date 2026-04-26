import { NextRequest, NextResponse } from 'next/server'
import { adminDb, messaging } from '@/lib/firebase/admin'

export async function POST(req: NextRequest) {
  try {
    // 1. Verify admin session
    // Note: In a real app, use firebase-admin verifySessionCookie
    const sessionCookie = req.cookies.get('firebase-session')?.value
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { village, date, time, message } = body

    if (!village || !date || !time) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: 'village, date, and time are required',
        },
        { status: 400 }
      )
    }

    // 2. Write to Firestore /camps/{id}
    const campData = {
      village,
      date: new Date(date), // Store as Date object
      time,
      message: message || '',
      createdAt: new Date(),
      acknowledgedCount: 0,
      createdBy: 'Admin Officer', // Ideal: get from session
    }

    const campRef = await adminDb.collection('camps').add(campData)

    // 3. Send FCM topic message to /topics/village_{village}
    // We sanitize the village name for topic compatibility (alphanumeric + underscore/hyphen/percent)
    const sanitizedVillage = village.replace(/\s+/g, '_').toLowerCase()
    
    await messaging.send({
      topic: `village_${sanitizedVillage}`,
      notification: {
        title: 'Camp Alert — Grama-Vaxi',
        body: `Doctor arriving at ${village} on ${date} at ${time}`,
      },
      data: { 
        campId: campRef.id, 
        type: 'CAMP_ALERT',
        village: village,
        date: date,
        time: time
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'camp_alerts',
          icon: 'ic_stat_megaphone',
          color: '#2E7D32',
        }
      }
    })

    return NextResponse.json({
      success: true,
      campId: campRef.id,
    })
  } catch (error: any) {
    console.error('API Error in broadcast:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
