import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { workspaceLocations } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  services: z.string().optional(),
  notes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; locationId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, locationId } = await params

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const updateData: Partial<typeof workspaceLocations.$inferInsert> = {}
    const d = parsed.data
    if (d.name !== undefined) updateData.name = d.name
    if (d.address !== undefined) updateData.address = d.address
    if (d.services !== undefined) updateData.services = d.services
    if (d.notes !== undefined) updateData.notes = d.notes

    const [updated] = await db
      .update(workspaceLocations)
      .set(updateData)
      .where(and(eq(workspaceLocations.id, locationId), eq(workspaceLocations.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Location not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; locationId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, locationId } = await params

    const [deleted] = await db
      .delete(workspaceLocations)
      .where(and(eq(workspaceLocations.id, locationId), eq(workspaceLocations.workspaceId, id)))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Location not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
