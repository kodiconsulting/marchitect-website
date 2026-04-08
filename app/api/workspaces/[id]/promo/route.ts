import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { promoEntries } from '@/lib/db/schema'
import { auth } from '@/auth'

const postSchema = z.object({
  month: z.string().min(1),
  year: z.number(),
  serviceCategory: z.string().optional(),
  offer: z.string().optional(),
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
      .from(promoEntries)
      .where(eq(promoEntries.workspaceId, id))

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
      .insert(promoEntries)
      .values({
        workspaceId: id,
        month: parsed.data.month,
        year: parsed.data.year,
        serviceCategory: parsed.data.serviceCategory ?? null,
        offer: parsed.data.offer ?? null,
        status: parsed.data.status ?? 'upcoming',
        notes: parsed.data.notes ?? null,
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
