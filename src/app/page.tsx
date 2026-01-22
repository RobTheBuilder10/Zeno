import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ArrowRight, Shield, Sparkles, Target, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function LandingPage() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              Z
            </div>
            <span className="text-xl font-semibold tracking-tight">Zeno</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered Finance
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
            Turn financial chaos into{' '}
            <span className="text-primary">clarity</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
            Zeno organizes your finances, explains what&apos;s happening in plain
            language, and gives you 1-3 high-impact next steps. Feel calm and in
            control in under 5 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" asChild>
              <Link href="/sign-up">
                Start for free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required. 5-minute setup.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-secondary/30" id="how-it-works">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Your financial command center
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Zeno isn&apos;t just another budgeting app. It&apos;s an intelligent
            system that builds confidence through daily momentum.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Zap}
              title="Instant Clarity"
              description="See your complete financial picture in seconds. Cash flow, bills, debts, and savings at a glance."
            />
            <FeatureCard
              icon={Sparkles}
              title="AI Insights"
              description="Get personalized analysis and recommendations from Zeno Brain, your AI financial advisor."
            />
            <FeatureCard
              icon={Target}
              title="Action Queue"
              description="Always know your 1-3 highest-impact next steps. Complete them and watch your momentum build."
            />
            <FeatureCard
              icon={Shield}
              title="No Judgment"
              description="Zeno never guilt-trips. Mistakes are data. Progress is celebrated. You're in control."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            From chaos to clarity in 5 minutes
          </h2>

          <div className="space-y-8">
            <StepCard
              number={1}
              title="Quick onboarding"
              description="Answer a few questions about your income, goals, and main stress points. No bank connection required to start."
            />
            <StepCard
              number={2}
              title="Add your finances"
              description="Enter your accounts, bills, and debts. Our guided flow makes it simple and fast."
            />
            <StepCard
              number={3}
              title="Get your snapshot"
              description="See your complete financial picture with clear insights and immediate next actions."
            />
            <StepCard
              number={4}
              title="Build momentum"
              description="Complete actions, track progress, and watch your financial health improve day by day."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to feel in control?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands who&apos;ve transformed their relationship with money.
            Start your journey to financial clarity today.
          </p>
          <Button size="xl" asChild>
            <Link href="/sign-up">
              Get started for free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">
              Z
            </div>
            <span className="text-sm text-muted-foreground">
              Zeno Finance Platform
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your data is encrypted and secure. We never sell your information.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border hover:border-border/80 hover:shadow-md transition-all">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
