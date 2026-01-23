import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateDebtSchema } from '@/lib/validations'

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

    const debt = await db.debt.findFirst({
      where: { id, userId: user.id },
    })

    if (!debt) {
      return NextResponse.json({ error: 'Debt not found' }, { status: 404 })
    }

    return NextResponse.json({ debt })
  } catch (error) {
    console.error('Error fetching debt:', error)
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
    const validated = updateDebtSchema.parse(body)

    const debt = await db.debt.updateMany({
      where: { id, userId: user.id },
      data: validated,
    })

    if (debt.count === 0) {
      return NextResponse.json({ error: 'Debt not found' }, { status: 404 })
    }

    const updated = await db.debt.findUnique({ where: { id } })

    return NextResponse.json({ debt: updated })
  } catch (error) {
    console.error('Error updating debt:', error)
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

    const debt = await db.debt.deleteMany({
      where: { id, userId: user.id },
    })

    if (debt.count === 0) {
      return NextResponse.json({ error: 'Debt not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting debt:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
