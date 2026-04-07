import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { milestones } from '@/lib/db/schema'
import { verifyRequest, requireWorkspaceAccess } from '@/lib/auth'

const postSchema = z.object({
  rockId: z.string().uuid(),
  title: z.string().min(1),
  owner: z.string().min(1),
  status: z.string().optional(),
  targetDate: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await requireWorkspaceAccess(auth.userId, id)

    const rockId = request.nextUrl.searchParams.get('rock')

    const conditions = [eq(milestones.workspaceId, id)]
    if (rockId) {
      conditions.push(eq(milestones.rockId, rockId))
    }

    const results = await db
      .select()
      .from(milestones)
      .where(and(...conditions))

    return Response.json(results)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await requireWorkspaceAccess(auth.userId, id)

    const body = await request.json()
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const [created] = await db
      .insert(milestones)
      .values({
        workspaceId: id,
        rockId: parsed.data.rockId,
        title: parsed.data.title,
        owner: parsed.data.owner,
        status: parsed.data.status ?? 'not_started',
        targetDate: parsed.data.targetDate ?? null,
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
