import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { teamMembers } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  reportsTo: z.string().uuid().optional().nullable(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const { id, memberId } = await params
    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: parsed.error.message }, { status: 400 })
    const d = parsed.data
    const updateData: Partial<typeof teamMembers.$inferInsert> = {}
    if (d.name !== undefined) updateData.name = d.name
    if (d.title !== undefined) updateData.title = d.title
    if (d.email !== undefined) updateData.email = d.email
    if (d.phone !== undefined) updateData.phone = d.phone
    if ('reportsTo' in d) updateData.reportsTo = d.reportsTo ?? null
    const [updated] = await db.update(teamMembers).set(updateData)
      .where(and(eq(teamMembers.id, memberId), eq(teamMembers.workspaceId, id))).returning()
    if (!updated) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(updated)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const { id, memberId } = await params
    const [deleted] = await db.delete(teamMembers)
      .where(and(eq(teamMembers.id, memberId), eq(teamMembers.workspaceId, id))).returning()
    if (!deleted) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
