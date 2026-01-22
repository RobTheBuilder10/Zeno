import type { Metadata } from 'next'
import {
  CreditCard,
  DollarSign,
  MoreHorizontal,
  PiggyBank,
  Plus,
  RefreshCw,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Accounts',
  description: 'Manage your financial accounts',
}

// Demo data
const accounts = [
  {
    id: '1',
    name: 'Chase Checking',
    type: 'CHECKING',
    institution: 'Chase',
    balance: 3240.50,
    lastSynced: new Date(),
    isManual: true,
  },
  {
    id: '2',
    name: 'Ally Savings',
    type: 'SAVINGS',
    institution: 'Ally Bank',
    balance: 8500.00,
    lastSynced: new Date(),
    isManual: true,
  },
  {
    id: '3',
    name: 'Chase Sapphire',
    type: 'CREDIT_CARD',
    institution: 'Chase',
    balance: -1290.45,
    creditLimit: 8000,
    lastSynced: new Date(),
    isManual: true,
  },
  {
    id: '4',
    name: 'Fidelity 401k',
    type: 'INVESTMENT',
    institution: 'Fidelity',
    balance: 24500.00,
    lastSynced: new Date(),
    isManual: true,
  },
]

const accountTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  CHECKING: { icon: Wallet, color: 'text-blue-500 bg-blue-500/10' },
  SAVINGS: { icon: PiggyBank, color: 'text-green-500 bg-green-500/10' },
  CREDIT_CARD: { icon: CreditCard, color: 'text-orange-500 bg-orange-500/10' },
  INVESTMENT: { icon: TrendingUp, color: 'text-purple-500 bg-purple-500/10' },
  LOAN: { icon: DollarSign, color: 'text-red-500 bg-red-500/10' },
  OTHER: { icon: DollarSign, color: 'text-gray-500 bg-gray-500/10' },
}

export default function AccountsPage() {
  const totalAssets = accounts
    .filter((a) => a.balance > 0)
    .reduce((sum, a) => sum + a.balance, 0)

  const totalLiabilities = accounts
    .filter((a) => a.balance < 0)
    .reduce((sum, a) => sum + Math.abs(a.balance), 0)

  const netWorth = totalAssets - totalLiabilities

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Accounts
          </h1>
          <p className="text-muted-foreground">
            Track all your financial accounts in one place.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Assets</p>
            <p className="text-2xl font-bold text-success mt-1">
              {formatCurrency(totalAssets)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Liabilities</p>
            <p className="text-2xl font-bold text-destructive mt-1">
              {formatCurrency(totalLiabilities)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Net Worth</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(netWorth)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Accounts</CardTitle>
            <Badge variant="secondary">{accounts.length} accounts</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {accounts.map((account) => {
              const config = accountTypeConfig[account.type] || accountTypeConfig.OTHER
              const Icon = config.icon

              return (
                <div
                  key={account.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', config.color)}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{account.name}</p>
                      {account.isManual && (
                        <Badge variant="muted" className="text-2xs">
                          Manual
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {account.institution}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className={cn(
                      'font-semibold',
                      account.balance < 0 && 'text-destructive'
                    )}>
                      {formatCurrency(account.balance)}
                    </p>
                    {account.type === 'CREDIT_CARD' && account.creditLimit && (
                      <p className="text-xs text-muted-foreground">
                        {Math.round((Math.abs(account.balance) / account.creditLimit) * 100)}% used
                      </p>
                    )}
                  </div>

                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Connect Bank CTA */}
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <RefreshCw className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Connect your bank</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
            Automatically sync transactions and balances from over 12,000 financial institutions.
          </p>
          <Button variant="outline" disabled>
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
