import type { Metadata } from 'next'
import { Suspense } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  PiggyBank,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatCurrency } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your financial command center',
}

// Demo data - in production this would come from the database
const demoData = {
  netWorth: 12450,
  netWorthChange: 2.4,
  cashFlow: {
    income: 5200,
    expenses: 3800,
    savings: 1400,
  },
  accounts: [
    { name: 'Checking', balance: 3240, type: 'checking' },
    { name: 'Savings', balance: 8500, type: 'savings' },
    { name: 'Credit Card', balance: -1290, type: 'credit' },
  ],
  actions: [
    {
      id: '1',
      title: 'Set up emergency fund goal',
      description: "You're close to having $1,000 saved. Let's make it official.",
      impact: 'HIGH',
      time: '2 min',
    },
    {
      id: '2',
      title: 'Review streaming subscriptions',
      description: "You have 4 streaming services totaling $52/month.",
      impact: 'MEDIUM',
      time: '5 min',
    },
    {
      id: '3',
      title: 'Pay credit card before due date',
      description: 'Due in 5 days. Paying in full saves $18 in interest.',
      impact: 'HIGH',
      time: '3 min',
    },
  ],
  insight: {
    summary:
      "You're building momentum. This month you've saved 27% of your income, which is above average. Your credit card balance is manageable at 15% utilization. Focus on building your emergency fund to $1,000 this month—you're just $240 away.",
    confidence: 0.92,
  },
  goals: [
    { name: 'Emergency Fund', current: 760, target: 1000, progress: 76 },
    { name: 'Vacation', current: 450, target: 2000, progress: 22.5 },
  ],
  upcomingBills: [
    { name: 'Rent', amount: 1400, dueIn: 8 },
    { name: 'Electric', amount: 85, dueIn: 12 },
    { name: 'Phone', amount: 45, dueIn: 15 },
  ],
}

export default function DashboardPage() {
  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Good morning
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s your financial snapshot for today.
          </p>
        </div>
        <Button>
          <Sparkles className="h-4 w-4" />
          New Insight
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Net Worth"
          value={formatCurrency(demoData.netWorth)}
          change={demoData.netWorthChange}
          icon={Wallet}
        />
        <MetricCard
          title="Monthly Income"
          value={formatCurrency(demoData.cashFlow.income)}
          icon={ArrowUpRight}
          iconColor="text-success"
        />
        <MetricCard
          title="Monthly Expenses"
          value={formatCurrency(demoData.cashFlow.expenses)}
          icon={ArrowDownRight}
          iconColor="text-destructive"
        />
        <MetricCard
          title="Savings This Month"
          value={formatCurrency(demoData.cashFlow.savings)}
          subtext="27% of income"
          icon={PiggyBank}
          iconColor="text-success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Actions & Insight */}
        <div className="lg:col-span-2 space-y-6">
          {/* Zeno Insight */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Zeno Insight</CardTitle>
                <Badge variant="secondary" className="ml-auto text-2xs">
                  {Math.round(demoData.insight.confidence * 100)}% confidence
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{demoData.insight.summary}</p>
            </CardContent>
          </Card>

          {/* Action Queue */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Your Next Actions</CardTitle>
                <Button variant="ghost" size="sm">
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoData.actions.map((action) => (
                <ActionCard key={action.id} action={action} />
              ))}
            </CardContent>
          </Card>

          {/* Accounts Overview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Accounts</CardTitle>
                <Button variant="ghost" size="sm">
                  Manage
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoData.accounts.map((account) => (
                  <div
                    key={account.name}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-9 w-9 rounded-lg flex items-center justify-center',
                          account.type === 'credit'
                            ? 'bg-destructive/10'
                            : 'bg-primary/10'
                        )}
                      >
                        {account.type === 'credit' ? (
                          <CreditCard className="h-4 w-4 text-destructive" />
                        ) : account.type === 'savings' ? (
                          <PiggyBank className="h-4 w-4 text-primary" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <span className="font-medium">{account.name}</span>
                    </div>
                    <span
                      className={cn(
                        'font-semibold',
                        account.balance < 0 && 'text-destructive'
                      )}
                    >
                      {formatCurrency(account.balance)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Goals & Bills */}
        <div className="space-y-6">
          {/* Goals */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Goals</CardTitle>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoData.goals.map((goal) => (
                <div key={goal.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Bills */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Upcoming Bills</CardTitle>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoData.upcomingBills.map((bill) => (
                  <div
                    key={bill.name}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium">{bill.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Due in {bill.dueIn} days
                      </p>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(bill.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Actions completed
                </span>
                <span className="font-semibold">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Day streak
                </span>
                <span className="font-semibold">12 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Savings rate
                </span>
                <span className="font-semibold text-success">27%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  subtext,
  icon: Icon,
  iconColor,
}: {
  title: string
  value: string
  change?: number
  subtext?: string
  icon: React.ElementType
  iconColor?: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change !== undefined && (
              <div
                className={cn(
                  'flex items-center gap-1 text-sm mt-1',
                  change >= 0 ? 'text-success' : 'text-destructive'
                )}
              >
                <TrendingUp
                  className={cn('h-3 w-3', change < 0 && 'rotate-180')}
                />
                <span>{Math.abs(change)}% this month</span>
              </div>
            )}
            {subtext && (
              <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
            )}
          </div>
          <div
            className={cn(
              'h-10 w-10 rounded-lg flex items-center justify-center bg-secondary',
              iconColor
            )}
          >
            <Icon className={cn('h-5 w-5', iconColor || 'text-foreground')} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActionCard({
  action,
}: {
  action: {
    id: string
    title: string
    description: string
    impact: string
    time: string
  }
}) {
  return (
    <div className="flex gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer group">
      <button className="flex-shrink-0 h-6 w-6 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary transition-colors flex items-center justify-center">
        <CheckCircle2 className="h-4 w-4 text-transparent group-hover:text-primary/50" />
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{action.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {action.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge
            variant={action.impact === 'HIGH' ? 'default' : 'secondary'}
            className="text-2xs"
          >
            {action.impact} impact
          </Badge>
          <span className="text-2xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {action.time}
          </span>
        </div>
      </div>
    </div>
  )
}
