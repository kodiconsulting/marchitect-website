import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { loginEntries } from '@/lib/db/schema'
import { verifyRequest, requireWorkspaceAccess } from '@/lib/auth'

const putSchema = z.object({
  toolName: z.string().optional(),
  category: z.string().optional(),
  loginUrl: z.string().optional(),
  username: z.string().optional(),
  owner: z.string().optional(),
  monthlyCost: z.number().optional(),
  notes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; loginId: string }> }
) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, loginId } = await params
    await requireWorkspaceAccess(auth.userId, id)

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const d = parsed.data
    const updateData: Partial<typeof loginEntries.$inferInsert> & { lastUpdated?: Date } = {
      lastUpdated: new Date(),
    }
    if (d.toolName !== undefined) updateData.toolName = d.toolName
    if (d.category !== undefined) updateData.category = d.category
    if (d.loginUrl !== undefined) updateData.loginUrl = d.loginUrl
    if (d.username !== undefined) updateData.username = d.username
    if (d.owner !== undefined) updateData.owner = d.owner
    if (d.monthlyCost !== undefined) updateData.monthlyCost = d.monthlyCost.toString()
    if (d.notes !== undefined) updateData.notes = d.notes

    const [updated] = await db
      .update(loginEntries)
      .set(updateData)
      .where(and(eq(loginEntries.id, loginId), eq(loginEntries.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Login entry not found' }, { status: 404 })
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
  { params }: { params: Promise<{ id: string; loginId: string }> }
) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, loginId } = await params
    await requireWorkspaceAccess(auth.userId, id)

    const [deleted] = await db
      .delete(loginEntries)
      .where(and(eq(loginEntries.id, loginId), eq(loginEntries.workspaceId, id)))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Login entry not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
