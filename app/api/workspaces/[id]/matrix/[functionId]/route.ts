import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { db } from '@/lib/db'
import { functionAssignments } from '@/lib/db/schema'
import { verifyRequest, requireWorkspaceAccess } from '@/lib/auth'

const putSchema = z.object({
  assignedOwner: z.string().optional(),
  internalExternal: z.string().optional(),
  gwcGet: z.boolean().optional(),
  gwcWant: z.boolean().optional(),
  gwcCapacity: z.boolean().optional(),
  notes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; functionId: string }> }
) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, functionId } = await params
    await requireWorkspaceAccess(auth.userId, id)

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const d = parsed.data
    const now = new Date()

    const [upserted] = await db
      .insert(functionAssignments)
      .values({
        workspaceId: id,
        functionId,
        assignedOwner: d.assignedOwner ?? null,
        internalExternal: d.internalExternal ?? null,
        gwcGet: d.gwcGet ?? null,
        gwcWant: d.gwcWant ?? null,
        gwcCapacity: d.gwcCapacity ?? null,
        notes: d.notes ?? null,
        lastUpdated: now,
      })
      .onConflictDoUpdate({
        target: [functionAssignments.workspaceId, functionAssignments.functionId],
        set: {
          ...(d.assignedOwner !== undefined && { assignedOwner: d.assignedOwner }),
          ...(d.internalExternal !== undefined && { internalExternal: d.internalExternal }),
          ...(d.gwcGet !== undefined && { gwcGet: d.gwcGet }),
          ...(d.gwcWant !== undefined && { gwcWant: d.gwcWant }),
          ...(d.gwcCapacity !== undefined && { gwcCapacity: d.gwcCapacity }),
          ...(d.notes !== undefined && { notes: d.notes }),
          lastUpdated: now,
        },
      })
      .returning()

    return Response.json(upserted)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
