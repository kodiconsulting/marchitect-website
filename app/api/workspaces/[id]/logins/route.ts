import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { loginEntries } from '@/lib/db/schema'
import { verifyRequest, requireWorkspaceAccess } from '@/lib/auth'

const postSchema = z.object({
  toolName: z.string().min(1),
  category: z.string().min(1),
  loginUrl: z.string().optional(),
  username: z.string().optional(),
  owner: z.string().optional(),
  monthlyCost: z.number().optional(),
  notes: z.string().optional(),
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

    const category = request.nextUrl.searchParams.get('category')

    const conditions = [eq(loginEntries.workspaceId, id)]
    if (category) {
      conditions.push(eq(loginEntries.category, category))
    }

    const results = await db
      .select()
      .from(loginEntries)
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
      .insert(loginEntries)
      .values({
        workspaceId: id,
        toolName: parsed.data.toolName,
        category: parsed.data.category,
        loginUrl: parsed.data.loginUrl ?? null,
        username: parsed.data.username ?? null,
        owner: parsed.data.owner ?? null,
        monthlyCost: parsed.data.monthlyCost?.toString() ?? null,
        notes: parsed.data.notes ?? null,
      })
      .returning()

    return Response.json(created, { status: 201 })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
