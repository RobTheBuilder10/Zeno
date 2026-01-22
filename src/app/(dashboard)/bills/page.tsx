import type { Metadata } from 'next'
import {
  AlertCircle,
  Calendar,
  Check,
  Home,
  Lightbulb,
  Monitor,
  Phone,
  Plus,
  Shield,
  Wifi,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn, formatCurrency } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Bills',
  description: 'Track and manage your recurring bills',
}

// Demo bills
const bills = [
  {
    id: '1',
    name: 'Rent',
    category: 'HOUSING',
    amount: 1400,
    dueDay: 1,
    nextDueDate: new Date('2025-02-01'),
    isSubscription: false,
    isPaid: false,
  },
  {
    id: '2',
    name: 'Electric',
    category: 'UTILITIES',
    amount: 85,
    dueDay: 15,
    nextDueDate: new Date('2025-01-26'),
    isSubscription: false,
    isPaid: false,
  },
  {
    id: '3',
    name: 'Internet',
    category: 'INTERNET',
    amount: 65,
    dueDay: 20,
    nextDueDate: new Date('2025-01-20'),
    isSubscription: true,
    isPaid: true,
  },
  {
    id: '4',
    name: 'Phone',
    category: 'PHONE',
    amount: 45,
    dueDay: 22,
    nextDueDate: new Date('2025-01-22'),
    isSubscription: true,
    isPaid: false,
  },
  {
    id: '5',
    name: 'Car Insurance',
    category: 'INSURANCE',
    amount: 120,
    dueDay: 5,
    nextDueDate: new Date('2025-02-05'),
    isSubscription: true,
    isPaid: false,
  },
  {
    id: '6',
    name: 'Netflix',
    category: 'STREAMING',
    amount: 15.99,
    dueDay: 14,
    nextDueDate: new Date('2025-02-14'),
    isSubscription: true,
    isPaid: false,
  },
  {
    id: '7',
    name: 'Spotify',
    category: 'STREAMING',
    amount: 9.99,
    dueDay: 10,
    nextDueDate: new Date('2025-02-10'),
    isSubscription: true,
    isPaid: false,
  },
]

const categoryIcons: Record<string, React.ElementType> = {
  HOUSING: Home,
  UTILITIES: Lightbulb,
  INTERNET: Wifi,
  PHONE: Phone,
  INSURANCE: Shield,
  STREAMING: Monitor,
}

function daysUntil(date: Date): number {
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default function BillsPage() {
  const totalMonthly = bills.reduce((sum, bill) => sum + bill.amount, 0)
  const subscriptions = bills.filter((b) => b.isSubscription)
  const subscriptionTotal = subscriptions.reduce((sum, b) => sum + b.amount, 0)

  const upcomingBills = bills
    .filter((b) => !b.isPaid)
    .sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime())
    .slice(0, 5)

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Bills & Subscriptions
          </h1>
          <p className="text-muted-foreground">
            Never miss a payment again.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Bill
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Monthly Bills</p>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(totalMonthly)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {bills.length} recurring bills
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Subscriptions</p>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(subscriptionTotal)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {subscriptions.length} active subscriptions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Due This Week</p>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(
                upcomingBills
                  .filter((b) => daysUntil(b.nextDueDate) <= 7)
                  .reduce((sum, b) => sum + b.amount, 0)
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {upcomingBills.filter((b) => daysUntil(b.nextDueDate) <= 7).length} bills
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bills */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Bills</CardTitle>
            <Badge variant="secondary">{upcomingBills.length} due</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingBills.map((bill) => {
              const days = daysUntil(bill.nextDueDate)
              const Icon = categoryIcons[bill.category] || AlertCircle
              const isUrgent = days <= 3

              return (
                <div
                  key={bill.id}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-lg border transition-colors',
                    isUrgent ? 'border-warning/50 bg-warning/5' : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center',
                    isUrgent ? 'bg-warning/10' : 'bg-secondary'
                  )}>
                    <Icon className={cn('h-5 w-5', isUrgent && 'text-warning')} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{bill.name}</p>
                      {bill.isSubscription && (
                        <Badge variant="muted" className="text-2xs">
                          Subscription
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {days === 0
                          ? 'Due today'
                          : days === 1
                          ? 'Due tomorrow'
                          : `Due in ${days} days`}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(bill.amount)}</p>
                  </div>

                  <Button variant="outline" size="sm">
                    <Check className="h-4 w-4" />
                    Mark Paid
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* All Bills */}
      <Card>
        <CardHeader>
          <CardTitle>All Recurring Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {bills.map((bill) => {
              const Icon = categoryIcons[bill.category] || AlertCircle

              return (
                <div
                  key={bill.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{bill.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Due on the {bill.dueDay}
                      {bill.dueDay === 1 ? 'st' : bill.dueDay === 2 ? 'nd' : bill.dueDay === 3 ? 'rd' : 'th'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {bill.isPaid && (
                      <Badge variant="success" className="text-2xs">
                        <Check className="h-3 w-3 mr-1" />
                        Paid
                      </Badge>
                    )}
                    <p className="font-semibold">{formatCurrency(bill.amount)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
