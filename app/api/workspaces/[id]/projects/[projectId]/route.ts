import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { clientProjects } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  name: z.string().optional(),
  owner: z.string().optional(),
  status: z.string().optional(),
  isPast: z.boolean().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; projectId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, projectId } = await params

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const updateData: Partial<typeof clientProjects.$inferInsert> = {}
    const d = parsed.data
    if (d.name !== undefined) updateData.name = d.name
    if (d.owner !== undefined) updateData.owner = d.owner
    if (d.status !== undefined) updateData.status = d.status
    if (d.isPast !== undefined) updateData.isPast = d.isPast
    if (d.dueDate !== undefined) updateData.dueDate = d.dueDate
    if (d.notes !== undefined) updateData.notes = d.notes

    const [updated] = await db
      .update(clientProjects)
      .set(updateData)
      .where(and(eq(clientProjects.id, projectId), eq(clientProjects.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Project not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; projectId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, projectId } = await params

    const [deleted] = await db
      .delete(clientProjects)
      .where(and(eq(clientProjects.id, projectId), eq(clientProjects.workspaceId, id)))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Project not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
