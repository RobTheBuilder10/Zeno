'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building,
  Check,
  CreditCard,
  PiggyBank,
  Receipt,
  Target,
  TrendingDown,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const TOTAL_STEPS = 4

type OnboardingData = {
  incomeFrequency: string
  primaryGoal: string
  mainStressPoint: string
  monthlyIncome: string
  accounts: Array<{
    name: string
    type: string
    balance: string
  }>
}

const incomeOptions = [
  { value: 'WEEKLY', label: 'Weekly', description: 'Paid every week' },
  { value: 'BIWEEKLY', label: 'Bi-weekly', description: 'Paid every 2 weeks' },
  { value: 'SEMIMONTHLY', label: 'Semi-monthly', description: 'Paid twice a month' },
  { value: 'MONTHLY', label: 'Monthly', description: 'Paid once a month' },
  { value: 'VARIABLE', label: 'Variable', description: 'Freelance or irregular' },
]

const goalOptions = [
  { value: 'BUILD_SAVINGS', label: 'Build savings', icon: PiggyBank },
  { value: 'PAY_OFF_DEBT', label: 'Pay off debt', icon: CreditCard },
  { value: 'TRACK_SPENDING', label: 'Track spending', icon: Receipt },
  { value: 'INVEST_MORE', label: 'Start investing', icon: TrendingDown },
  { value: 'REDUCE_BILLS', label: 'Reduce bills', icon: Banknote },
]

const stressOptions = [
  { value: 'UNCLEAR_PICTURE', label: "I don't know where my money goes" },
  { value: 'TOO_MUCH_DEBT', label: 'Debt feels overwhelming' },
  { value: 'NOT_SAVING_ENOUGH', label: "I'm not saving enough" },
  { value: 'BILLS_OVERWHELMING', label: 'Bills are hard to track' },
  { value: 'NO_EMERGENCY_FUND', label: 'No emergency fund' },
  { value: 'DISORGANIZED', label: 'Everything feels disorganized' },
]

const accountTypes = [
  { value: 'CHECKING', label: 'Checking', icon: Wallet },
  { value: 'SAVINGS', label: 'Savings', icon: PiggyBank },
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const [data, setData] = React.useState<OnboardingData>({
    incomeFrequency: '',
    primaryGoal: '',
    mainStressPoint: '',
    monthlyIncome: '',
    accounts: [],
  })

  const progress = (step / TOTAL_STEPS) * 100

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.incomeFrequency && data.monthlyIncome
      case 2:
        return data.primaryGoal
      case 3:
        return data.mainStressPoint
      case 4:
        return data.accounts.length > 0
      default:
        return false
    }
  }

  const addAccount = (type: string) => {
    setData({
      ...data,
      accounts: [
        ...data.accounts,
        { name: '', type, balance: '' },
      ],
    })
  }

  const updateAccount = (index: number, field: string, value: string) => {
    const newAccounts = [...data.accounts]
    newAccounts[index] = { ...newAccounts[index], [field]: value }
    setData({ ...data, accounts: newAccounts })
  }

  const removeAccount = (index: number) => {
    setData({
      ...data,
      accounts: data.accounts.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] lg:min-h-screen flex flex-col p-4 lg:p-8">
      {/* Progress */}
      <div className="max-w-2xl mx-auto w-full mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Step {step} of {TOTAL_STEPS}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center">
        <Card className="max-w-2xl w-full">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Let&apos;s start with your income</CardTitle>
                <CardDescription>
                  This helps Zeno understand your cash flow and provide better recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>How often do you get paid?</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {incomeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setData({ ...data, incomeFrequency: option.value })}
                        className={cn(
                          'p-3 rounded-lg border text-left transition-all',
                          data.incomeFrequency === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <p className="font-medium text-sm">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income">What&apos;s your approximate monthly income?</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="5000"
                    value={data.monthlyIncome}
                    onChange={(e) => setData({ ...data, monthlyIncome: e.target.value })}
                    icon={<span className="text-sm">$</span>}
                  />
                  <p className="text-xs text-muted-foreground">
                    After taxes. This stays private and encrypted.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>What&apos;s your main financial goal?</CardTitle>
                <CardDescription>
                  Pick the one that matters most right now. You can add more later.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {goalOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData({ ...data, primaryGoal: option.value })}
                      className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all',
                        data.primaryGoal === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                        <option.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{option.label}</span>
                      {data.primaryGoal === option.value && (
                        <Check className="h-5 w-5 text-primary ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>What stresses you most about money?</CardTitle>
                <CardDescription>
                  Be honest—this helps Zeno prioritize what to fix first.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stressOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData({ ...data, mainStressPoint: option.value })}
                      className={cn(
                        'w-full flex items-center justify-between p-4 rounded-lg border text-left transition-all',
                        data.mainStressPoint === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span className="font-medium">{option.label}</span>
                      {data.mainStressPoint === option.value && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle>Add your accounts</CardTitle>
                <CardDescription>
                  Start with at least one account. You can add more anytime.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Account type buttons */}
                <div className="flex flex-wrap gap-2">
                  {accountTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant="outline"
                      size="sm"
                      onClick={() => addAccount(type.value)}
                    >
                      <type.icon className="h-4 w-4" />
                      Add {type.label}
                    </Button>
                  ))}
                </div>

                {/* Added accounts */}
                <div className="space-y-4">
                  {data.accounts.map((account, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-border space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          {accountTypes.find((t) => t.value === account.type)?.label}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAccount(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Account name</Label>
                          <Input
                            placeholder="e.g., Chase Checking"
                            value={account.name}
                            onChange={(e) => updateAccount(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Current balance</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={account.balance}
                            onChange={(e) => updateAccount(index, 'balance', e.target.value)}
                            icon={<span className="text-sm">$</span>}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {data.accounts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No accounts added yet</p>
                      <p className="text-sm">Click a button above to add your first account</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 pt-0">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()}>
              {step === TOTAL_STEPS ? 'Complete' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
