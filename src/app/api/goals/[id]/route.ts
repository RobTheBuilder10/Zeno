import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateGoalSchema } from '@/lib/validations'

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

    const goal = await db.goal.findFirst({
      where: { id, userId: user.id },
    })

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    return NextResponse.json({ goal })
  } catch (error) {
    console.error('Error fetching goal:', error)
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
    const validated = updateGoalSchema.parse(body)

    // Check if goal is being completed
    const existing = await db.goal.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = { ...validated }

    // Mark as completed if current amount reaches target
    if (
      validated.currentAmount !== undefined &&
      validated.currentAmount >= existing.targetAmount &&
      existing.status === 'ACTIVE'
    ) {
      updateData.status = 'COMPLETED'
      updateData.completedAt = new Date()

      // Award XP for completing goal
      await db.worldProgress.update({
        where: { userId: user.id },
        data: {
          currentXp: { increment: 100 },
          totalXp: { increment: 100 },
          goalsCompleted: { increment: 1 },
        },
      })
    }

    const goal = await db.goal.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ goal })
  } catch (error) {
    console.error('Error updating goal:', error)
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

    const goal = await db.goal.deleteMany({
      where: { id, userId: user.id },
    })

    if (goal.count === 0) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
