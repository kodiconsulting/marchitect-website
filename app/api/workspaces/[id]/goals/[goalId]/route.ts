import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { goals } from '@/lib/db/schema'
import { verifyRequest, requireWorkspaceAccess } from '@/lib/auth'

const putSchema = z.object({
  goalText: z.string().optional(),
  timeframe: z.string().optional(),
  linkedRevenueTarget: z.number().optional(),
  status: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; goalId: string }> }
) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, goalId } = await params
    await requireWorkspaceAccess(auth.userId, id)

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const updateData: Partial<typeof goals.$inferInsert> & { lastUpdated?: Date } = {
      lastUpdated: new Date(),
    }
    const d = parsed.data
    if (d.goalText !== undefined) updateData.goalText = d.goalText
    if (d.timeframe !== undefined) updateData.timeframe = d.timeframe
    if (d.linkedRevenueTarget !== undefined)
      updateData.linkedRevenueTarget = d.linkedRevenueTarget.toString()
    if (d.status !== undefined) updateData.status = d.status

    const [updated] = await db
      .update(goals)
      .set(updateData)
      .where(and(eq(goals.id, goalId), eq(goals.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Goal not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
