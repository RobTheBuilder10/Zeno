import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: Record<string, unknown> = { userId: user.id }
    if (status) where.status = status

    const actions = await db.action.findMany({
      where,
      include: { insight: { select: { id: true, createdAt: true } } },
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
      take: limit,
    })

    // Get counts by status
    const statusCounts = await db.action.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: true,
    })

    type StatusCountItem = { status: string; _count: number }
    return NextResponse.json({
      actions,
      counts: statusCounts.reduce(
        (acc: Record<string, number>, item: StatusCountItem) => ({ ...acc, [item.status]: item._count }),
        {}
      ),
    })
  } catch (error) {
    console.error('Error fetching actions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
