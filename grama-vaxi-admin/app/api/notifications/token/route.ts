import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

type Platform = 'android' | 'ios' | 'web'

function getTokenDocId(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

function normalizeVillage(village?: string): string {
  return (village ?? '').trim()
}

async function getAuthenticatedUid(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.toLowerCase().startsWith('bearer ')) {
    return null
  }

  const idToken = authHeader.slice(7).trim()
  if (!idToken) return null

  try {
    const decoded = await adminAuth.verifyIdToken(idToken, true)
    return decoded.uid
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const uid = await getAuthenticatedUid(req)
    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const token = typeof body.token === 'string' ? body.token.trim() : ''
    const village = normalizeVillage(body.village)
    const platform = (body.platform as Platform | undefined) ?? 'android'

    if (!token || !village) {
      return NextResponse.json(
        { success: false, error: 'token and village are required' },
        { status: 400 }
      )
    }

    const docId = getTokenDocId(token)
    await adminDb.collection('notificationTokens').doc(docId).set(
      {
        uid,
        token,
        village,
        platform,
        enabled: true,
        updatedAt: new Date(),
      },
      { merge: true }
    )

    await adminDb.collection('users').doc(uid).set(
      {
        village,
        fcmToken: token,
        lastTokenUpdatedAt: new Date(),
      },
      { merge: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error registering notification token:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to register token' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const uid = await getAuthenticatedUid(req)
    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const token = typeof body.token === 'string' ? body.token.trim() : ''

    if (token) {
      const docId = getTokenDocId(token)
      const ref = adminDb.collection('notificationTokens').doc(docId)
      const snap = await ref.get()

      if (snap.exists && snap.data()?.uid === uid) {
        await ref.set({ enabled: false, updatedAt: new Date() }, { merge: true })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unregistering notification token:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to unregister token' },
      { status: 500 }
    )
  }
}
