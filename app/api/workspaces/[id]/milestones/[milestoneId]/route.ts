import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { milestones } from '@/lib/db/schema'
import { verifyRequest, requireWorkspaceAccess } from '@/lib/auth'

const putSchema = z.object({
  title: z.string().optional(),
  owner: z.string().optional(),
  status: z.string().optional(),
  targetDate: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, milestoneId } = await params
    await requireWorkspaceAccess(auth.userId, id)

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const updateData: Partial<typeof milestones.$inferInsert> = {}
    const d = parsed.data
    if (d.title !== undefined) updateData.title = d.title
    if (d.owner !== undefined) updateData.owner = d.owner
    if (d.status !== undefined) updateData.status = d.status
    if (d.targetDate !== undefined) updateData.targetDate = d.targetDate

    const [updated] = await db
      .update(milestones)
      .set(updateData)
      .where(and(eq(milestones.id, milestoneId), eq(milestones.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Milestone not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
