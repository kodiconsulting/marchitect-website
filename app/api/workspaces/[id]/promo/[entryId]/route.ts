import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { promoEntries } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  month: z.string().optional(),
  year: z.number().optional(),
  serviceCategory: z.string().optional(),
  offer: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, entryId } = await params

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const updateData: Partial<typeof promoEntries.$inferInsert> = {}
    const d = parsed.data
    if (d.month !== undefined) updateData.month = d.month
    if (d.year !== undefined) updateData.year = d.year
    if (d.serviceCategory !== undefined) updateData.serviceCategory = d.serviceCategory
    if (d.offer !== undefined) updateData.offer = d.offer
    if (d.status !== undefined) updateData.status = d.status
    if (d.notes !== undefined) updateData.notes = d.notes

    const [updated] = await db
      .update(promoEntries)
      .set(updateData)
      .where(and(eq(promoEntries.id, entryId), eq(promoEntries.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Promo entry not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, entryId } = await params

    const [deleted] = await db
      .delete(promoEntries)
      .where(and(eq(promoEntries.id, entryId), eq(promoEntries.workspaceId, id)))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Promo entry not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
