'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { generateAndSaveInsight } from '@/services/zeno-brain'

/**
 * Server action to complete an action item
 */
export async function completeAction(actionId: string) {
  const { userId } = await auth()

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    return { error: 'User not found' }
  }

  try {
    const action = await db.action.findFirst({
      where: { id: actionId, userId: user.id },
    })

    if (!action) {
      return { error: 'Action not found' }
    }

    await db.action.update({
      where: { id: actionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    })

    // Award XP
    await db.worldProgress.update({
      where: { userId: user.id },
      data: {
        currentXp: { increment: 25 },
        totalXp: { increment: 25 },
        actionsCompleted: { increment: 1 },
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/insights')

    return { success: true }
  } catch (error) {
    console.error('Error completing action:', error)
    return { error: 'Failed to complete action' }
  }
}

/**
 * Server action to dismiss an action item
 */
export async function dismissAction(actionId: string) {
  const { userId } = await auth()

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    return { error: 'User not found' }
  }

  try {
    await db.action.updateMany({
      where: { id: actionId, userId: user.id },
      data: {
        status: 'DISMISSED',
        dismissedAt: new Date(),
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/insights')

    return { success: true }
  } catch (error) {
    console.error('Error dismissing action:', error)
    return { error: 'Failed to dismiss action' }
  }
}

/**
 * Server action to generate new insight
 */
export async function generateInsight() {
  const { userId } = await auth()

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    return { error: 'User not found' }
  }

  try {
    // Check rate limit
    const lastInsight = await db.insight.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    if (lastInsight) {
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
      if (lastInsight.createdAt > hourAgo) {
        return { error: 'Please wait before generating a new insight' }
      }
    }

    const insight = await generateAndSaveInsight(user.id)

    revalidatePath('/dashboard')
    revalidatePath('/insights')

    return { success: true, insight }
  } catch (error) {
    console.error('Error generating insight:', error)
    return { error: 'Failed to generate insight' }
  }
}

/**
 * Server action to update goal progress
 */
export async function updateGoalProgress(goalId: string, amount: number) {
  const { userId } = await auth()

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    return { error: 'User not found' }
  }

  try {
    const goal = await db.goal.findFirst({
      where: { id: goalId, userId: user.id },
    })

    if (!goal) {
      return { error: 'Goal not found' }
    }

    const newAmount = goal.currentAmount + amount
    const isCompleted = newAmount >= goal.targetAmount

    await db.goal.update({
      where: { id: goalId },
      data: {
        currentAmount: newAmount,
        status: isCompleted ? 'COMPLETED' : 'ACTIVE',
        completedAt: isCompleted ? new Date() : null,
      },
    })

    if (isCompleted && goal.status === 'ACTIVE') {
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

    revalidatePath('/dashboard')
    revalidatePath('/goals')

    return { success: true }
  } catch (error) {
    console.error('Error updating goal:', error)
    return { error: 'Failed to update goal' }
  }
}

/**
 * Server action to mark bill as paid
 */
export async function markBillPaid(billId: string) {
  const { userId } = await auth()

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    return { error: 'User not found' }
  }

  try {
    const bill = await db.bill.findFirst({
      where: { id: billId, userId: user.id },
    })

    if (!bill) {
      return { error: 'Bill not found' }
    }

    // Calculate next due date based on frequency
    const nextDueDate = bill.nextDueDate ? new Date(bill.nextDueDate) : new Date()

    switch (bill.frequency) {
      case 'WEEKLY':
        nextDueDate.setDate(nextDueDate.getDate() + 7)
        break
      case 'BIWEEKLY':
        nextDueDate.setDate(nextDueDate.getDate() + 14)
        break
      case 'MONTHLY':
        nextDueDate.setMonth(nextDueDate.getMonth() + 1)
        break
      case 'QUARTERLY':
        nextDueDate.setMonth(nextDueDate.getMonth() + 3)
        break
      case 'YEARLY':
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1)
        break
    }

    await db.bill.update({
      where: { id: billId },
      data: { nextDueDate },
    })

    // Award small XP
    await db.worldProgress.update({
      where: { userId: user.id },
      data: {
        currentXp: { increment: 5 },
        totalXp: { increment: 5 },
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/bills')

    return { success: true }
  } catch (error) {
    console.error('Error marking bill paid:', error)
    return { error: 'Failed to mark bill as paid' }
  }
}

/**
 * Server action to add debt payment
 */
export async function addDebtPayment(debtId: string, amount: number) {
  const { userId } = await auth()

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    return { error: 'User not found' }
  }

  try {
    const debt = await db.debt.findFirst({
      where: { id: debtId, userId: user.id },
    })

    if (!debt) {
      return { error: 'Debt not found' }
    }

    const newBalance = Math.max(0, debt.currentBalance - amount)
    const isPaidOff = newBalance === 0

    await db.debt.update({
      where: { id: debtId },
      data: {
        currentBalance: newBalance,
        isPaidOff,
        paidOffDate: isPaidOff ? new Date() : null,
      },
    })

    if (isPaidOff && !debt.isPaidOff) {
      // Award XP for paying off debt
      await db.worldProgress.update({
        where: { userId: user.id },
        data: {
          currentXp: { increment: 200 },
          totalXp: { increment: 200 },
        },
      })

      // Create milestone
      const worldProgress = await db.worldProgress.findUnique({
        where: { userId: user.id },
      })

      if (worldProgress) {
        await db.worldMilestone.create({
          data: {
            worldProgressId: worldProgress.id,
            type: 'DEBT_FIRST_PAYOFF',
            name: `Paid Off ${debt.name}`,
            description: `Completely paid off ${debt.name}`,
          },
        })
      }
    }

    revalidatePath('/dashboard')
    revalidatePath('/debts')

    return { success: true }
  } catch (error) {
    console.error('Error adding debt payment:', error)
    return { error: 'Failed to add debt payment' }
  }
}
