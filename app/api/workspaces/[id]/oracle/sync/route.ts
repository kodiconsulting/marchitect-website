import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { oracleFields } from '@/lib/db/schema'
import { requireAuth } from '@/lib/auth'

function assertWorkspaceAccess(workspaceIds: string[], id: string): void {
  if (!workspaceIds.includes(id)) {
    throw Response.json({ error: 'Forbidden' }, { status: 403 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    assertWorkspaceAccess(auth.workspaceIds, id)

    const rows = await db
      .select()
      .from(oracleFields)
      .where(eq(oracleFields.workspaceId, id))

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
})

const postSchema = z.object({
  fields: z.array(syncFieldSchema).min(1),
  updatedBy: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    assertWorkspaceAccess(auth.workspaceIds, id)

    const body = await request.json()
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const { fields, updatedBy = 'cowork' } = parsed.data
    const now = new Date()

    await Promise.all(
      fields.map(({ category, fieldName, fieldValue }) =>
        db
          .insert(oracleFields)
          .values({
            workspaceId: id,
            category,
            fieldName,
            fieldValue: fieldValue as Parameters<typeof db.insert>[0] extends never ? never : unknown,
            lastUpdated: now,
            updatedBy,
          })
          .onConflictDoUpdate({
            target: [oracleFields.workspaceId, oracleFields.category, oracleFields.fieldName],
            set: {
              fieldValue: fieldValue as Parameters<typeof db.insert>[0] extends never ? never : unknown,
              lastUpdated: now,
              updatedBy,
            },
          })
      )
    )

    return Response.json({
      synced: fields.length,
      skipped: 0,
      fields: fields.map((f) => f.fieldName),
    })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
