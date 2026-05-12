import { NextResponse } from 'next/server'
import { getKarnatakaPlaces } from '@/app/actions/villageActions'

export async function GET() {
  try {
    const data = await getKarnatakaPlaces()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 })
  }
}
