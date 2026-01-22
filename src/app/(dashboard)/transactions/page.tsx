import type { Metadata } from 'next'
import {
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  Plus,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Transactions',
  description: 'View and manage your transactions',
}

// Demo transactions
const transactions = [
  {
    id: '1',
    description: 'Whole Foods Market',
    amount: -127.45,
    category: 'FOOD_GROCERIES',
    date: new Date('2025-01-20'),
    account: 'Chase Checking',
  },
  {
    id: '2',
    description: 'Payroll Deposit',
    amount: 2600.00,
    category: 'INCOME_SALARY',
    date: new Date('2025-01-15'),
    account: 'Chase Checking',
  },
  {
    id: '3',
    description: 'Netflix',
    amount: -15.99,
    category: 'ENTERTAINMENT_STREAMING',
    date: new Date('2025-01-14'),
    account: 'Chase Sapphire',
  },
  {
    id: '4',
    description: 'Shell Gas Station',
    amount: -52.30,
    category: 'TRANSPORT_GAS',
    date: new Date('2025-01-13'),
    account: 'Chase Sapphire',
  },
  {
    id: '5',
    description: 'Transfer to Savings',
    amount: -500.00,
    category: 'SAVINGS_TRANSFER',
    date: new Date('2025-01-12'),
    account: 'Chase Checking',
  },
  {
    id: '6',
    description: 'Amazon',
    amount: -45.99,
    category: 'SHOPPING_OTHER',
    date: new Date('2025-01-11'),
    account: 'Chase Sapphire',
  },
  {
    id: '7',
    description: 'Spotify',
    amount: -9.99,
    category: 'ENTERTAINMENT_STREAMING',
    date: new Date('2025-01-10'),
    account: 'Chase Sapphire',
  },
  {
    id: '8',
    description: 'Rent Payment',
    amount: -1400.00,
    category: 'HOUSING_RENT',
    date: new Date('2025-01-01'),
    account: 'Chase Checking',
  },
]

const categoryLabels: Record<string, string> = {
  INCOME_SALARY: 'Salary',
  FOOD_GROCERIES: 'Groceries',
  ENTERTAINMENT_STREAMING: 'Streaming',
  TRANSPORT_GAS: 'Gas',
  SAVINGS_TRANSFER: 'Savings',
  SHOPPING_OTHER: 'Shopping',
  HOUSING_RENT: 'Rent',
}

export default function TransactionsPage() {
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Transactions
          </h1>
          <p className="text-muted-foreground">
            Track every dollar in and out.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Income this month</p>
                <p className="text-xl font-bold text-success">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ArrowDownRight className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Spent this month</p>
                <p className="text-xl font-bold text-destructive">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search transactions..."
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className={cn(
                  'h-9 w-9 rounded-lg flex items-center justify-center',
                  transaction.amount > 0 ? 'bg-success/10' : 'bg-secondary'
                )}>
                  {transaction.amount > 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(transaction.date, { month: 'short', day: 'numeric' })}</span>
                    <span>·</span>
                    <span>{transaction.account}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className={cn(
                    'font-semibold',
                    transaction.amount > 0 ? 'text-success' : 'text-foreground'
                  )}>
                    {transaction.amount > 0 ? '+' : ''}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <Badge variant="muted" className="text-2xs">
                    {categoryLabels[transaction.category] || 'Other'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
