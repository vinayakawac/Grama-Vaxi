import { NextResponse } from 'next/server'
import { getUniqueVillages } from '@/app/actions/villageActions'

export async function GET() {
  try {
    const data = await getUniqueVillages()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
