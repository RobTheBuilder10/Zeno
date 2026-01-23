import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { generateFinancialSnapshot } from '@/services/snapshot-engine'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const snapshot = await generateFinancialSnapshot(user.id)

    return NextResponse.json({ snapshot })
  } catch (error) {
    console.error('Error generating snapshot:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
