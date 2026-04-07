import { NextRequest } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { auditItems, auditScores, pillars } from '@/lib/db/schema'
import { verifyRequest, requireWorkspaceAccess } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pillar: string }> }
) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, pillar } = await params
    await requireWorkspaceAccess(auth.userId, id)

    const pillarNumber = parseInt(pillar, 10)
    if (isNaN(pillarNumber)) {
      return Response.json({ error: 'Invalid pillar number' }, { status: 400 })
    }

    const [pillarRow] = await db
      .select()
      .from(pillars)
      .where(eq(pillars.pillarNumber, pillarNumber))
      .limit(1)

    if (!pillarRow) {
      return Response.json({ error: 'Pillar not found' }, { status: 404 })
    }

    const items = await db
      .select()
      .from(auditItems)
      .where(eq(auditItems.pillarId, pillarRow.id))

    const scores = await db
      .select()
      .from(auditScores)
      .where(eq(auditScores.workspaceId, id))

    const scoreMap = new Map<
      string,
      { score: number; scoredBy: string; scoredDate: Date; notes: string | null }
    >()
    for (const s of scores) {
      scoreMap.set(s.auditItemId, {
        score: s.score,
        scoredBy: s.scoredBy,
        scoredDate: s.scoredDate,
        notes: s.notes,
      })
    }

    const itemsWithScores = items.map((item) => {
      const meta = scoreMap.get(item.id)
      return {
        ...item,
        score: meta?.score ?? 0,
        scoredBy: meta?.scoredBy ?? 'system',
        scoredDate: meta?.scoredDate ?? null,
        notes: meta?.notes ?? null,
      }
    })

    return Response.json({ pillar: pillarRow, items: itemsWithScores })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
