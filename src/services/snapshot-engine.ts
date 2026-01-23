import { db } from '@/lib/db'
import type { FinancialSnapshot, AccountSummary, BillSummary, DebtSummary, GoalSummary } from '@/types'

// Define local types to avoid Prisma dependency
type AccountRecord = {
  id: string
  name: string
  type: string
  currentBalance: number
  institution: string | null
  includeInNet: boolean
}

type TransactionRecord = {
  id: string
  amount: number
}

type DebtRecord = {
  id: string
  name: string
  currentBalance: number
  minimumPayment: number
  interestRate: number
}

type BillRecord = {
  id: string
  name: string
  amount: number
  nextDueDate: Date | null
}

type GoalRecord = {
  id: string
  name: string
  type: string
  currentAmount: number
  targetAmount: number
}

/**
 * Snapshot Engine - Generates complete financial snapshot for a user
 */
export class SnapshotEngine {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  async generateSnapshot(): Promise<FinancialSnapshot> {
    const [accounts, transactions, debts, bills, goals] = await Promise.all([
      this.getAccounts(),
      this.getRecentTransactions(),
      this.getDebts(),
      this.getBills(),
      this.getGoals(),
    ])

    const accountSummaries = this.summarizeAccounts(accounts as AccountRecord[])
    const cashFlow = this.calculateCashFlow(transactions as TransactionRecord[])
    const debtSummary = this.summarizeDebts(debts as DebtRecord[])
    const billSummaries = this.summarizeBills(bills as BillRecord[])
    const goalProgress = this.summarizeGoals(goals as GoalRecord[])

    const totalAssets = (accounts as AccountRecord[])
      .filter((a: AccountRecord) => a.currentBalance > 0 && a.includeInNet)
      .reduce((sum: number, a: AccountRecord) => sum + a.currentBalance, 0)

    const totalLiabilities = (accounts as AccountRecord[])
      .filter((a: AccountRecord) => a.currentBalance < 0 && a.includeInNet)
      .reduce((sum: number, a: AccountRecord) => sum + Math.abs(a.currentBalance), 0)

    return {
      netWorth: totalAssets - totalLiabilities,
      totalAssets,
      totalLiabilities,
      cashFlow,
      accounts: accountSummaries,
      upcomingBills: billSummaries,
      debtSummary,
      goalProgress,
    }
  }

  private async getAccounts() {
    return db.account.findMany({
      where: { userId: this.userId },
    })
  }

  private async getRecentTransactions() {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return db.transaction.findMany({
      where: {
        userId: this.userId,
        date: { gte: thirtyDaysAgo },
      },
    })
  }

  private async getDebts() {
    return db.debt.findMany({
      where: { userId: this.userId, isPaidOff: false },
    })
  }

  private async getBills() {
    return db.bill.findMany({
      where: { userId: this.userId, isActive: true },
    })
  }

  private async getGoals() {
    return db.goal.findMany({
      where: { userId: this.userId, status: 'ACTIVE' },
    })
  }

  private summarizeAccounts(accounts: AccountRecord[]): AccountSummary[] {
    return accounts.map((a: AccountRecord) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      balance: a.currentBalance,
      institution: a.institution || undefined,
    }))
  }

  private calculateCashFlow(transactions: TransactionRecord[]) {
    const income = transactions
      .filter((t: TransactionRecord) => t.amount > 0)
      .reduce((sum: number, t: TransactionRecord) => sum + t.amount, 0)

    const expenses = transactions
      .filter((t: TransactionRecord) => t.amount < 0)
      .reduce((sum: number, t: TransactionRecord) => sum + Math.abs(t.amount), 0)

    const savings = income - expenses
    const savingsRate = income > 0 ? savings / income : 0

    return { income, expenses, savings, savingsRate }
  }

  private summarizeDebts(debts: DebtRecord[]): DebtSummary {
    const totalDebt = debts.reduce((sum: number, d: DebtRecord) => sum + d.currentBalance, 0)
    const totalMinimumPayment = debts.reduce((sum: number, d: DebtRecord) => sum + d.minimumPayment, 0)
    const highestInterestRate = debts.length > 0 ? Math.max(...debts.map((d: DebtRecord) => d.interestRate)) : 0

    return {
      totalDebt,
      totalMinimumPayment,
      highestInterestRate,
      debts: debts.map((d: DebtRecord) => ({
        id: d.id,
        name: d.name,
        balance: d.currentBalance,
        rate: d.interestRate,
      })),
    }
  }

  private summarizeBills(bills: BillRecord[]): BillSummary[] {
    const now = new Date()

    return bills
      .filter((b: BillRecord) => b.nextDueDate)
      .map((b: BillRecord) => {
        const dueIn = Math.ceil(
          (new Date(b.nextDueDate!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )

        return {
          id: b.id,
          name: b.name,
          amount: b.amount,
          dueIn,
          isPaid: false,
        }
      })
      .filter((b: BillSummary) => b.dueIn >= 0 && b.dueIn <= 30)
      .sort((a: BillSummary, b: BillSummary) => a.dueIn - b.dueIn)
      .slice(0, 10)
  }

  private summarizeGoals(goals: GoalRecord[]): GoalSummary[] {
    return goals.map((g: GoalRecord) => ({
      id: g.id,
      name: g.name,
      type: g.type,
      current: g.currentAmount,
      target: g.targetAmount,
      progress: g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0,
    }))
  }
}

/**
 * Helper function to generate snapshot for a user
 */
export async function generateFinancialSnapshot(userId: string): Promise<FinancialSnapshot> {
  const engine = new SnapshotEngine(userId)
  return engine.generateSnapshot()
}
