import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { leadSequences } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  name: z.string().optional(),
  stage: z.string().optional(),
  platform: z.string().optional(),
  docLink: z.string().optional(),
  notes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sequenceId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, sequenceId } = await params

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const updateData: Partial<typeof leadSequences.$inferInsert> = {}
    const d = parsed.data
    if (d.name !== undefined) updateData.name = d.name
    if (d.stage !== undefined) updateData.stage = d.stage
    if (d.platform !== undefined) updateData.platform = d.platform
    if (d.docLink !== undefined) updateData.docLink = d.docLink
    if (d.notes !== undefined) updateData.notes = d.notes

    const [updated] = await db
      .update(leadSequences)
      .set(updateData)
      .where(and(eq(leadSequences.id, sequenceId), eq(leadSequences.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Sequence not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; sequenceId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, sequenceId } = await params

    const [deleted] = await db
      .delete(leadSequences)
      .where(and(eq(leadSequences.id, sequenceId), eq(leadSequences.workspaceId, id)))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Sequence not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
