import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { createGoalSchema } from '@/lib/validations'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const goals = await db.goal.findMany({
      where: { userId: user.id },
      orderBy: [{ status: 'asc' }, { priority: 'asc' }, { createdAt: 'desc' }],
    })

    // Calculate summary
    type GoalRecord = { status: string; targetAmount: number; currentAmount: number }
    const activeGoals = goals.filter((g: GoalRecord) => g.status === 'ACTIVE')
    const totalTarget = activeGoals.reduce((sum: number, g: GoalRecord) => sum + g.targetAmount, 0)
    const totalSaved = activeGoals.reduce((sum: number, g: GoalRecord) => sum + g.currentAmount, 0)
    const completedGoals = goals.filter((g: GoalRecord) => g.status === 'COMPLETED')

    return NextResponse.json({
      goals,
      summary: {
        totalTarget,
        totalSaved,
        overallProgress: totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0,
        activeCount: activeGoals.length,
        completedCount: completedGoals.length,
      },
    })
  } catch (error) {
    console.error('Error fetching goals:', error)
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
    const validated = createGoalSchema.parse(body)

    const goal = await db.goal.create({
      data: {
        userId: user.id,
        ...validated,
        status: 'ACTIVE',
      },
    })

    return NextResponse.json({ goal }, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
