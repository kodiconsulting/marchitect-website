import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { objectives, oracleFields } from '@/lib/db/schema'
import { requireAuth, requireWorkspaceAccess } from '@/lib/auth'

const putSchema = z.object({
  name: z.string().min(1).optional(),
  successDefinition: z.string().optional(),
  targetTimeline: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['planning', 'active', 'paused', 'complete']).optional(),
})

export async function PUT(
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

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const [existing] = await db
      .select()
      .from(objectives)
      .where(and(eq(objectives.id, objectiveId), eq(objectives.workspaceId, id)))
      .limit(1)

    if (!existing) {
      return Response.json({ error: 'Objective not found' }, { status: 404 })
    }

    const d = parsed.data
    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    if (d.name !== undefined) updateData.name = d.name
    if (d.successDefinition !== undefined) updateData.successDefinition = d.successDefinition
    if (d.targetTimeline !== undefined) updateData.targetTimeline = d.targetTimeline
    if (d.priority !== undefined) updateData.priority = d.priority
    if (d.status !== undefined) updateData.status = d.status

    const [updated] = await db
      .update(objectives)
      .set(updateData)
      .where(and(eq(objectives.id, objectiveId), eq(objectives.workspaceId, id)))
      .returning()

    // Sync corresponding Objective Definition oracle fields
    const oracleFieldMap: Record<string, unknown> = {}
    if (d.name !== undefined) oracleFieldMap['objective_name'] = d.name
    if (d.successDefinition !== undefined) oracleFieldMap['success_definition'] = d.successDefinition
    if (d.targetTimeline !== undefined) oracleFieldMap['target_timeline'] = d.targetTimeline
    if (d.priority !== undefined) oracleFieldMap['priority'] = d.priority
    if (d.status !== undefined) oracleFieldMap['status'] = d.status

    if (Object.keys(oracleFieldMap).length > 0) {
      const now = new Date()
      await Promise.all(
        Object.entries(oracleFieldMap).map(([fieldName, fieldValue]) =>
          db.execute(
            sql`INSERT INTO oracle_fields (workspace_id, objective_id, category, field_name, field_value, last_updated, updated_by)
                VALUES (${id}::uuid, ${objectiveId}::uuid, ${'Objective Definition'}, ${fieldName}, ${JSON.stringify(fieldValue)}::jsonb, ${now}, ${'system'})
                ON CONFLICT ON CONSTRAINT uq_oracle_fields_scoped
                DO UPDATE SET field_value = EXCLUDED.field_value, last_updated = EXCLUDED.last_updated, updated_by = EXCLUDED.updated_by`
          )
        )
      )
    }

    return Response.json(updated)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
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

    const [existing] = await db
      .select()
      .from(objectives)
      .where(and(eq(objectives.id, objectiveId), eq(objectives.workspaceId, id)))
      .limit(1)

    if (!existing) {
      return Response.json({ error: 'Objective not found' }, { status: 404 })
    }

    await db
      .delete(objectives)
      .where(and(eq(objectives.id, objectiveId), eq(objectives.workspaceId, id)))

    return Response.json({ deleted: true })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
