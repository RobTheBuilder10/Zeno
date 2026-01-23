import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    const { id } = await params

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const insight = await db.insight.findFirst({
      where: { id, userId: user.id },
      include: {
        actions: {
          orderBy: { priority: 'asc' },
        },
      },
    })

    if (!insight) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 })
    }

    return NextResponse.json({ insight })
  } catch (error) {
    console.error('Error fetching insight:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
