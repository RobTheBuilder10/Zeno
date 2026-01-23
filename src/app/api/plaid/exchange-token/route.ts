import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { exchangePublicToken, syncAccounts, isPlaidEnabled } from '@/services/plaid'

export async function POST(request: Request) {
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

    const body = await request.json()
    const { public_token, institution } = body

    if (!public_token) {
      return NextResponse.json({ error: 'Missing public token' }, { status: 400 })
    }

    // Exchange token
    const { access_token, item_id } = await exchangePublicToken(public_token)

    // Sync accounts
    await syncAccounts(user.id, item_id, access_token)

    // In production, store the access_token securely (encrypted)

    return NextResponse.json({
      success: true,
      message: 'Bank account connected successfully',
    })
  } catch (error) {
    console.error('Error exchanging token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
