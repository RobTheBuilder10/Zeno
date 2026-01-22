import type { Metadata } from 'next'
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatRelativeDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'AI-powered financial insights from Zeno Brain',
}

// Demo insights
const insights = [
  {
    id: '1',
    createdAt: new Date(),
    summary:
      "You're building momentum. This month you've saved 27% of your income, which is above average. Your credit card balance is manageable at 15% utilization. Focus on building your emergency fund to $1,000 this month—you're just $240 away.",
    watchOuts: [
      'Electric bill is 20% higher than your 3-month average',
      'You have 4 streaming services totaling $52/month',
    ],
    weekPlan: [
      { day: 'Monday', action: 'Review streaming subscriptions' },
      { day: 'Tuesday', action: 'Set up automatic transfer to savings' },
      { day: 'Wednesday', action: 'Check credit card statement for errors' },
      { day: 'Thursday', action: 'Update budget categories' },
      { day: 'Friday', action: 'Pay credit card bill' },
      { day: 'Saturday', action: 'Review weekly spending' },
      { day: 'Sunday', action: 'Plan next week finances' },
    ],
    confidence: 0.92,
    actions: [
      {
        id: '1',
        title: 'Set up emergency fund goal',
        status: 'COMPLETED',
      },
      {
        id: '2',
        title: 'Review streaming subscriptions',
        status: 'PENDING',
      },
      {
        id: '3',
        title: 'Pay credit card before due date',
        status: 'PENDING',
      },
    ],
  },
  {
    id: '2',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    summary:
      "Last week was a high-spending week due to the car repair ($450). This is a one-time expense, so don't stress. Your overall trajectory is positive. Consider adding $100 extra to your emergency fund this month to recover.",
    watchOuts: ['Unexpected car repair impacted savings goal'],
    weekPlan: null,
    confidence: 0.88,
    actions: [
      {
        id: '4',
        title: 'Categorize car repair as one-time expense',
        status: 'COMPLETED',
      },
      {
        id: '5',
        title: 'Adjust monthly budget for recovery',
        status: 'COMPLETED',
      },
    ],
  },
]

export default function InsightsPage() {
  const latestInsight = insights[0]
  const pastInsights = insights.slice(1)

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Zeno Insights
          </h1>
          <p className="text-muted-foreground">
            AI-powered analysis and recommendations.
          </p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4" />
          Generate New Insight
        </Button>
      </div>

      {/* Latest Insight */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Latest Insight</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-2xs">
                {Math.round(latestInsight.confidence * 100)}% confidence
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatRelativeDate(latestInsight.createdAt)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              What&apos;s happening
            </h3>
            <p className="text-sm leading-relaxed">{latestInsight.summary}</p>
          </div>

          {/* Watch Outs */}
          {latestInsight.watchOuts.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Watch outs
              </h3>
              <ul className="space-y-2">
                {latestInsight.watchOuts.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm flex items-start gap-2 p-2 rounded-lg bg-warning/5 border border-warning/20"
                  >
                    <span className="text-warning mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Week Plan */}
          {latestInsight.weekPlan && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                7-Day Plan
              </h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {latestInsight.weekPlan.slice(0, 4).map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-border bg-card"
                  >
                    <p className="text-xs font-medium text-primary">{item.day}</p>
                    <p className="text-sm mt-1">{item.action}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="mt-2">
                View full week
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Related Actions */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Suggested actions
            </h3>
            <div className="space-y-2">
              {latestInsight.actions.map((action) => (
                <div
                  key={action.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border',
                    action.status === 'COMPLETED'
                      ? 'border-success/20 bg-success/5'
                      : 'border-border'
                  )}
                >
                  {action.status === 'COMPLETED' ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <span
                    className={cn(
                      'text-sm',
                      action.status === 'COMPLETED' && 'line-through text-muted-foreground'
                    )}
                  >
                    {action.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Past Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Past Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastInsights.map((insight) => (
              <div
                key={insight.id}
                className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeDate(insight.createdAt)}
                    </span>
                  </div>
                  <Badge variant="muted" className="text-2xs">
                    {insight.actions.filter((a) => a.status === 'COMPLETED').length}/
                    {insight.actions.length} completed
                  </Badge>
                </div>
                <p className="text-sm line-clamp-2">{insight.summary}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How Zeno Brain Works */}
      <Card className="border-dashed">
        <CardContent className="py-8">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">How Zeno Brain works</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Zeno analyzes your accounts, transactions, bills, and goals to provide
                personalized insights. It identifies patterns, flags potential issues,
                and suggests high-impact actions to improve your financial health.
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Zeno provides general financial guidance, not
                professional advice. For tax, legal, or investment decisions, consult
                a qualified professional.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
