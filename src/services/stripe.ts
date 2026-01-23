/**
 * Stripe Integration Service
 *
 * This is a stub implementation for the MVP.
 * In production, integrate with Stripe SDK for real payment processing.
 */

import { db } from '@/lib/db'

// Pricing tiers
export const PRICING_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Manual account tracking',
      'Up to 100 transactions/month',
      'Up to 3 goals',
      'Basic financial snapshot',
      'World Layer progress',
    ],
    limits: {
      transactions: 100,
      goals: 3,
      accounts: 5,
    },
  },
  STARTER: {
    id: 'starter',
    name: 'Starter',
    price: 5,
    priceId: 'price_starter_monthly',
    features: [
      'Everything in Free',
      'Unlimited transactions',
      'Up to 10 goals',
      'Bill reminders',
      'Export data',
    ],
    limits: {
      transactions: Infinity,
      goals: 10,
      accounts: 10,
    },
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 12,
    priceId: 'price_pro_monthly',
    features: [
      'Everything in Starter',
      'AI-powered insights',
      'Unlimited goals',
      'Bank sync (Plaid)',
      'Priority support',
      'Custom categories',
    ],
    limits: {
      transactions: Infinity,
      goals: Infinity,
      accounts: Infinity,
    },
  },
} as const

export type PricingTier = keyof typeof PRICING_TIERS

/**
 * Create a Stripe checkout session
 * STUB: In production, use Stripe SDK
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  // In production:
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // const session = await stripe.checkout.sessions.create({...})

  console.log('Creating checkout session for user:', userId, 'priceId:', priceId)

  // Return mock session
  return {
    id: `cs_mock_${Date.now()}`,
    url: `${successUrl}?session_id=mock_session`,
  }
}

/**
 * Create a Stripe customer portal session
 * STUB: In production, use Stripe SDK
 */
export async function createPortalSession(customerId: string, returnUrl: string) {
  console.log('Creating portal session for customer:', customerId)

  return {
    url: returnUrl,
  }
}

/**
 * Handle Stripe webhook events
 * STUB: In production, verify webhook signature and handle events
 */
export async function handleWebhook(body: string, signature: string) {
  // In production:
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

  console.log('Handling webhook:', signature)

  // Mock event handling
  return { received: true }
}

/**
 * Update user subscription in database
 */
export async function updateSubscription(
  userId: string,
  data: {
    stripeCustomerId?: string
    stripeSubscriptionId?: string
    stripePriceId?: string
    plan?: 'FREE' | 'STARTER' | 'PRO'
    status?: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' | 'TRIALING'
    currentPeriodStart?: Date
    currentPeriodEnd?: Date
    cancelAtPeriodEnd?: boolean
  }
) {
  return db.subscription.update({
    where: { userId },
    data,
  })
}

/**
 * Check if user has access to a feature based on their plan
 */
export async function checkFeatureAccess(
  userId: string,
  feature: 'ai_insights' | 'bank_sync' | 'unlimited_goals' | 'unlimited_transactions'
): Promise<boolean> {
  const subscription = await db.subscription.findUnique({
    where: { userId },
  })

  if (!subscription || subscription.status !== 'ACTIVE') {
    return false
  }

  switch (feature) {
    case 'ai_insights':
    case 'bank_sync':
      return subscription.plan === 'PRO'
    case 'unlimited_goals':
      return subscription.plan === 'PRO'
    case 'unlimited_transactions':
      return subscription.plan !== 'FREE'
    default:
      return false
  }
}

/**
 * Get user's current usage against limits
 */
export async function getUserUsage(userId: string) {
  const [transactionCount, goalCount, accountCount, subscription] = await Promise.all([
    db.transaction.count({
      where: {
        userId,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    db.goal.count({ where: { userId, status: 'ACTIVE' } }),
    db.account.count({ where: { userId } }),
    db.subscription.findUnique({ where: { userId } }),
  ])

  const plan = subscription?.plan || 'FREE'
  const limits = PRICING_TIERS[plan as PricingTier]?.limits || PRICING_TIERS.FREE.limits

  return {
    transactions: { used: transactionCount, limit: limits.transactions },
    goals: { used: goalCount, limit: limits.goals },
    accounts: { used: accountCount, limit: limits.accounts },
  }
}
