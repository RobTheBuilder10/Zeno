import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { handleWebhook, updateSubscription } from '@/services/stripe'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // In production, verify and parse the webhook
    const result = await handleWebhook(body, signature)

    // Handle different event types
    // This is a stub - in production, parse the actual Stripe event

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error handling webhook:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
