import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { rocks } from '@/lib/db/schema'
import { auth } from '@/auth'

const postSchema = z.object({
  quarter: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  definitionOfDone: z.string().optional(),
  owner: z.string().min(1),
  status: z.string().optional(),
  targetDate: z.string().optional(),
  linkedAuditItemIds: z.array(z.string().uuid()).optional(),
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

    const quarter = request.nextUrl.searchParams.get('quarter')

    const conditions = [eq(rocks.workspaceId, id)]
    if (quarter) {
      conditions.push(eq(rocks.quarter, quarter))
    }

    const results = await db
      .select()
      .from(rocks)
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
      .insert(rocks)
      .values({
        workspaceId: id,
        quarter: parsed.data.quarter,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        definitionOfDone: parsed.data.definitionOfDone ?? null,
        owner: parsed.data.owner,
        status: parsed.data.status ?? 'not_started',
        targetDate: parsed.data.targetDate ?? null,
        linkedAuditItemIds: parsed.data.linkedAuditItemIds ?? [],
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
