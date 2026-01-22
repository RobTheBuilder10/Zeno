import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create a demo user (this would normally be created via Clerk webhook)
  const demoUser = await prisma.user.upsert({
    where: { clerkId: 'demo_user_123' },
    update: {},
    create: {
      clerkId: 'demo_user_123',
      email: 'demo@zeno.finance',
      firstName: 'Demo',
      lastName: 'User',
      onboardingCompleted: true,
      onboardingStep: 4,
      preferences: {
        create: {
          incomeFrequency: 'MONTHLY',
          primaryGoal: 'BUILD_SAVINGS',
          mainStressPoint: 'UNCLEAR_PICTURE',
          monthlyIncome: 5200,
          theme: 'SYSTEM',
          currency: 'USD',
          showWorldLayer: true,
          emailDigest: true,
          actionReminders: true,
        },
      },
      worldProgress: {
        create: {
          level: 3,
          totalXp: 1840,
          currentXp: 340,
          xpToNextLevel: 500,
          modules: {
            stability: { level: 2, status: 'online', progress: 76 },
            efficiency: { level: 1, status: 'upgrading', progress: 45 },
            capacity: { level: 1, status: 'online', progress: 22 },
            security: { level: 0, status: 'initializing', progress: 10 },
          },
          streakDays: 12,
          longestStreak: 18,
          actionsCompleted: 23,
          goalsCompleted: 1,
        },
      },
      subscription: {
        create: {
          plan: 'FREE',
          status: 'ACTIVE',
        },
      },
    },
  })

  console.log(`Created demo user: ${demoUser.email}`)

  // Create accounts
  const checkingAccount = await prisma.account.create({
    data: {
      userId: demoUser.id,
      name: 'Chase Checking',
      type: 'CHECKING',
      institution: 'Chase',
      currentBalance: 3240.50,
      isManual: true,
      includeInNet: true,
    },
  })

  const savingsAccount = await prisma.account.create({
    data: {
      userId: demoUser.id,
      name: 'Ally Savings',
      type: 'SAVINGS',
      institution: 'Ally Bank',
      currentBalance: 8500.00,
      isManual: true,
      includeInNet: true,
    },
  })

  const creditCard = await prisma.account.create({
    data: {
      userId: demoUser.id,
      name: 'Chase Sapphire',
      type: 'CREDIT_CARD',
      institution: 'Chase',
      currentBalance: -1290.45,
      creditLimit: 8000,
      isManual: true,
      includeInNet: true,
    },
  })

  console.log('Created accounts')

  // Create transactions
  const transactions = [
    {
      userId: demoUser.id,
      accountId: checkingAccount.id,
      amount: 2600,
      description: 'Payroll Deposit',
      category: 'INCOME_SALARY',
      date: new Date('2025-01-15'),
      isManual: true,
    },
    {
      userId: demoUser.id,
      accountId: checkingAccount.id,
      amount: -1400,
      description: 'Rent Payment',
      category: 'HOUSING_RENT',
      date: new Date('2025-01-01'),
      isManual: true,
      isRecurring: true,
    },
    {
      userId: demoUser.id,
      accountId: checkingAccount.id,
      amount: -500,
      description: 'Transfer to Savings',
      category: 'SAVINGS_TRANSFER',
      date: new Date('2025-01-12'),
      isManual: true,
    },
    {
      userId: demoUser.id,
      accountId: creditCard.id,
      amount: -127.45,
      description: 'Whole Foods Market',
      category: 'FOOD_GROCERIES',
      date: new Date('2025-01-20'),
      isManual: true,
    },
    {
      userId: demoUser.id,
      accountId: creditCard.id,
      amount: -15.99,
      description: 'Netflix',
      category: 'ENTERTAINMENT_STREAMING',
      date: new Date('2025-01-14'),
      isManual: true,
      isRecurring: true,
    },
    {
      userId: demoUser.id,
      accountId: creditCard.id,
      amount: -52.30,
      description: 'Shell Gas Station',
      category: 'TRANSPORT_GAS',
      date: new Date('2025-01-13'),
      isManual: true,
    },
  ]

  await prisma.transaction.createMany({
    data: transactions.map((t) => ({ ...t, category: t.category as any })),
  })

  console.log(`Created ${transactions.length} transactions`)

  // Create debts
  await prisma.debt.createMany({
    data: [
      {
        userId: demoUser.id,
        name: 'Chase Sapphire',
        type: 'CREDIT_CARD',
        lender: 'Chase',
        originalBalance: 3500,
        currentBalance: 1290.45,
        interestRate: 0.1999,
        minimumPayment: 35,
        dueDay: 15,
      },
      {
        userId: demoUser.id,
        name: 'Student Loan',
        type: 'STUDENT_LOAN',
        lender: 'Navient',
        originalBalance: 28000,
        currentBalance: 18450,
        interestRate: 0.055,
        minimumPayment: 280,
        dueDay: 1,
      },
    ],
  })

  console.log('Created debts')

  // Create bills
  await prisma.bill.createMany({
    data: [
      {
        userId: demoUser.id,
        name: 'Rent',
        category: 'HOUSING',
        amount: 1400,
        frequency: 'MONTHLY',
        dueDay: 1,
        nextDueDate: new Date('2025-02-01'),
        isSubscription: false,
      },
      {
        userId: demoUser.id,
        name: 'Electric',
        category: 'UTILITIES',
        amount: 85,
        frequency: 'MONTHLY',
        dueDay: 15,
        nextDueDate: new Date('2025-01-26'),
        isSubscription: false,
      },
      {
        userId: demoUser.id,
        name: 'Netflix',
        category: 'STREAMING',
        amount: 15.99,
        frequency: 'MONTHLY',
        dueDay: 14,
        nextDueDate: new Date('2025-02-14'),
        isSubscription: true,
      },
      {
        userId: demoUser.id,
        name: 'Spotify',
        category: 'STREAMING',
        amount: 9.99,
        frequency: 'MONTHLY',
        dueDay: 10,
        nextDueDate: new Date('2025-02-10'),
        isSubscription: true,
      },
    ],
  })

  console.log('Created bills')

  // Create goals
  await prisma.goal.createMany({
    data: [
      {
        userId: demoUser.id,
        name: 'Emergency Fund',
        type: 'EMERGENCY_FUND',
        targetAmount: 3000,
        currentAmount: 760,
        targetDate: new Date('2025-06-01'),
        status: 'ACTIVE',
        priority: 1,
      },
      {
        userId: demoUser.id,
        name: 'Summer Vacation',
        type: 'TRAVEL',
        targetAmount: 2000,
        currentAmount: 450,
        targetDate: new Date('2025-08-01'),
        status: 'ACTIVE',
        priority: 2,
      },
    ],
  })

  console.log('Created goals')

  // Create an insight with actions
  const insight = await prisma.insight.create({
    data: {
      userId: demoUser.id,
      summary:
        "You're building momentum. This month you've saved 27% of your income, which is above average. Your credit card balance is manageable at 15% utilization. Focus on building your emergency fund to $1,000 this month—you're just $240 away.",
      watchOuts: [
        'Electric bill is 20% higher than your 3-month average',
        'You have 4 streaming services totaling $52/month',
      ],
      weekPlan: {
        monday: 'Review streaming subscriptions',
        tuesday: 'Set up automatic transfer to savings',
        wednesday: 'Check credit card statement for errors',
        thursday: 'Update budget categories',
        friday: 'Pay credit card bill',
        saturday: 'Review weekly spending',
        sunday: 'Plan next week finances',
      },
      dataSnapshot: {
        netWorth: 12450,
        savingsRate: 0.27,
        creditUtilization: 0.15,
      },
      confidence: 0.92,
    },
  })

  await prisma.action.createMany({
    data: [
      {
        userId: demoUser.id,
        insightId: insight.id,
        title: 'Set up emergency fund goal',
        description: "You're close to having $1,000 saved. Let's make it official.",
        whyItMatters: 'Having a clear goal increases your chances of reaching it by 42%.',
        estimatedImpact: 'HIGH',
        difficulty: 'EASY',
        timeToComplete: '2 min',
        status: 'PENDING',
        priority: 1,
      },
      {
        userId: demoUser.id,
        insightId: insight.id,
        title: 'Review streaming subscriptions',
        description: 'You have 4 streaming services totaling $52/month.',
        whyItMatters: 'Canceling unused subscriptions could save you $200+ per year.',
        estimatedImpact: 'MEDIUM',
        difficulty: 'EASY',
        timeToComplete: '5 min',
        status: 'PENDING',
        priority: 2,
      },
      {
        userId: demoUser.id,
        insightId: insight.id,
        title: 'Pay credit card before due date',
        description: 'Due in 5 days. Paying in full saves $18 in interest.',
        whyItMatters: 'Avoiding interest charges keeps more money in your pocket.',
        estimatedImpact: 'HIGH',
        difficulty: 'EASY',
        timeToComplete: '3 min',
        status: 'PENDING',
        priority: 3,
      },
    ],
  })

  console.log('Created insight and actions')

  // Create milestones
  const worldProgress = await prisma.worldProgress.findUnique({
    where: { userId: demoUser.id },
  })

  if (worldProgress) {
    await prisma.worldMilestone.createMany({
      data: [
        {
          worldProgressId: worldProgress.id,
          type: 'FIRST_SNAPSHOT',
          name: 'First Snapshot',
          description: 'Generated your first financial snapshot',
          achievedAt: new Date('2025-01-01'),
        },
        {
          worldProgressId: worldProgress.id,
          type: 'ONBOARDING_COMPLETE',
          name: 'Onboarding Complete',
          description: 'Completed the onboarding process',
          achievedAt: new Date('2025-01-01'),
        },
        {
          worldProgressId: worldProgress.id,
          type: 'STREAK_7_DAYS',
          name: '7-Day Streak',
          description: 'Logged in for 7 consecutive days',
          achievedAt: new Date('2025-01-08'),
        },
        {
          worldProgressId: worldProgress.id,
          type: 'EMERGENCY_STARTER',
          name: 'Emergency Starter',
          description: 'Saved your first $500 in emergency fund',
          achievedAt: new Date('2025-01-15'),
        },
      ],
    })

    console.log('Created milestones')
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
