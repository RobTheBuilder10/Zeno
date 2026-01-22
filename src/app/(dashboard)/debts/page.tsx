import type { Metadata } from 'next'
import {
  CreditCard,
  GraduationCap,
  Car,
  Home,
  Plus,
  TrendingDown,
  Calendar,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn, formatCurrency, formatPercentage } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Debts',
  description: 'Track and pay off your debts',
}

// Demo debts
const debts = [
  {
    id: '1',
    name: 'Chase Sapphire',
    type: 'CREDIT_CARD',
    lender: 'Chase',
    originalBalance: 3500,
    currentBalance: 1290.45,
    interestRate: 0.1999,
    minimumPayment: 35,
    dueDay: 15,
  },
  {
    id: '2',
    name: 'Student Loan',
    type: 'STUDENT_LOAN',
    lender: 'Navient',
    originalBalance: 28000,
    currentBalance: 18450,
    interestRate: 0.055,
    minimumPayment: 280,
    dueDay: 1,
  },
  {
    id: '3',
    name: 'Car Loan',
    type: 'AUTO_LOAN',
    lender: 'Capital One',
    originalBalance: 18000,
    currentBalance: 12340,
    interestRate: 0.0649,
    minimumPayment: 320,
    dueDay: 20,
  },
]

const debtTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  CREDIT_CARD: { icon: CreditCard, color: 'text-orange-500 bg-orange-500/10' },
  STUDENT_LOAN: { icon: GraduationCap, color: 'text-blue-500 bg-blue-500/10' },
  AUTO_LOAN: { icon: Car, color: 'text-purple-500 bg-purple-500/10' },
  PERSONAL_LOAN: { icon: DollarSign, color: 'text-green-500 bg-green-500/10' },
  MORTGAGE: { icon: Home, color: 'text-cyan-500 bg-cyan-500/10' },
  MEDICAL: { icon: Plus, color: 'text-red-500 bg-red-500/10' },
  OTHER: { icon: DollarSign, color: 'text-gray-500 bg-gray-500/10' },
}

export default function DebtsPage() {
  const totalDebt = debts.reduce((sum, d) => sum + d.currentBalance, 0)
  const totalMinPayment = debts.reduce((sum, d) => sum + d.minimumPayment, 0)
  const totalOriginal = debts.reduce((sum, d) => sum + d.originalBalance, 0)
  const totalPaid = totalOriginal - totalDebt
  const overallProgress = (totalPaid / totalOriginal) * 100

  // Calculate weighted average interest rate
  const weightedRate =
    debts.reduce((sum, d) => sum + d.interestRate * d.currentBalance, 0) / totalDebt

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Debt Payoff
          </h1>
          <p className="text-muted-foreground">
            Track your progress to debt freedom.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Debt
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Debt</p>
            <p className="text-2xl font-bold text-destructive mt-1">
              {formatCurrency(totalDebt)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Paid Off</p>
            <p className="text-2xl font-bold text-success mt-1">
              {formatCurrency(totalPaid)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Monthly Minimum</p>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(totalMinPayment)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Avg Interest Rate</p>
            <p className="text-2xl font-bold mt-1">
              {formatPercentage(weightedRate, 1)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Overall Progress</CardTitle>
            <span className="text-sm text-muted-foreground">
              {Math.round(overallProgress)}% paid off
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{formatCurrency(totalPaid)} paid</span>
            <span>{formatCurrency(totalDebt)} remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Debt List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Debts</CardTitle>
            <Badge variant="secondary">{debts.length} active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {debts.map((debt) => {
              const config = debtTypeConfig[debt.type] || debtTypeConfig.OTHER
              const Icon = config.icon
              const progress =
                ((debt.originalBalance - debt.currentBalance) /
                  debt.originalBalance) *
                100

              return (
                <div
                  key={debt.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0',
                        config.color
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">{debt.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {debt.lender}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {formatCurrency(debt.currentBalance)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            of {formatCurrency(debt.originalBalance)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <TrendingDown className="h-3 w-3" />
                          <span>{formatPercentage(debt.interestRate)} APR</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="h-3 w-3" />
                          <span>{formatCurrency(debt.minimumPayment)}/mo min</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Due {debt.dueDay}th</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payoff Strategy */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            Recommended Payoff Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Based on your debts, we recommend the <strong>Avalanche Method</strong> -
            paying off your highest interest debt first (Chase Sapphire at 19.99% APR)
            while making minimum payments on others. This saves you the most money in interest.
          </p>
          <div className="flex items-center gap-2">
            <Badge>Chase Sapphire</Badge>
            <span className="text-sm text-muted-foreground">Focus extra payments here</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
