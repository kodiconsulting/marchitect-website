import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { db } from '@/lib/db'
import { clientPlaybookStatus } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  status: z.enum(['available', 'completed', 'not_yet_relevant']),
  completedVersionUrl: z.string().optional(),
  completedDate: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; playbookId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, playbookId } = await params

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const d = parsed.data

    const [upserted] = await db
      .insert(clientPlaybookStatus)
      .values({
        workspaceId: id,
        playbookItemId: playbookId,
        status: d.status,
        completedVersionUrl: d.completedVersionUrl ?? null,
        completedDate: d.completedDate ? new Date(d.completedDate) : null,
      })
      .onConflictDoUpdate({
        target: [clientPlaybookStatus.workspaceId, clientPlaybookStatus.playbookItemId],
        set: {
          status: d.status,
          ...(d.completedVersionUrl !== undefined && {
            completedVersionUrl: d.completedVersionUrl,
          }),
          ...(d.completedDate !== undefined && {
            completedDate: new Date(d.completedDate),
          }),
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
