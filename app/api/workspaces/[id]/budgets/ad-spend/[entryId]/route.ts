import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { adSpendEntries } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  channel: z.string().optional(),
  weeklyAvg: z.number().optional(),
  monthlyBudget: z.number().optional(),
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

    const updateData: Partial<typeof adSpendEntries.$inferInsert> = {}
    const d = parsed.data
    if (d.channel !== undefined) updateData.channel = d.channel
    if (d.weeklyAvg !== undefined) updateData.weeklyAvg = d.weeklyAvg.toString()
    if (d.monthlyBudget !== undefined) updateData.monthlyBudget = d.monthlyBudget.toString()
    if (d.notes !== undefined) updateData.notes = d.notes

    const [updated] = await db
      .update(adSpendEntries)
      .set(updateData)
      .where(and(eq(adSpendEntries.id, entryId), eq(adSpendEntries.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Ad spend entry not found' }, { status: 404 })
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
      .delete(adSpendEntries)
      .where(and(eq(adSpendEntries.id, entryId), eq(adSpendEntries.workspaceId, id)))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Ad spend entry not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
