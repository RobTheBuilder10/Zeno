import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateBillSchema } from '@/lib/validations'

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

    const bill = await db.bill.findFirst({
      where: { id, userId: user.id },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    })

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 })
    }

    return NextResponse.json({ bill })
  } catch (error) {
    console.error('Error fetching bill:', error)
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
    const validated = updateBillSchema.parse(body)

    const bill = await db.bill.updateMany({
      where: { id, userId: user.id },
      data: validated,
    })

    if (bill.count === 0) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 })
    }

    const updated = await db.bill.findUnique({ where: { id } })

    return NextResponse.json({ bill: updated })
  } catch (error) {
    console.error('Error updating bill:', error)
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

    const bill = await db.bill.deleteMany({
      where: { id, userId: user.id },
    })

    if (bill.count === 0) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bill:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
