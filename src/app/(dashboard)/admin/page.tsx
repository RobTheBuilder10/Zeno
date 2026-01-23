import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import {
  Activity,
  BarChart3,
  CreditCard,
  DollarSign,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Zeno Admin Dashboard',
}

// Admin emails - in production, use a proper role system
const ADMIN_EMAILS = ['admin@zeno.finance', 'demo@zeno.finance']

export default async function AdminPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Check if user is admin
  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    redirect('/dashboard')
  }

  // Get admin stats
  const [
    userCount,
    accountCount,
    transactionCount,
    goalCount,
    insightCount,
    activeSubscriptions,
    recentUsers,
  ] = await Promise.all([
    db.user.count(),
    db.account.count(),
    db.transaction.count(),
    db.goal.count(),
    db.insight.count(),
    db.subscription.count({ where: { status: 'ACTIVE', plan: { not: 'FREE' } } }),
    db.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        onboardingCompleted: true,
        subscription: {
          select: { plan: true },
        },
      },
    }),
  ])

  // Calculate metrics
  const totalBalance = await db.account.aggregate({
    _sum: { currentBalance: true },
  })

  const avgAccountsPerUser = userCount > 0 ? accountCount / userCount : 0
  const avgTransactionsPerUser = userCount > 0 ? transactionCount / userCount : 0
  const onboardingCompletionRate = userCount > 0
    ? (await db.user.count({ where: { onboardingCompleted: true } })) / userCount * 100
    : 0

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Platform metrics and user management
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={userCount.toLocaleString()}
          icon={Users}
          description="Registered accounts"
        />
        <MetricCard
          title="Paid Subscriptions"
          value={activeSubscriptions.toLocaleString()}
          icon={CreditCard}
          description="Active paid plans"
        />
        <MetricCard
          title="Total Accounts"
          value={accountCount.toLocaleString()}
          icon={DollarSign}
          description={`${avgAccountsPerUser.toFixed(1)} per user avg`}
        />
        <MetricCard
          title="Total Transactions"
          value={transactionCount.toLocaleString()}
          icon={Activity}
          description={`${avgTransactionsPerUser.toFixed(0)} per user avg`}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Goals Created"
          value={goalCount.toLocaleString()}
          icon={Target}
        />
        <MetricCard
          title="Insights Generated"
          value={insightCount.toLocaleString()}
          icon={BarChart3}
        />
        <MetricCard
          title="Onboarding Rate"
          value={`${onboardingCompletionRate.toFixed(0)}%`}
          icon={TrendingUp}
        />
        <MetricCard
          title="Platform Balance"
          value={`$${((totalBalance._sum.currentBalance || 0) / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          description="Total tracked"
        />
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium">Email</th>
                  <th className="text-left py-3 px-2 font-medium">Name</th>
                  <th className="text-left py-3 px-2 font-medium">Plan</th>
                  <th className="text-left py-3 px-2 font-medium">Onboarded</th>
                  <th className="text-left py-3 px-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u: {
                  id: string
                  email: string
                  firstName: string | null
                  lastName: string | null
                  createdAt: Date
                  onboardingCompleted: boolean
                  subscription: { plan: string } | null
                }) => (
                  <tr key={u.id} className="border-b border-border/50">
                    <td className="py-3 px-2">{u.email}</td>
                    <td className="py-3 px-2">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.subscription?.plan === 'PRO'
                          ? 'bg-primary/10 text-primary'
                          : u.subscription?.plan === 'STARTER'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {u.subscription?.plan || 'FREE'}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      {u.onboardingCompleted ? '✓' : '—'}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string
  value: string
  icon: React.ElementType
  description?: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-secondary">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
