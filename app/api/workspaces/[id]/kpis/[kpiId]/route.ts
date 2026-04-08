import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { kpis, kpiHistory } from '@/lib/db/schema'
import { verifyRequest, requireWorkspaceAccess } from '@/lib/auth'

const putSchema = z.object({
  name: z.string().optional(),
  definition: z.string().optional(),
  owner: z.string().optional(),
  targetValue: z.number().optional(),
  currentValue: z.number().optional(),
  unit: z.string().optional(),
  updateFrequency: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; kpiId: string }> }
) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, kpiId } = await params
    await requireWorkspaceAccess(auth.userId, id)

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const d = parsed.data
    const updateData: Partial<typeof kpis.$inferInsert> & { lastUpdated?: Date } = {
      lastUpdated: new Date(),
    }
    if (d.name !== undefined) updateData.name = d.name
    if (d.definition !== undefined) updateData.definition = d.definition
    if (d.owner !== undefined) updateData.owner = d.owner
    if (d.targetValue !== undefined) updateData.targetValue = d.targetValue.toString()
    if (d.currentValue !== undefined) updateData.currentValue = d.currentValue.toString()
    if (d.unit !== undefined) updateData.unit = d.unit
    if (d.updateFrequency !== undefined) updateData.updateFrequency = d.updateFrequency

    const [updated] = await db
      .update(kpis)
      .set(updateData)
      .where(and(eq(kpis.id, kpiId), eq(kpis.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'KPI not found' }, { status: 404 })
    }

    // If currentValue was updated, insert a history record
    if (d.currentValue !== undefined) {
      await db.insert(kpiHistory).values({
        kpiId,
        value: d.currentValue.toString(),
      })
    }

    return Response.json(updated)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; kpiId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, kpiId } = await params

    const [deleted] = await db
      .delete(kpis)
      .where(and(eq(kpis.id, kpiId), eq(kpis.workspaceId, id)))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'KPI not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
