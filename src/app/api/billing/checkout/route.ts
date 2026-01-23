import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createCheckoutSession, PRICING_TIERS } from '@/services/stripe'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plan } = body

    if (!plan || !['STARTER', 'PRO'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const tier = PRICING_TIERS[plan as keyof typeof PRICING_TIERS]
    if (!tier.priceId) {
      return NextResponse.json({ error: 'Plan not available' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await createCheckoutSession(
      user.id,
      tier.priceId,
      `${baseUrl}/settings?tab=billing&success=true`,
      `${baseUrl}/settings?tab=billing&canceled=true`
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
