import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { FIREBASE_SESSION_COOKIE } from '@/lib/auth/session'

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 5 // 5 days

async function isAdminUser(uid: string, adminClaim?: unknown): Promise<boolean> {
  if (adminClaim === true) {
    return true
  }

  const userSnap = await adminDb.collection('users').doc(uid).get()
  return userSnap.exists && userSnap.data()?.role === 'admin'
}

export async function POST(req: NextRequest) {
  try {
    const { idToken, email, password, isPrototypeLogin } = await req.json()

    // Handle hardcoded prototype login
    if (isPrototypeLogin) {
      if (email === 'vinayakawac@gmail.com' && password === '1234567890') {
        const response = NextResponse.json({ success: true })
        response.cookies.set({
          name: FIREBASE_SESSION_COOKIE,
          value: 'prototype-hardcoded-session',
          maxAge: Math.floor(SESSION_DURATION_MS / 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        })
        return response
      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        )
      }
    }

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json(
        { success: false, error: 'idToken is required' },
        { status: 400 }
      )
    }

    const decoded = await adminAuth.verifyIdToken(idToken, true)
    const isAdmin = await isAdminUser(decoded.uid, decoded.admin)

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: admin access required' },
        { status: 403 }
      )
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set({
      name: FIREBASE_SESSION_COOKIE,
      value: sessionCookie,
      maxAge: Math.floor(SESSION_DURATION_MS / 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error creating admin session:', error)
    return NextResponse.json(
      { success: false, error: 'Invalid authentication token' },
      { status: 401 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: FIREBASE_SESSION_COOKIE,
    value: '',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
  return response
}
