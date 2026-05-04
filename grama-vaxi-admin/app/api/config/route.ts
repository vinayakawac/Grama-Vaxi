import { NextResponse } from 'next/server'
import { getNotificationConfig } from '@/lib/firestore/config'

export async function GET() {
  try {
    const data = await getNotificationConfig()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
