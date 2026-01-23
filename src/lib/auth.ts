import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

/**
 * Get the current authenticated user from the database
 * Creates the user if they don't exist yet
 */
export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  let user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      preferences: true,
      worldProgress: true,
      subscription: true,
    },
  })

  // If user doesn't exist in our DB yet, create them
  if (!user) {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return null
    }

    user = await db.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        avatarUrl: clerkUser.imageUrl,
        preferences: {
          create: {
            incomeFrequency: 'MONTHLY',
            primaryGoal: 'BUILD_SAVINGS',
            mainStressPoint: 'UNCLEAR_PICTURE',
            theme: 'SYSTEM',
            currency: 'USD',
            showWorldLayer: true,
            emailDigest: true,
            actionReminders: true,
          },
        },
        worldProgress: {
          create: {
            level: 1,
            totalXp: 0,
            currentXp: 0,
            xpToNextLevel: 100,
            modules: {
              stability: { level: 0, status: 'initializing', progress: 0 },
              efficiency: { level: 0, status: 'offline', progress: 0 },
              capacity: { level: 0, status: 'offline', progress: 0 },
              security: { level: 0, status: 'offline', progress: 0 },
            },
            streakDays: 0,
            longestStreak: 0,
            actionsCompleted: 0,
            goalsCompleted: 0,
          },
        },
        subscription: {
          create: {
            plan: 'FREE',
            status: 'ACTIVE',
          },
        },
      },
      include: {
        preferences: true,
        worldProgress: true,
        subscription: true,
      },
    })
  }

  return user
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

/**
 * Get user ID or throw
 */
export async function requireUserId() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  return userId
}
