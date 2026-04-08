import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { kpis } from '@/lib/db/schema'
import { auth } from '@/auth'

const postSchema = z.object({
  name: z.string().min(1),
  definition: z.string().optional(),
  owner: z.string().optional(),
  targetValue: z.number().optional(),
  currentValue: z.number().optional(),
  unit: z.string().optional(),
  updateFrequency: z.string().min(1),
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
      .from(kpis)
      .where(eq(kpis.workspaceId, id))

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
      .insert(kpis)
      .values({
        workspaceId: id,
        name: parsed.data.name,
        definition: parsed.data.definition ?? null,
        owner: parsed.data.owner ?? null,
        targetValue: parsed.data.targetValue?.toString() ?? null,
        currentValue: parsed.data.currentValue?.toString() ?? null,
        unit: parsed.data.unit ?? null,
        updateFrequency: parsed.data.updateFrequency,
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
