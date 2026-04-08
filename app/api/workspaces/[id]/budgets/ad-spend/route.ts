import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { adSpendEntries } from '@/lib/db/schema'
import { auth } from '@/auth'

const postSchema = z.object({
  channel: z.string().min(1),
  weeklyAvg: z.number().optional(),
  monthlyBudget: z.number().optional(),
  notes: z.string().optional(),
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
      .from(adSpendEntries)
      .where(eq(adSpendEntries.workspaceId, id))

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
      .insert(adSpendEntries)
      .values({
        workspaceId: id,
        channel: parsed.data.channel,
        weeklyAvg: parsed.data.weeklyAvg != null ? parsed.data.weeklyAvg.toString() : null,
        monthlyBudget: parsed.data.monthlyBudget != null ? parsed.data.monthlyBudget.toString() : null,
        notes: parsed.data.notes ?? null,
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
