import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { oracleFields } from '@/lib/db/schema'
import { requireAuth, requireWorkspaceAccess } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    await requireWorkspaceAccess(auth.userId, id)

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
    await requireWorkspaceAccess(auth.userId, id)

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
      fields: fields.map((f) => ({ category: f.category, fieldName: f.fieldName })),
    })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
