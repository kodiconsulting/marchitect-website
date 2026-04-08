import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { campaigns } from '@/lib/db/schema'
import { auth } from '@/auth'

const postSchema = z.object({
  name: z.string().min(1),
  channel: z.string().optional(),
  offer: z.string().optional(),
  audience: z.string().optional(),
  budget: z.number().optional(),
  cpl: z.number().optional(),
  status: z.string().optional(),
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
      .from(campaigns)
      .where(eq(campaigns.workspaceId, id))

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
      .insert(campaigns)
      .values({
        workspaceId: id,
        name: parsed.data.name,
        channel: parsed.data.channel ?? null,
        offer: parsed.data.offer ?? null,
        audience: parsed.data.audience ?? null,
        budget: parsed.data.budget != null ? parsed.data.budget.toString() : null,
        cpl: parsed.data.cpl != null ? parsed.data.cpl.toString() : null,
        status: parsed.data.status ?? 'active',
        notes: parsed.data.notes ?? null,
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
