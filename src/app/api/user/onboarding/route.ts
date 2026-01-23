import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const onboardingSchema = z.object({
  step: z.number().min(1).max(4),
  data: z.object({
    incomeFrequency: z.enum(['WEEKLY', 'BIWEEKLY', 'SEMIMONTHLY', 'MONTHLY', 'VARIABLE']).optional(),
    monthlyIncome: z.number().positive().optional(),
    primaryGoal: z.enum(['BUILD_SAVINGS', 'PAY_OFF_DEBT', 'TRACK_SPENDING', 'INVEST_MORE', 'REDUCE_BILLS']).optional(),
    mainStressPoint: z.enum(['UNCLEAR_PICTURE', 'TOO_MUCH_DEBT', 'NOT_SAVING_ENOUGH', 'BILLS_OVERWHELMING', 'NO_EMERGENCY_FUND', 'DISORGANIZED']).optional(),
    accounts: z.array(z.object({
      name: z.string(),
      type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD']),
      balance: z.number(),
    })).optional(),
  }),
})

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { step, data } = onboardingSchema.parse(body)

    // Update preferences based on step
    if (step === 1 && data.incomeFrequency && data.monthlyIncome) {
      await db.userPreferences.update({
        where: { userId: user.id },
        data: {
          incomeFrequency: data.incomeFrequency,
          monthlyIncome: data.monthlyIncome,
        },
      })
    }

    if (step === 2 && data.primaryGoal) {
      await db.userPreferences.update({
        where: { userId: user.id },
        data: {
          primaryGoal: data.primaryGoal,
        },
      })
    }

    if (step === 3 && data.mainStressPoint) {
      await db.userPreferences.update({
        where: { userId: user.id },
        data: {
          mainStressPoint: data.mainStressPoint,
        },
      })
    }

    if (step === 4 && data.accounts && data.accounts.length > 0) {
      // Create accounts
      await db.account.createMany({
        data: data.accounts.map((account) => ({
          userId: user.id,
          name: account.name,
          type: account.type,
          currentBalance: account.balance,
          isManual: true,
          includeInNet: true,
        })),
      })
    }

    // Update onboarding step
    await db.user.update({
      where: { id: user.id },
      data: {
        onboardingStep: step,
        onboardingCompleted: step === 4,
      },
    })

    // If onboarding complete, award XP and create first milestone
    if (step === 4) {
      await db.worldProgress.update({
        where: { userId: user.id },
        data: {
          currentXp: { increment: 50 },
          totalXp: { increment: 50 },
        },
      })

      const worldProgress = await db.worldProgress.findUnique({
        where: { userId: user.id },
      })

      if (worldProgress) {
        await db.worldMilestone.create({
          data: {
            worldProgressId: worldProgress.id,
            type: 'ONBOARDING_COMPLETE',
            name: 'Onboarding Complete',
            description: 'Completed the onboarding process',
          },
        })
      }
    }

    return NextResponse.json({ success: true, step })
  } catch (error) {
    console.error('Error in onboarding:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
