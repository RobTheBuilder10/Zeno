import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { createBillSchema } from '@/lib/validations'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bills = await db.bill.findMany({
      where: { userId: user.id },
      orderBy: [{ nextDueDate: 'asc' }, { amount: 'desc' }],
    })

    // Calculate summary
    type BillRecord = { isActive: boolean; frequency: string; amount: number; isSubscription: boolean }
    const totalMonthly = bills.reduce((sum: number, b: BillRecord) => {
      if (!b.isActive) return sum
      switch (b.frequency) {
        case 'WEEKLY':
          return sum + b.amount * 4.33
        case 'BIWEEKLY':
          return sum + b.amount * 2.17
        case 'MONTHLY':
          return sum + b.amount
        case 'QUARTERLY':
          return sum + b.amount / 3
        case 'YEARLY':
          return sum + b.amount / 12
        default:
          return sum + b.amount
      }
    }, 0)

    const subscriptions = bills.filter((b: BillRecord) => b.isSubscription && b.isActive)
    const subscriptionTotal = subscriptions.reduce((sum: number, b: BillRecord) => sum + b.amount, 0)

    return NextResponse.json({
      bills,
      summary: {
        totalMonthly,
        subscriptionTotal,
        subscriptionCount: subscriptions.length,
        totalCount: bills.length,
      },
    })
  } catch (error) {
    console.error('Error fetching bills:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = createBillSchema.parse(body)

    const bill = await db.bill.create({
      data: {
        userId: user.id,
        ...validated,
      },
    })

    return NextResponse.json({ bill }, { status: 201 })
  } catch (error) {
    console.error('Error creating bill:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
