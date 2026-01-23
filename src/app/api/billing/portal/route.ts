import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createPortalSession } from '@/services/stripe'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await db.subscription.findUnique({
      where: { userId: user.id },
    })

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await createPortalSession(
      subscription.stripeCustomerId,
      `${baseUrl}/settings?tab=billing`
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
