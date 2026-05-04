import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

const FIREBASE_SESSION_COOKIE = 'firebase-session'

export interface AdminSession {
  uid: string
  phoneNumber?: string
  email?: string
}

async function hasAdminAccess(uid: string, adminClaim?: unknown): Promise<boolean> {
  if (adminClaim === true) {
    return true
  }

  const userSnap = await adminDb.collection('users').doc(uid).get()
  return userSnap.exists && userSnap.data()?.role === 'admin'
}

export async function verifyAdminSessionCookie(
  sessionCookie?: string
): Promise<AdminSession | null> {
  if (!sessionCookie) return null

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    const isAdmin = await hasAdminAccess(decoded.uid, decoded.admin)

    if (!isAdmin) {
      return null
    }

    return {
      uid: decoded.uid,
      phoneNumber: decoded.phone_number,
      email: decoded.email,
    }
  } catch {
    return null
  }
}

export async function getAdminSessionFromRequest(
  req: NextRequest
): Promise<AdminSession | null> {
  return verifyAdminSessionCookie(req.cookies.get(FIREBASE_SESSION_COOKIE)?.value)
}

export async function getAdminSessionFromCookies(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  return verifyAdminSessionCookie(cookieStore.get(FIREBASE_SESSION_COOKIE)?.value)
}

export { FIREBASE_SESSION_COOKIE }
