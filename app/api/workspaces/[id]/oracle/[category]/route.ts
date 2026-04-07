import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { oracleFields } from '@/lib/db/schema'
import { verifyRequest, requireWorkspaceAccess } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; category: string }> }
) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, category } = await params
    await requireWorkspaceAccess(auth.userId, id)

    const fields = await db
      .select()
      .from(oracleFields)
      .where(
        and(eq(oracleFields.workspaceId, id), eq(oracleFields.category, category))
      )

    const result: Record<
      string,
      {
        value: unknown
        lastUpdated: Date
        updatedBy: string
        relatedAuditItems: string[] | null
      }
    > = {}

    for (const field of fields) {
      result[field.fieldName] = {
        value: field.fieldValue,
        lastUpdated: field.lastUpdated,
        updatedBy: field.updatedBy,
        relatedAuditItems: field.relatedAuditItems,
      }
    }

    return Response.json(result)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const putSchema = z.object({
  fields: z.record(z.string(), z.unknown()),
  updatedBy: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; category: string }> }
) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, category } = await params
    await requireWorkspaceAccess(auth.userId, id)

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const { fields, updatedBy = 'system' } = parsed.data
    const now = new Date()

    const upserted = await Promise.all(
      Object.entries(fields).map(([fieldName, value]) =>
        db
          .insert(oracleFields)
          .values({
            workspaceId: id,
            category,
            fieldName,
            fieldValue: value as Parameters<typeof db.insert>[0] extends never ? never : unknown,
            lastUpdated: now,
            updatedBy,
          })
          .onConflictDoUpdate({
            target: [oracleFields.workspaceId, oracleFields.category, oracleFields.fieldName],
            set: {
              fieldValue: value as Parameters<typeof db.insert>[0] extends never ? never : unknown,
              lastUpdated: now,
              updatedBy,
            },
          })
          .returning()
      )
    )

    return Response.json(upserted.flat())
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
