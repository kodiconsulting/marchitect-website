import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { goals } from '@/lib/db/schema'
import { auth } from '@/auth'

const postSchema = z.object({
  goalText: z.string().min(1),
  timeframe: z.string().min(1),
  linkedRevenueTarget: z.number().optional(),
  status: z.string().optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const results = await db
      .select()
      .from(goals)
      .where(eq(goals.workspaceId, id))

    return Response.json(results)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const body = await request.json()
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const [created] = await db
      .insert(goals)
      .values({
        workspaceId: id,
        goalText: parsed.data.goalText,
        timeframe: parsed.data.timeframe,
        linkedRevenueTarget: parsed.data.linkedRevenueTarget?.toString() ?? null,
        status: parsed.data.status ?? 'active',
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
