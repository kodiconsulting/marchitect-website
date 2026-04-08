import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { campaigns } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  name: z.string().optional(),
  channel: z.string().optional(),
  offer: z.string().optional(),
  audience: z.string().optional(),
  budget: z.number().optional(),
  cpl: z.number().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; campaignId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, campaignId } = await params

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const updateData: Partial<typeof campaigns.$inferInsert> = {}
    const d = parsed.data
    if (d.name !== undefined) updateData.name = d.name
    if (d.channel !== undefined) updateData.channel = d.channel
    if (d.offer !== undefined) updateData.offer = d.offer
    if (d.audience !== undefined) updateData.audience = d.audience
    if (d.budget !== undefined) updateData.budget = d.budget.toString()
    if (d.cpl !== undefined) updateData.cpl = d.cpl.toString()
    if (d.status !== undefined) updateData.status = d.status
    if (d.notes !== undefined) updateData.notes = d.notes

    const [updated] = await db
      .update(campaigns)
      .set(updateData)
      .where(and(eq(campaigns.id, campaignId), eq(campaigns.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; campaignId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, campaignId } = await params

    const [deleted] = await db
      .delete(campaigns)
      .where(and(eq(campaigns.id, campaignId), eq(campaigns.workspaceId, id)))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
