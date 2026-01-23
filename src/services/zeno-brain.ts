import { db } from '@/lib/db'
import { generateFinancialSnapshot } from './snapshot-engine'
import type { ZenoInsightOutput, ZenoActionSuggestion, WeekPlanItem, FinancialSnapshot } from '@/types'

/**
 * Zeno Brain - AI-powered financial insights and recommendations
 *
 * In production, this would integrate with an LLM API (OpenAI, Anthropic, etc.)
 * For MVP, we use rule-based logic to generate insights
 */
export class ZenoBrain {
  private userId: string
  private snapshot: FinancialSnapshot | null = null

  constructor(userId: string) {
    this.userId = userId
  }

  async generateInsight(): Promise<ZenoInsightOutput> {
    this.snapshot = await generateFinancialSnapshot(this.userId)

    const summary = this.generateSummary()
    const watchOuts = this.identifyWatchOuts()
    const actions = this.generateActions()
    const weekPlan = this.generateWeekPlan()
    const confidence = this.calculateConfidence()

    return {
      summary,
      watchOuts,
      actions,
      weekPlan,
      confidence,
    }
  }

  private generateSummary(): string {
    if (!this.snapshot) return ''

    const { netWorth, cashFlow, debtSummary, goalProgress } = this.snapshot
    const parts: string[] = []

    // Net worth assessment
    if (netWorth > 0) {
      parts.push(`Your net worth is ${this.formatCurrency(netWorth)}, which is a solid foundation.`)
    } else {
      parts.push(`Your current net worth is ${this.formatCurrency(netWorth)}. Building positive equity should be a priority.`)
    }

    // Cash flow assessment
    if (cashFlow.savingsRate >= 0.20) {
      parts.push(`You're saving ${this.formatPercent(cashFlow.savingsRate)} of your income, which is excellent.`)
    } else if (cashFlow.savingsRate >= 0.10) {
      parts.push(`You're saving ${this.formatPercent(cashFlow.savingsRate)} of your income. Consider increasing to 20% if possible.`)
    } else if (cashFlow.savingsRate > 0) {
      parts.push(`You're saving ${this.formatPercent(cashFlow.savingsRate)} of your income. Finding ways to increase this will help build security.`)
    } else {
      parts.push(`You're currently spending more than you earn. Identifying areas to cut back will help stabilize your finances.`)
    }

    // Debt assessment
    if (debtSummary.totalDebt > 0) {
      if (debtSummary.highestInterestRate > 0.15) {
        parts.push(`You have high-interest debt at ${this.formatPercent(debtSummary.highestInterestRate)} APR. Prioritizing this can save significant money.`)
      } else {
        parts.push(`Your debt levels are manageable with a total of ${this.formatCurrency(debtSummary.totalDebt)}.`)
      }
    }

    // Goals assessment
    if (goalProgress.length > 0) {
      const topGoal = goalProgress[0]
      if (topGoal.progress >= 75) {
        parts.push(`You're ${Math.round(topGoal.progress)}% towards your "${topGoal.name}" goal - almost there!`)
      } else if (topGoal.progress >= 25) {
        parts.push(`Good progress on your "${topGoal.name}" goal at ${Math.round(topGoal.progress)}%.`)
      }
    }

    return parts.join(' ')
  }

  private identifyWatchOuts(): string[] {
    if (!this.snapshot) return []

    const watchOuts: string[] = []
    const { cashFlow, debtSummary, upcomingBills } = this.snapshot

    // High credit utilization
    const creditAccounts = this.snapshot.accounts.filter((a) => a.type === 'CREDIT_CARD')
    // Note: We'd need credit limit data to calculate utilization properly

    // Spending more than earning
    if (cashFlow.savingsRate < 0) {
      watchOuts.push('You spent more than you earned this month. Review recent expenses for opportunities to cut back.')
    }

    // High interest debt
    if (debtSummary.highestInterestRate > 0.20) {
      watchOuts.push(`You have debt at ${this.formatPercent(debtSummary.highestInterestRate)} APR. Paying this off quickly should be a priority.`)
    }

    // Upcoming bills
    const urgentBills = upcomingBills.filter((b) => b.dueIn <= 5)
    if (urgentBills.length > 0) {
      const total = urgentBills.reduce((sum, b) => sum + b.amount, 0)
      watchOuts.push(`${urgentBills.length} bill(s) totaling ${this.formatCurrency(total)} due within 5 days.`)
    }

    // No emergency fund (check for emergency fund goal)
    const emergencyGoal = this.snapshot.goalProgress.find((g) => g.type === 'EMERGENCY_FUND')
    if (!emergencyGoal || emergencyGoal.current < 500) {
      watchOuts.push('Consider building an emergency fund to cover unexpected expenses.')
    }

    return watchOuts.slice(0, 2) // Max 2 watch-outs
  }

  private generateActions(): ZenoActionSuggestion[] {
    if (!this.snapshot) return []

    const actions: ZenoActionSuggestion[] = []
    const { cashFlow, debtSummary, goalProgress, upcomingBills } = this.snapshot

    // Action: Pay upcoming bills
    const urgentBills = upcomingBills.filter((b) => b.dueIn <= 7 && b.dueIn > 0)
    if (urgentBills.length > 0) {
      const nextBill = urgentBills[0]
      actions.push({
        title: `Pay ${nextBill.name} bill`,
        description: `Due in ${nextBill.dueIn} days. Amount: ${this.formatCurrency(nextBill.amount)}`,
        whyItMatters: 'Paying on time avoids late fees and maintains good credit.',
        estimatedImpact: 'HIGH',
        difficulty: 'EASY',
        timeToComplete: '5 min',
        priority: 1,
      })
    }

    // Action: High-interest debt payoff
    const highInterestDebt = debtSummary.debts.find((d) => d.rate > 0.15)
    if (highInterestDebt) {
      actions.push({
        title: `Make extra payment on ${highInterestDebt.name}`,
        description: `Balance: ${this.formatCurrency(highInterestDebt.balance)} at ${this.formatPercent(highInterestDebt.rate)} APR`,
        whyItMatters: 'Extra payments save money on interest and accelerate payoff.',
        estimatedImpact: 'HIGH',
        difficulty: 'MEDIUM',
        timeToComplete: '10 min',
        priority: 2,
      })
    }

    // Action: Set up emergency fund goal
    const emergencyGoal = goalProgress.find((g) => g.type === 'EMERGENCY_FUND')
    if (!emergencyGoal) {
      actions.push({
        title: 'Create an emergency fund goal',
        description: 'Start with a goal of $1,000 to cover unexpected expenses.',
        whyItMatters: 'An emergency fund prevents debt when surprises happen.',
        estimatedImpact: 'HIGH',
        difficulty: 'EASY',
        timeToComplete: '2 min',
        priority: 3,
      })
    }

    // Action: Review subscriptions
    if (cashFlow.expenses > cashFlow.income * 0.8) {
      actions.push({
        title: 'Review recurring subscriptions',
        description: 'Look for subscriptions you may not be using regularly.',
        whyItMatters: 'Cutting unused subscriptions frees up money for goals.',
        estimatedImpact: 'MEDIUM',
        difficulty: 'EASY',
        timeToComplete: '15 min',
        priority: 4,
      })
    }

    // Action: Increase savings rate
    if (cashFlow.savingsRate < 0.10 && cashFlow.savingsRate >= 0) {
      actions.push({
        title: 'Set up automatic savings transfer',
        description: 'Automate a weekly transfer to savings, even $25 helps.',
        whyItMatters: 'Automating savings makes it consistent and effortless.',
        estimatedImpact: 'MEDIUM',
        difficulty: 'EASY',
        timeToComplete: '10 min',
        priority: 5,
      })
    }

    return actions.slice(0, 3) // Max 3 actions
  }

  private generateWeekPlan(): WeekPlanItem[] {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const genericActions = [
      'Review your pending actions in Zeno',
      'Check account balances',
      'Log any cash transactions',
      'Review recent spending',
      'Check for any upcoming bills',
      'Review progress on goals',
      'Plan finances for next week',
    ]

    return days.map((day, index) => ({
      day,
      action: genericActions[index],
    }))
  }

  private calculateConfidence(): number {
    if (!this.snapshot) return 0.5

    let confidence = 0.6 // Base confidence

    // More accounts = higher confidence
    if (this.snapshot.accounts.length >= 2) confidence += 0.1
    if (this.snapshot.accounts.length >= 4) confidence += 0.05

    // Goals set = higher confidence
    if (this.snapshot.goalProgress.length > 0) confidence += 0.1

    // Recent transactions = higher confidence
    // (We'd check transaction count here in real implementation)
    confidence += 0.1

    return Math.min(confidence, 0.95)
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  private formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`
  }
}

/**
 * Generate and save an insight for a user
 */
export async function generateAndSaveInsight(userId: string) {
  const brain = new ZenoBrain(userId)
  const output = await brain.generateInsight()

  // Save insight
  const insight = await db.insight.create({
    data: {
      userId,
      summary: output.summary,
      watchOuts: output.watchOuts,
      weekPlan: output.weekPlan,
      dataSnapshot: await generateFinancialSnapshot(userId),
      confidence: output.confidence,
    },
  })

  // Create actions
  if (output.actions.length > 0) {
    await db.action.createMany({
      data: output.actions.map((action) => ({
        userId,
        insightId: insight.id,
        title: action.title,
        description: action.description,
        whyItMatters: action.whyItMatters,
        estimatedImpact: action.estimatedImpact,
        difficulty: action.difficulty,
        timeToComplete: action.timeToComplete,
        status: 'PENDING',
        priority: action.priority,
      })),
    })
  }

  // Award XP for generating insight
  await db.worldProgress.update({
    where: { userId },
    data: {
      currentXp: { increment: 10 },
      totalXp: { increment: 10 },
    },
  })

  // Fetch complete insight with actions
  return db.insight.findUnique({
    where: { id: insight.id },
    include: { actions: true },
  })
}
