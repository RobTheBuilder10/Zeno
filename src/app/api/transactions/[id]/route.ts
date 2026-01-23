import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateTransactionSchema } from '@/lib/validations'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    const { id } = await params

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transaction = await db.transaction.findFirst({
      where: { id, userId: user.id },
      include: { account: true },
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    const { id } = await params

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = updateTransactionSchema.parse(body)

    // Get original transaction for balance adjustment
    const original = await db.transaction.findFirst({
      where: { id, userId: user.id },
    })

    if (!original) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    const transaction = await db.transaction.update({
      where: { id },
      data: validated,
    })

    // Adjust account balance if amount changed
    if (validated.amount !== undefined && validated.amount !== original.amount) {
      const difference = validated.amount - original.amount
      await db.account.update({
        where: { id: original.accountId },
        data: { currentBalance: { increment: difference } },
      })
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    const { id } = await params

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transaction = await db.transaction.findFirst({
      where: { id, userId: user.id },
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Delete and reverse balance
    await db.transaction.delete({ where: { id } })
    await db.account.update({
      where: { id: transaction.accountId },
      data: { currentBalance: { decrement: transaction.amount } },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
