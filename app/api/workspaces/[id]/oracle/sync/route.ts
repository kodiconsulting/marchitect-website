import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and, isNull, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { oracleFields, oracleCategoryDefs, objectives } from '@/lib/db/schema'
import { requireAuth, requireWorkspaceAccess } from '@/lib/auth'

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

    const { searchParams } = new URL(request.url)
    const objectiveIdParam = searchParams.get('objectiveId')
    const includeParam = searchParams.get('include')

    if (includeParam === 'all') {
      const brandRows = await db
        .select()
        .from(oracleFields)
        .where(and(eq(oracleFields.workspaceId, id), isNull(oracleFields.objectiveId)))

      const brandGrouped: Record<string, Record<string, unknown>> = {}
      for (const row of brandRows) {
        if (!brandGrouped[row.category]) brandGrouped[row.category] = {}
        brandGrouped[row.category][row.fieldName] = row.fieldValue
      }

      const objectiveRows = await db
        .select({
          category: oracleFields.category,
          fieldName: oracleFields.fieldName,
          fieldValue: oracleFields.fieldValue,
          objectiveId: oracleFields.objectiveId,
          objectiveName: objectives.name,
        })
        .from(oracleFields)
        .innerJoin(objectives, eq(oracleFields.objectiveId, objectives.id))
        .where(eq(oracleFields.workspaceId, id))

      const objectiveMap = new Map<
        string,
        { objectiveId: string; objectiveName: string; sections: Record<string, Record<string, unknown>> }
      >()
      for (const row of objectiveRows) {
        const oid = row.objectiveId!
        if (!objectiveMap.has(oid)) {
          objectiveMap.set(oid, { objectiveId: oid, objectiveName: row.objectiveName, sections: {} })
        }
        const entry = objectiveMap.get(oid)!
        if (!entry.sections[row.category]) entry.sections[row.category] = {}
        entry.sections[row.category][row.fieldName] = row.fieldValue
      }

      return Response.json({
        brand: brandGrouped,
        objectives: Array.from(objectiveMap.values()),
      })
    }

    if (objectiveIdParam) {
      const rows = await db
        .select()
        .from(oracleFields)
        .where(
          and(eq(oracleFields.workspaceId, id), eq(oracleFields.objectiveId, objectiveIdParam))
        )

      const grouped: Record<string, Record<string, unknown>> = {}
      for (const row of rows) {
        if (!grouped[row.category]) grouped[row.category] = {}
        grouped[row.category][row.fieldName] = row.fieldValue
      }
      return Response.json(grouped)
    }

    // Default: Brand-level only (backward compatible)
    const rows = await db
      .select()
      .from(oracleFields)
      .where(and(eq(oracleFields.workspaceId, id), isNull(oracleFields.objectiveId)))

    const grouped: Record<string, Record<string, unknown>> = {}
    for (const row of rows) {
      if (!grouped[row.category]) grouped[row.category] = {}
      grouped[row.category][row.fieldName] = row.fieldValue
    }

    return Response.json(grouped)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const syncFieldSchema = z.object({
  category: z.string().min(1),
  fieldName: z.string().min(1),
  fieldValue: z.unknown(),
  objectiveId: z.string().uuid().optional(),
})

const postSchema = z.object({
  fields: z.array(syncFieldSchema).min(1).max(200),
  updatedBy: z.string().optional(),
})

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

    const { fields, updatedBy = 'cowork' } = parsed.data

    // Load category definitions once
    const categoryDefs = await db.select().from(oracleCategoryDefs)
    const brandCategories = new Set(
      categoryDefs.filter((d) => d.level === 'brand').map((d) => d.category)
    )
    const objectiveCategories = new Set(
      categoryDefs.filter((d) => d.level === 'objective').map((d) => d.category)
    )

    // Verify any provided objectiveIds belong to this workspace
    const providedObjectiveIds = [
      ...new Set(fields.map((f) => f.objectiveId).filter(Boolean) as string[]),
    ]
    if (providedObjectiveIds.length > 0) {
      const workspaceObjs = await db
        .select({ id: objectives.id })
        .from(objectives)
        .where(eq(objectives.workspaceId, id))
      const workspaceObjectiveIds = new Set(workspaceObjs.map((r) => r.id))
      for (const oid of providedObjectiveIds) {
        if (!workspaceObjectiveIds.has(oid)) {
          return Response.json(
            { error: `Objective ${oid} does not exist or does not belong to this workspace` },
            { status: 400 }
          )
        }
      }
    }

    // Resolve fields, applying validation and backward-compat auto-assignment
    let autoAssignObjectiveId: string | null | undefined = undefined // undefined = not yet looked up

    const resolvedFields: Array<{
      category: string
      fieldName: string
      fieldValue: unknown
      objectiveId: string | null
    }> = []

    for (const field of fields) {
      const { category, fieldName, fieldValue, objectiveId } = field

      if (objectiveId) {
        if (!objectiveCategories.has(category)) {
          return Response.json(
            {
              error: `Category "${category}" is a brand-level category; objectiveId must not be provided for it`,
            },
            { status: 400 }
          )
        }
        resolvedFields.push({ category, fieldName, fieldValue, objectiveId })
        continue
      }

      if (brandCategories.has(category)) {
        resolvedFields.push({ category, fieldName, fieldValue, objectiveId: null })
        continue
      }

      if (objectiveCategories.has(category)) {
        // Backward-compat: auto-assign if exactly one Objective exists
        if (autoAssignObjectiveId === undefined) {
          const workspaceObjs = await db
            .select({ id: objectives.id })
            .from(objectives)
            .where(eq(objectives.workspaceId, id))
          autoAssignObjectiveId = workspaceObjs.length === 1 ? workspaceObjs[0].id : null
        }
        if (!autoAssignObjectiveId) {
          return Response.json(
            {
              error: `Category "${category}" is an objective-level category; provide objectiveId, or ensure the workspace has exactly one objective for auto-assignment`,
            },
            { status: 400 }
          )
        }
        console.warn(
          '[oracle-sync] deprecated: objective-level category sent without objectiveId, auto-assigning'
        )
        resolvedFields.push({ category, fieldName, fieldValue, objectiveId: autoAssignObjectiveId })
        continue
      }

      return Response.json(
        { error: `Category "${category}" is not recognized` },
        { status: 400 }
      )
    }

    const now = new Date()

    // Use ON CONFLICT ON CONSTRAINT to correctly handle NULLS NOT DISTINCT
    await Promise.all(
      resolvedFields.map(({ category, fieldName, fieldValue, objectiveId }) =>
        db.execute(
          sql`INSERT INTO oracle_fields (workspace_id, objective_id, category, field_name, field_value, last_updated, updated_by)
              VALUES (
                ${id}::uuid,
                ${objectiveId}::uuid,
                ${category},
                ${fieldName},
                ${JSON.stringify(fieldValue)}::jsonb,
                ${now},
                ${updatedBy}
              )
              ON CONFLICT ON CONSTRAINT uq_oracle_fields_scoped
              DO UPDATE SET
                field_value = EXCLUDED.field_value,
                last_updated = EXCLUDED.last_updated,
                updated_by = EXCLUDED.updated_by`
        )
      )
    )

    return Response.json({
      synced: resolvedFields.length,
      skipped: 0,
      fields: resolvedFields.map((f) => ({
        category: f.category,
        fieldName: f.fieldName,
        objectiveId: f.objectiveId,
      })),
    })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
