import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { teamMembers } from '@/lib/db/schema'
import { auth } from '@/auth'

const postSchema = z.object({
  name: z.string().min(1),
  title: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  reportsTo: z.string().uuid().optional().nullable(),
  category: z.string().optional(),
  isExternal: z.boolean().optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const results = await db.select().from(teamMembers).where(eq(teamMembers.workspaceId, id))
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
    if (!parsed.success) return Response.json({ error: parsed.error.message }, { status: 400 })
    const [created] = await db.insert(teamMembers).values({
      workspaceId: id,
      name: parsed.data.name,
      title: parsed.data.title ?? null,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      reportsTo: parsed.data.reportsTo ?? null,
      category: parsed.data.category ?? 'client',
      isExternal: parsed.data.isExternal ?? false,
    }).returning()
    return Response.json(created, { status: 201 })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
