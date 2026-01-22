import { z } from 'zod'

// Account Validations
export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'LOAN', 'OTHER']),
  subtype: z.string().optional(),
  institution: z.string().optional(),
  currentBalance: z.number(),
  availableBalance: z.number().optional(),
  creditLimit: z.number().positive().optional(),
  includeInNet: z.boolean().default(true),
})

export const updateAccountSchema = createAccountSchema.partial()

// Transaction Validations
export const createTransactionSchema = z.object({
  accountId: z.string().cuid(),
  amount: z.number(),
  description: z.string().min(1, 'Description is required').max(255),
  merchantName: z.string().optional(),
  category: z.string().default('UNCATEGORIZED'),
  customCategory: z.string().optional(),
  date: z.coerce.date(),
  isRecurring: z.boolean().default(false),
})

export const updateTransactionSchema = createTransactionSchema.partial()

// Debt Validations
export const createDebtSchema = z.object({
  name: z.string().min(1, 'Debt name is required').max(100),
  type: z.enum(['CREDIT_CARD', 'STUDENT_LOAN', 'PERSONAL_LOAN', 'AUTO_LOAN', 'MORTGAGE', 'MEDICAL', 'OTHER']),
  lender: z.string().optional(),
  originalBalance: z.number().positive('Original balance must be positive'),
  currentBalance: z.number().min(0, 'Current balance cannot be negative'),
  interestRate: z.number().min(0).max(1, 'Interest rate should be between 0 and 1 (e.g., 0.15 for 15%)'),
  minimumPayment: z.number().min(0),
  dueDay: z.number().min(1).max(31).optional(),
  targetPayoffDate: z.coerce.date().optional(),
})

export const updateDebtSchema = createDebtSchema.partial()

// Bill Validations
export const createBillSchema = z.object({
  name: z.string().min(1, 'Bill name is required').max(100),
  category: z.enum(['HOUSING', 'UTILITIES', 'INSURANCE', 'PHONE', 'INTERNET', 'STREAMING', 'SOFTWARE', 'MEMBERSHIP', 'LOAN_PAYMENT', 'OTHER']),
  amount: z.number().positive('Amount must be positive'),
  frequency: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']).default('MONTHLY'),
  dueDay: z.number().min(1).max(31).optional(),
  nextDueDate: z.coerce.date().optional(),
  isSubscription: z.boolean().default(false),
  canCancel: z.boolean().default(true),
})

export const updateBillSchema = createBillSchema.partial()

// Goal Validations
export const createGoalSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(100),
  type: z.enum(['EMERGENCY_FUND', 'DEBT_PAYOFF', 'SAVINGS', 'INVESTMENT', 'PURCHASE', 'RETIREMENT', 'EDUCATION', 'TRAVEL', 'OTHER']),
  description: z.string().max(500).optional(),
  targetAmount: z.number().positive('Target amount must be positive'),
  currentAmount: z.number().min(0).default(0),
  targetDate: z.coerce.date().optional(),
  priority: z.number().min(1).max(10).default(5),
})

export const updateGoalSchema = createGoalSchema.partial()

// Action Validations
export const updateActionSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DISMISSED', 'EXPIRED']),
})

// User Preferences Validations
export const updatePreferencesSchema = z.object({
  incomeFrequency: z.enum(['WEEKLY', 'BIWEEKLY', 'SEMIMONTHLY', 'MONTHLY', 'VARIABLE']).optional(),
  primaryGoal: z.enum(['BUILD_SAVINGS', 'PAY_OFF_DEBT', 'TRACK_SPENDING', 'INVEST_MORE', 'REDUCE_BILLS']).optional(),
  mainStressPoint: z.enum(['UNCLEAR_PICTURE', 'TOO_MUCH_DEBT', 'NOT_SAVING_ENOUGH', 'BILLS_OVERWHELMING', 'NO_EMERGENCY_FUND', 'DISORGANIZED']).optional(),
  monthlyIncome: z.number().positive().optional(),
  theme: z.enum(['LIGHT', 'DARK', 'SYSTEM']).optional(),
  currency: z.string().length(3).optional(),
  showWorldLayer: z.boolean().optional(),
  emailDigest: z.boolean().optional(),
  actionReminders: z.boolean().optional(),
})

// Onboarding Validations
export const onboardingStep1Schema = z.object({
  incomeFrequency: z.enum(['WEEKLY', 'BIWEEKLY', 'SEMIMONTHLY', 'MONTHLY', 'VARIABLE']),
  monthlyIncome: z.number().positive('Monthly income is required'),
})

export const onboardingStep2Schema = z.object({
  primaryGoal: z.enum(['BUILD_SAVINGS', 'PAY_OFF_DEBT', 'TRACK_SPENDING', 'INVEST_MORE', 'REDUCE_BILLS']),
})

export const onboardingStep3Schema = z.object({
  mainStressPoint: z.enum(['UNCLEAR_PICTURE', 'TOO_MUCH_DEBT', 'NOT_SAVING_ENOUGH', 'BILLS_OVERWHELMING', 'NO_EMERGENCY_FUND', 'DISORGANIZED']),
})

export const onboardingAccountSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD']),
  balance: z.number(),
})

export const onboardingStep4Schema = z.object({
  accounts: z.array(onboardingAccountSchema).min(1, 'Add at least one account'),
})

// Type exports
export type CreateAccountInput = z.infer<typeof createAccountSchema>
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type CreateDebtInput = z.infer<typeof createDebtSchema>
export type UpdateDebtInput = z.infer<typeof updateDebtSchema>
export type CreateBillInput = z.infer<typeof createBillSchema>
export type UpdateBillInput = z.infer<typeof updateBillSchema>
export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>
