import type { Metadata } from 'next'
import {
  Check,
  Flag,
  Pause,
  PiggyBank,
  Plane,
  Plus,
  Shield,
  Target,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn, formatCurrency, formatDate, daysUntil } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Goals',
  description: 'Track your financial goals',
}

// Demo goals
const goals = [
  {
    id: '1',
    name: 'Emergency Fund',
    type: 'EMERGENCY_FUND',
    targetAmount: 3000,
    currentAmount: 760,
    targetDate: new Date('2025-06-01'),
    status: 'ACTIVE',
    priority: 1,
  },
  {
    id: '2',
    name: 'Summer Vacation',
    type: 'TRAVEL',
    targetAmount: 2000,
    currentAmount: 450,
    targetDate: new Date('2025-08-01'),
    status: 'ACTIVE',
    priority: 2,
  },
  {
    id: '3',
    name: 'New Laptop',
    type: 'PURCHASE',
    targetAmount: 1500,
    currentAmount: 300,
    targetDate: new Date('2025-12-01'),
    status: 'ACTIVE',
    priority: 3,
  },
  {
    id: '4',
    name: 'Investment Account',
    type: 'INVESTMENT',
    targetAmount: 5000,
    currentAmount: 1200,
    targetDate: null,
    status: 'ACTIVE',
    priority: 4,
  },
  {
    id: '5',
    name: 'Holiday Gifts',
    type: 'SAVINGS',
    targetAmount: 500,
    currentAmount: 500,
    targetDate: new Date('2024-12-15'),
    status: 'COMPLETED',
    priority: 5,
  },
]

const goalTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  EMERGENCY_FUND: { icon: Shield, color: 'text-blue-500 bg-blue-500/10' },
  DEBT_PAYOFF: { icon: TrendingUp, color: 'text-orange-500 bg-orange-500/10' },
  SAVINGS: { icon: PiggyBank, color: 'text-green-500 bg-green-500/10' },
  INVESTMENT: { icon: TrendingUp, color: 'text-purple-500 bg-purple-500/10' },
  PURCHASE: { icon: Target, color: 'text-cyan-500 bg-cyan-500/10' },
  TRAVEL: { icon: Plane, color: 'text-pink-500 bg-pink-500/10' },
  OTHER: { icon: Flag, color: 'text-gray-500 bg-gray-500/10' },
}

export default function GoalsPage() {
  const activeGoals = goals.filter((g) => g.status === 'ACTIVE')
  const completedGoals = goals.filter((g) => g.status === 'COMPLETED')

  const totalTarget = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalSaved = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0)
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Goals
          </h1>
          <p className="text-muted-foreground">
            Track progress towards your financial goals.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Saved</p>
            <p className="text-2xl font-bold text-success mt-1">
              {formatCurrency(totalSaved)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              across {activeGoals.length} goals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Target Total</p>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(totalTarget)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(totalTarget - totalSaved)} to go
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="text-2xl font-bold mt-1">
              {Math.round(overallProgress)}%
            </p>
            <Progress value={overallProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Goals</CardTitle>
            <Badge variant="secondary">{activeGoals.length} active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeGoals.map((goal) => {
              const config = goalTypeConfig[goal.type] || goalTypeConfig.OTHER
              const Icon = config.icon
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const remaining = goal.targetAmount - goal.currentAmount
              const days = goal.targetDate ? daysUntil(goal.targetDate) : null

              return (
                <div
                  key={goal.id}
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
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{goal.name}</p>
                            <Badge variant="muted" className="text-2xs">
                              #{goal.priority}
                            </Badge>
                          </div>
                          {goal.targetDate && (
                            <p className="text-sm text-muted-foreground">
                              Target: {formatDate(goal.targetDate)}
                              {days !== null && days > 0 && (
                                <span className="ml-1">({days} days left)</span>
                              )}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {formatCurrency(goal.currentAmount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            of {formatCurrency(goal.targetAmount)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">
                          {Math.round(progress)}% complete
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(remaining)} to go
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1">
                      Add Funds
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Completed</CardTitle>
              <Badge variant="success">{completedGoals.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedGoals.map((goal) => {
                const config = goalTypeConfig[goal.type] || goalTypeConfig.OTHER
                const Icon = config.icon

                return (
                  <div
                    key={goal.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-success/5 border border-success/20"
                  >
                    <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
                      <Check className="h-4 w-4 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{goal.name}</p>
                    </div>
                    <p className="font-semibold text-success">
                      {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
