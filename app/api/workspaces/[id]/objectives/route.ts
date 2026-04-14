import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { objectives, oracleFields } from '@/lib/db/schema'
import { requireAuth, requireWorkspaceAccess } from '@/lib/auth'

const postSchema = z.object({
  name: z.string().min(1),
  successDefinition: z.string().optional(),
  targetTimeline: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    if (auth.userId.startsWith('api-key:') && !auth.workspaceIds.includes(id)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    await requireWorkspaceAccess(auth.userId, id)

    const rows = await db
      .select()
      .from(objectives)
      .where(eq(objectives.workspaceId, id))

    const allFields = await db
      .select()
      .from(oracleFields)
      .where(eq(oracleFields.workspaceId, id))

    const objectiveScopedFields = allFields.filter((f) => f.objectiveId !== null)

    const result = rows.map((obj) => {
      const relevantFields = objectiveScopedFields.filter((f) => f.objectiveId === obj.id)

      const oracleCompleteness: Record<string, { total: number; filled: number }> = {}

      for (const field of relevantFields) {
        if (field.category === 'Objective Definition') continue

        if (!oracleCompleteness[field.category]) {
          oracleCompleteness[field.category] = { total: 0, filled: 0 }
        }
        oracleCompleteness[field.category].total++

        const v = field.fieldValue
        const isFilled =
          v !== null &&
          v !== undefined &&
          v !== '' &&
          !(
            typeof v === 'object' &&
            !Array.isArray(v) &&
            Object.keys(v as object).length === 0
          )

        if (isFilled) {
          oracleCompleteness[field.category].filled++
        }
      }

      return { ...obj, oracleCompleteness }
    })

    return Response.json(result)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    if (auth.userId.startsWith('api-key:') && !auth.workspaceIds.includes(id)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    await requireWorkspaceAccess(auth.userId, id)

    const body = await request.json()
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const { name, successDefinition, targetTimeline, priority = 'medium' } = parsed.data

    const [created] = await db
      .insert(objectives)
      .values({
        workspaceId: id,
        name,
        successDefinition: successDefinition ?? null,
        targetTimeline: targetTimeline ?? null,
        priority,
        status: 'planning',
      })
      .returning()

    const now = new Date()
    await db.insert(oracleFields).values([
      {
        workspaceId: id,
        objectiveId: created.id,
        category: 'Objective Definition',
        fieldName: 'objective_name',
        fieldValue: name,
        lastUpdated: now,
        updatedBy: 'system',
      },
      {
        workspaceId: id,
        objectiveId: created.id,
        category: 'Objective Definition',
        fieldName: 'success_definition',
        fieldValue: successDefinition ?? null,
        lastUpdated: now,
        updatedBy: 'system',
      },
      {
        workspaceId: id,
        objectiveId: created.id,
        category: 'Objective Definition',
        fieldName: 'target_timeline',
        fieldValue: targetTimeline ?? null,
        lastUpdated: now,
        updatedBy: 'system',
      },
      {
        workspaceId: id,
        objectiveId: created.id,
        category: 'Objective Definition',
        fieldName: 'priority',
        fieldValue: priority,
        lastUpdated: now,
        updatedBy: 'system',
      },
      {
        workspaceId: id,
        objectiveId: created.id,
        category: 'Objective Definition',
        fieldName: 'status',
        fieldValue: 'planning',
        lastUpdated: now,
        updatedBy: 'system',
      },
    ])

    return Response.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
