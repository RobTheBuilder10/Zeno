import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateActionSchema } from '@/lib/validations'

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
    const validated = updateActionSchema.parse(body)

    const existing = await db.action.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = { ...validated }

    // Set completion/dismissal timestamps
    if (validated.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      updateData.completedAt = new Date()

      // Award XP for completing action
      await db.worldProgress.update({
        where: { userId: user.id },
        data: {
          currentXp: { increment: 25 },
          totalXp: { increment: 25 },
          actionsCompleted: { increment: 1 },
        },
      })
    }

    if (validated.status === 'DISMISSED' && existing.status !== 'DISMISSED') {
      updateData.dismissedAt = new Date()
    }

    const action = await db.action.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ action })
  } catch (error) {
    console.error('Error updating action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
