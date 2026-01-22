// Zeno Types - Core type definitions

// Note: Prisma types are available after running `npm run db:generate`
// Once Prisma client is generated, you can uncomment these exports:
// export type {
//   User,
//   UserPreferences,
//   Account,
//   Transaction,
//   Debt,
//   Bill,
//   Goal,
//   Insight,
//   Action,
//   WorldProgress,
//   WorldMilestone,
//   Subscription,
// } from '@prisma/client'

// Enums for client-side use
export const IncomeFrequency = {
  WEEKLY: 'WEEKLY',
  BIWEEKLY: 'BIWEEKLY',
  SEMIMONTHLY: 'SEMIMONTHLY',
  MONTHLY: 'MONTHLY',
  VARIABLE: 'VARIABLE',
} as const

export const PrimaryGoal = {
  BUILD_SAVINGS: 'BUILD_SAVINGS',
  PAY_OFF_DEBT: 'PAY_OFF_DEBT',
  TRACK_SPENDING: 'TRACK_SPENDING',
  INVEST_MORE: 'INVEST_MORE',
  REDUCE_BILLS: 'REDUCE_BILLS',
} as const

export const StressPoint = {
  UNCLEAR_PICTURE: 'UNCLEAR_PICTURE',
  TOO_MUCH_DEBT: 'TOO_MUCH_DEBT',
  NOT_SAVING_ENOUGH: 'NOT_SAVING_ENOUGH',
  BILLS_OVERWHELMING: 'BILLS_OVERWHELMING',
  NO_EMERGENCY_FUND: 'NO_EMERGENCY_FUND',
  DISORGANIZED: 'DISORGANIZED',
} as const

export const AccountType = {
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
  CREDIT_CARD: 'CREDIT_CARD',
  INVESTMENT: 'INVESTMENT',
  LOAN: 'LOAN',
  OTHER: 'OTHER',
} as const

export const TransactionCategory = {
  INCOME_SALARY: 'INCOME_SALARY',
  INCOME_FREELANCE: 'INCOME_FREELANCE',
  INCOME_INVESTMENT: 'INCOME_INVESTMENT',
  INCOME_OTHER: 'INCOME_OTHER',
  HOUSING_RENT: 'HOUSING_RENT',
  HOUSING_MORTGAGE: 'HOUSING_MORTGAGE',
  HOUSING_UTILITIES: 'HOUSING_UTILITIES',
  HOUSING_MAINTENANCE: 'HOUSING_MAINTENANCE',
  TRANSPORT_GAS: 'TRANSPORT_GAS',
  TRANSPORT_PUBLIC: 'TRANSPORT_PUBLIC',
  TRANSPORT_RIDESHARE: 'TRANSPORT_RIDESHARE',
  TRANSPORT_MAINTENANCE: 'TRANSPORT_MAINTENANCE',
  TRANSPORT_INSURANCE: 'TRANSPORT_INSURANCE',
  FOOD_GROCERIES: 'FOOD_GROCERIES',
  FOOD_DINING: 'FOOD_DINING',
  FOOD_DELIVERY: 'FOOD_DELIVERY',
  HEALTH_INSURANCE: 'HEALTH_INSURANCE',
  HEALTH_MEDICAL: 'HEALTH_MEDICAL',
  HEALTH_FITNESS: 'HEALTH_FITNESS',
  ENTERTAINMENT_STREAMING: 'ENTERTAINMENT_STREAMING',
  ENTERTAINMENT_GAMES: 'ENTERTAINMENT_GAMES',
  ENTERTAINMENT_EVENTS: 'ENTERTAINMENT_EVENTS',
  ENTERTAINMENT_OTHER: 'ENTERTAINMENT_OTHER',
  SHOPPING_CLOTHING: 'SHOPPING_CLOTHING',
  SHOPPING_ELECTRONICS: 'SHOPPING_ELECTRONICS',
  SHOPPING_HOME: 'SHOPPING_HOME',
  SHOPPING_OTHER: 'SHOPPING_OTHER',
  FINANCIAL_TRANSFER: 'FINANCIAL_TRANSFER',
  FINANCIAL_FEES: 'FINANCIAL_FEES',
  FINANCIAL_INVESTMENT: 'FINANCIAL_INVESTMENT',
  SUBSCRIPTION: 'SUBSCRIPTION',
  DEBT_PAYMENT: 'DEBT_PAYMENT',
  SAVINGS_TRANSFER: 'SAVINGS_TRANSFER',
  UNCATEGORIZED: 'UNCATEGORIZED',
  OTHER: 'OTHER',
} as const

export const DebtType = {
  CREDIT_CARD: 'CREDIT_CARD',
  STUDENT_LOAN: 'STUDENT_LOAN',
  PERSONAL_LOAN: 'PERSONAL_LOAN',
  AUTO_LOAN: 'AUTO_LOAN',
  MORTGAGE: 'MORTGAGE',
  MEDICAL: 'MEDICAL',
  OTHER: 'OTHER',
} as const

export const GoalType = {
  EMERGENCY_FUND: 'EMERGENCY_FUND',
  DEBT_PAYOFF: 'DEBT_PAYOFF',
  SAVINGS: 'SAVINGS',
  INVESTMENT: 'INVESTMENT',
  PURCHASE: 'PURCHASE',
  RETIREMENT: 'RETIREMENT',
  EDUCATION: 'EDUCATION',
  TRAVEL: 'TRAVEL',
  OTHER: 'OTHER',
} as const

export const ActionStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  DISMISSED: 'DISMISSED',
  EXPIRED: 'EXPIRED',
} as const

export const ActionImpact = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const

// Zeno Brain Types
export interface ZenoInsightOutput {
  summary: string
  watchOuts: string[]
  weekPlan: WeekPlanItem[] | null
  actions: ZenoActionSuggestion[]
  confidence: number
}

export interface WeekPlanItem {
  day: string
  action: string
}

export interface ZenoActionSuggestion {
  title: string
  description: string
  whyItMatters: string
  estimatedImpact: keyof typeof ActionImpact
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  timeToComplete: string
  priority: number
}

// Financial Snapshot Types
export interface FinancialSnapshot {
  netWorth: number
  totalAssets: number
  totalLiabilities: number
  cashFlow: {
    income: number
    expenses: number
    savings: number
    savingsRate: number
  }
  accounts: AccountSummary[]
  upcomingBills: BillSummary[]
  debtSummary: DebtSummary
  goalProgress: GoalSummary[]
}

export interface AccountSummary {
  id: string
  name: string
  type: string
  balance: number
  institution?: string
}

export interface BillSummary {
  id: string
  name: string
  amount: number
  dueIn: number
  isPaid: boolean
}

export interface DebtSummary {
  totalDebt: number
  totalMinimumPayment: number
  highestInterestRate: number
  debts: {
    id: string
    name: string
    balance: number
    rate: number
  }[]
}

export interface GoalSummary {
  id: string
  name: string
  type: string
  current: number
  target: number
  progress: number
}

// World Layer Types
export interface WorldModuleStatus {
  level: number
  status: 'online' | 'upgrading' | 'initializing' | 'offline'
  progress: number
}

export interface WorldModules {
  stability: WorldModuleStatus
  efficiency: WorldModuleStatus
  capacity: WorldModuleStatus
  security: WorldModuleStatus
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
