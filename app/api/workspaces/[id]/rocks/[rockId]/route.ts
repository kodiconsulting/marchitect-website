import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { rocks } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  quarter: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  definitionOfDone: z.string().optional(),
  owner: z.string().optional(),
  status: z.string().optional(),
  targetDate: z.string().optional(),
  linkedAuditItemIds: z.array(z.string().uuid()).optional(),
  completedAt: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; rockId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, rockId } = await params

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const updateData: Partial<typeof rocks.$inferInsert> = {}
    const d = parsed.data
    if (d.quarter !== undefined) updateData.quarter = d.quarter
    if (d.title !== undefined) updateData.title = d.title
    if (d.description !== undefined) updateData.description = d.description
    if (d.definitionOfDone !== undefined) updateData.definitionOfDone = d.definitionOfDone
    if (d.owner !== undefined) updateData.owner = d.owner
    if (d.status !== undefined) updateData.status = d.status
    if (d.targetDate !== undefined) updateData.targetDate = d.targetDate
    if (d.linkedAuditItemIds !== undefined) updateData.linkedAuditItemIds = d.linkedAuditItemIds
    if (d.completedAt !== undefined) updateData.completedAt = new Date(d.completedAt)

    const [updated] = await db
      .update(rocks)
      .set(updateData)
      .where(and(eq(rocks.id, rockId), eq(rocks.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Rock not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; rockId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, rockId } = await params

    const [deleted] = await db
      .delete(rocks)
      .where(and(eq(rocks.id, rockId), eq(rocks.workspaceId, id)))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Rock not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
