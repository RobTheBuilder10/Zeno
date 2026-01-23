import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { updatePreferencesSchema } from '@/lib/validations'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Update user profile
    if (body.firstName !== undefined || body.lastName !== undefined) {
      await db.user.update({
        where: { id: user.id },
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
        },
      })
    }

    // Update preferences
    if (body.preferences) {
      const validatedPrefs = updatePreferencesSchema.parse(body.preferences)

      await db.userPreferences.update({
        where: { userId: user.id },
        data: validatedPrefs,
      })
    }

    const updatedUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        preferences: true,
        worldProgress: true,
        subscription: true,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
