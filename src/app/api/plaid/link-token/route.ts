import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createLinkToken, isPlaidEnabled } from '@/services/plaid'

export async function POST() {
  try {
    if (!isPlaidEnabled()) {
      return NextResponse.json(
        { error: 'Bank connections are not enabled' },
        { status: 403 }
      )
    }

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const linkToken = await createLinkToken(user.id)

    return NextResponse.json(linkToken)
  } catch (error) {
    console.error('Error creating link token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
