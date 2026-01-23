import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const worldProgress = await db.worldProgress.findUnique({
      where: { userId: user.id },
      include: {
        milestones: {
          orderBy: { achievedAt: 'desc' },
        },
      },
    })

    if (!worldProgress) {
      return NextResponse.json({ error: 'World progress not found' }, { status: 404 })
    }

    return NextResponse.json({ worldProgress })
  } catch (error) {
    console.error('Error fetching world progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update streak (called daily)
export async function POST() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const worldProgress = await db.worldProgress.findUnique({
      where: { userId: user.id },
    })

    if (!worldProgress) {
      return NextResponse.json({ error: 'World progress not found' }, { status: 404 })
    }

    // Update streak
    const newStreak = worldProgress.streakDays + 1
    const newLongestStreak = Math.max(worldProgress.longestStreak, newStreak)

    // Check for streak milestones
    const milestoneChecks = [
      { days: 7, type: 'STREAK_7_DAYS', name: '7-Day Streak' },
      { days: 30, type: 'STREAK_30_DAYS', name: '30-Day Streak' },
      { days: 90, type: 'STREAK_90_DAYS', name: '90-Day Streak' },
    ]

    for (const check of milestoneChecks) {
      if (newStreak === check.days) {
        const existingMilestone = await db.worldMilestone.findFirst({
          where: {
            worldProgressId: worldProgress.id,
            type: check.type as any,
          },
        })

        if (!existingMilestone) {
          await db.worldMilestone.create({
            data: {
              worldProgressId: worldProgress.id,
              type: check.type as any,
              name: check.name,
              description: `Logged in for ${check.days} consecutive days`,
            },
          })
        }
      }
    }

    // Update progress
    const updated = await db.worldProgress.update({
      where: { userId: user.id },
      data: {
        streakDays: newStreak,
        longestStreak: newLongestStreak,
        currentXp: { increment: 5 }, // Daily XP
        totalXp: { increment: 5 },
      },
      include: {
        milestones: true,
      },
    })

    return NextResponse.json({ worldProgress: updated })
  } catch (error) {
    console.error('Error updating streak:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
