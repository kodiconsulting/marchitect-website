import { NextRequest } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { oracleFields, oracleCategoryDefs, objectives } from '@/lib/db/schema'
import { requireAuth, requireWorkspaceAccess } from '@/lib/auth'

type FieldMap = Record<string, Record<string, unknown>>

function isNonEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

const REQUIRED_CATEGORIES = [
  'Product / Service Definition',
  'Target Avatars / ICP',
  'Offer Architecture',
  'Channel Strategy',
] as const

function checkProductService(sections: FieldMap): boolean {
  const s = sections['Product / Service Definition'] ?? {}
  return isNonEmpty(s['name']) && isNonEmpty(s['what_it_is']) && isNonEmpty(s['who_its_for'])
}

function checkAvatars(sections: FieldMap): boolean {
  const s = sections['Target Avatars / ICP'] ?? {}
  return isNonEmpty(s['avatar_name']) && isNonEmpty(s['pain_points']) && isNonEmpty(s['goals'])
}

function checkOfferArchitecture(sections: FieldMap): boolean {
  const s = sections['Offer Architecture'] ?? {}
  return isNonEmpty(s['front_end_offer']) && isNonEmpty(s['core_offer'])
}

function checkChannelStrategy(sections: FieldMap): boolean {
  const s = sections['Channel Strategy'] ?? {}
  return (
    isNonEmpty(s['channel_name']) &&
    isNonEmpty(s['why_this_channel']) &&
    isNonEmpty(s['budget_allocation'])
  )
}

const CHECKS: Record<typeof REQUIRED_CATEGORIES[number], (s: FieldMap) => boolean> = {
  'Product / Service Definition': checkProductService,
  'Target Avatars / ICP': checkAvatars,
  'Offer Architecture': checkOfferArchitecture,
  'Channel Strategy': checkChannelStrategy,
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; objectiveId: string }> }
) {
  try {
    const auth = await requireAuth(request)
    const { id, objectiveId } = await params
    if (auth.userId.startsWith('api-key:') && !auth.workspaceIds.includes(id)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    await requireWorkspaceAccess(auth.userId, id)

    const [objective] = await db
      .select()
      .from(objectives)
      .where(and(eq(objectives.id, objectiveId), eq(objectives.workspaceId, id)))
      .limit(1)

    if (!objective) {
      return Response.json({ error: 'Objective not found' }, { status: 404 })
    }

    const [rows, categoryDefs] = await Promise.all([
      db
        .select()
        .from(oracleFields)
        .where(and(eq(oracleFields.workspaceId, id), eq(oracleFields.objectiveId, objectiveId))),
      db.select().from(oracleCategoryDefs),
    ])

    const sections: FieldMap = {}
    for (const row of rows) {
      if (!sections[row.category]) sections[row.category] = {}
      sections[row.category][row.fieldName] = row.fieldValue
    }

    const categoryDefMap = new Map(categoryDefs.map((d) => [d.category, d]))

    const complete: string[] = []
    const missing: Array<{ category: string; workshop: string | null; prompt: string | null }> = []

    for (const category of REQUIRED_CATEGORIES) {
      if (CHECKS[category](sections)) {
        complete.push(category)
      } else {
        const def = categoryDefMap.get(category)
        missing.push({
          category,
          workshop: def?.workshopName ?? null,
          prompt: def?.workshopPrompt ?? null,
        })
      }
    }

    return Response.json({
      ready: missing.length === 0,
      missing,
      complete,
    })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
