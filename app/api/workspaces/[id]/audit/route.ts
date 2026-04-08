import { NextRequest } from 'next/server'
import { eq, and, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { workspaces, auditItems, auditScores, pillars } from '@/lib/db/schema'
import { auth } from '@/auth'

const TIER_WEIGHTS: Record<number, number> = { 1: 3, 2: 2, 3: 1, 4: 0.5 }

function getActiveToggles(workspace: typeof workspaces.$inferSelect): string[] {
  const toggles: string[] = []
  if (workspace.toggleCore) toggles.push('core')
  if (workspace.toggleLeadGen) toggles.push('lead_gen')
  if (workspace.toggleEcom) toggles.push('ecom')
  if (workspace.toggleB2b) toggles.push('b2b')
  if (workspace.toggleB2c) toggles.push('b2c')
  return toggles
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id))
      .limit(1)

    if (!workspace) {
      return Response.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const activeToggles = getActiveToggles(workspace)

    // Fetch all audit items with their pillars
    const items = await db
      .select({
        item: auditItems,
        pillar: pillars,
      })
      .from(auditItems)
      .innerJoin(pillars, eq(auditItems.pillarId, pillars.id))

    // Filter by active toggles
    // An item is included if its toggleTags array is empty OR has at least one tag matching active toggles
    const filteredItems = items.filter(({ item }) => {
      const tags = item.toggleTags ?? []
      if (tags.length === 0) return true
      return tags.some((tag) => activeToggles.includes(tag))
    })

    // Fetch scores for this workspace
    const scores = await db
      .select()
      .from(auditScores)
      .where(eq(auditScores.workspaceId, id))

    const scoreMap = new Map<string, number>()
    const scoreMetaMap = new Map<
      string,
      { score: number; scoredBy: string; scoredDate: Date; notes: string | null }
    >()
    for (const s of scores) {
      scoreMap.set(s.auditItemId, s.score)
      scoreMetaMap.set(s.auditItemId, {
        score: s.score,
        scoredBy: s.scoredBy,
        scoredDate: s.scoredDate,
        notes: s.notes,
      })
    }

    // Group items by pillar and compute scores
    const pillarMap = new Map<
      number,
      {
        pillar: typeof pillars.$inferSelect
        items: Array<{
          item: typeof auditItems.$inferSelect
          score: number
          scoredBy: string
          scoredDate: Date | null
          notes: string | null
        }>
        pillarScore: number
      }
    >()

    for (const { item, pillar } of filteredItems) {
      if (!pillarMap.has(pillar.pillarNumber)) {
        pillarMap.set(pillar.pillarNumber, { pillar, items: [], pillarScore: 0 })
      }
      const meta = scoreMetaMap.get(item.id)
      pillarMap.get(pillar.pillarNumber)!.items.push({
        item,
        score: meta?.score ?? 0,
        scoredBy: meta?.scoredBy ?? 'system',
        scoredDate: meta?.scoredDate ?? null,
        notes: meta?.notes ?? null,
      })
    }

    // Compute pillar scores
    const pillarScores: number[] = []
    for (const [, entry] of pillarMap) {
      let weightedSum = 0
      let maxPossible = 0
      for (const { item, score } of entry.items) {
        const weight = TIER_WEIGHTS[item.tier] ?? 1
        weightedSum += score * weight
        maxPossible += 2 * weight
      }
      const pillarScore = maxPossible > 0 ? weightedSum / maxPossible : 0
      entry.pillarScore = pillarScore
      pillarScores.push(pillarScore)
    }

    const healthScore =
      pillarScores.length > 0
        ? pillarScores.reduce((a, b) => a + b, 0) / pillarScores.length
        : 0

    const pillarResults = Array.from(pillarMap.values()).map((entry) => ({
      pillar: entry.pillar,
      pillarScore: entry.pillarScore,
      items: entry.items,
    }))

    return Response.json({
      workspaceId: id,
      healthScore,
      activeToggles,
      pillars: pillarResults,
    })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
