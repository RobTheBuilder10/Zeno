import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateAndSaveInsight } from '@/services/zeno-brain'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const insights = await db.insight.findMany({
      where: { userId: user.id },
      include: {
        actions: {
          orderBy: { priority: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: Only allow new insight if last one was more than 1 hour ago
    const lastInsight = await db.insight.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    if (lastInsight) {
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
      if (lastInsight.createdAt > hourAgo) {
        return NextResponse.json(
          { error: 'Please wait before generating a new insight' },
          { status: 429 }
        )
      }
    }

    const insight = await generateAndSaveInsight(user.id)

    return NextResponse.json({ insight }, { status: 201 })
  } catch (error) {
    console.error('Error generating insight:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
