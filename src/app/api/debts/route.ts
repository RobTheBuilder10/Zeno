import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { createDebtSchema } from '@/lib/validations'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const debts = await db.debt.findMany({
      where: { userId: user.id },
      orderBy: [{ interestRate: 'desc' }, { currentBalance: 'desc' }],
    })

    // Calculate summary
    type DebtRecord = { currentBalance: number; minimumPayment: number; interestRate: number }
    const totalDebt = debts.reduce((sum: number, d: DebtRecord) => sum + d.currentBalance, 0)
    const totalMinPayment = debts.reduce((sum: number, d: DebtRecord) => sum + d.minimumPayment, 0)
    const highestRate = debts.length > 0 ? Math.max(...debts.map((d: DebtRecord) => d.interestRate)) : 0

    return NextResponse.json({
      debts,
      summary: {
        totalDebt,
        totalMinPayment,
        highestRate,
        count: debts.length,
      },
    })
  } catch (error) {
    console.error('Error fetching debts:', error)
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
    const validated = createDebtSchema.parse(body)

    const debt = await db.debt.create({
      data: {
        userId: user.id,
        ...validated,
      },
    })

    return NextResponse.json({ debt }, { status: 201 })
  } catch (error) {
    console.error('Error creating debt:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
