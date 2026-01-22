import type { Metadata } from 'next'
import {
  Activity,
  Battery,
  Check,
  Cpu,
  Flame,
  Lock,
  Shield,
  Signal,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'World',
  description: 'Your financial progress visualization',
}

// Demo world progress
const worldProgress = {
  level: 3,
  currentXp: 340,
  xpToNextLevel: 500,
  totalXp: 1840,
  streakDays: 12,
  longestStreak: 18,
  actionsCompleted: 23,
  goalsCompleted: 1,
  modules: {
    stability: { level: 2, status: 'online', progress: 76 },
    efficiency: { level: 1, status: 'upgrading', progress: 45 },
    capacity: { level: 1, status: 'online', progress: 22 },
    security: { level: 0, status: 'initializing', progress: 10 },
  },
}

const milestones = [
  { name: 'First Snapshot', achieved: true, date: '2025-01-01' },
  { name: 'Onboarding Complete', achieved: true, date: '2025-01-01' },
  { name: '7-Day Streak', achieved: true, date: '2025-01-08' },
  { name: 'First Action Complete', achieved: true, date: '2025-01-02' },
  { name: 'Emergency Starter ($500)', achieved: true, date: '2025-01-15' },
  { name: 'Emergency Basic ($1,000)', achieved: false, date: null },
  { name: '30-Day Streak', achieved: false, date: null },
  { name: 'Subscriptions Audit', achieved: false, date: null },
]

const moduleConfig = {
  stability: {
    name: 'Stability Core',
    icon: Shield,
    description: 'Emergency fund progress',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  efficiency: {
    name: 'Efficiency Matrix',
    icon: Zap,
    description: 'Bill and subscription optimization',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  capacity: {
    name: 'Capacity Drive',
    icon: Battery,
    description: 'Savings rate and growth',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  security: {
    name: 'Security Protocol',
    icon: Lock,
    description: 'Debt reduction progress',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
}

const statusColors = {
  online: 'text-success',
  upgrading: 'text-warning',
  initializing: 'text-muted-foreground',
  offline: 'text-destructive',
}

export default function WorldPage() {
  const xpProgress = (worldProgress.currentXp / worldProgress.xpToNextLevel) * 100
  const achievedMilestones = milestones.filter((m) => m.achieved)

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          Financial World
        </h1>
        <p className="text-muted-foreground">
          Your progress visualization system.
        </p>
      </div>

      {/* Level Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">System Level</p>
              <p className="text-4xl font-bold">{worldProgress.level}</p>
            </div>
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Cpu className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to Level {worldProgress.level + 1}</span>
              <span className="font-medium">{worldProgress.currentXp} / {worldProgress.xpToNextLevel} XP</span>
            </div>
            <Progress value={xpProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{worldProgress.streakDays}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{worldProgress.actionsCompleted}</p>
                <p className="text-xs text-muted-foreground">Actions Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{worldProgress.goalsCompleted}</p>
                <p className="text-xs text-muted-foreground">Goals Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Signal className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{worldProgress.totalXp}</p>
                <p className="text-xs text-muted-foreground">Total XP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Modules */}
      <Card>
        <CardHeader>
          <CardTitle>System Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(worldProgress.modules).map(([key, module]) => {
              const config = moduleConfig[key as keyof typeof moduleConfig]
              const Icon = config.icon

              return (
                <div
                  key={key}
                  className="p-4 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', config.bgColor)}>
                      <Icon className={cn('h-5 w-5', config.color)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{config.name}</p>
                        <Badge variant="muted" className="text-2xs">
                          Lv {module.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {config.description}
                      </p>
                      <div className="mt-3">
                        <Progress value={module.progress} className="h-1.5" />
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <span className={cn('inline-block h-2 w-2 rounded-full',
                          module.status === 'online' ? 'bg-success' :
                          module.status === 'upgrading' ? 'bg-warning animate-pulse' :
                          'bg-muted-foreground'
                        )} />
                        <span className={cn('text-xs capitalize', statusColors[module.status as keyof typeof statusColors])}>
                          {module.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Milestones</CardTitle>
            <Badge variant="secondary">
              {achievedMilestones.length} / {milestones.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border',
                  milestone.achieved
                    ? 'border-success/20 bg-success/5'
                    : 'border-border opacity-60'
                )}
              >
                {milestone.achieved ? (
                  <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-success" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/30" />
                )}
                <div>
                  <p className={cn('text-sm font-medium', !milestone.achieved && 'text-muted-foreground')}>
                    {milestone.name}
                  </p>
                  {milestone.date && (
                    <p className="text-xs text-muted-foreground">
                      {milestone.date}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
