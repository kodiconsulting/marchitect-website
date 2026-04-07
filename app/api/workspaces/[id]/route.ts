import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { workspaces, workspaceEngagement } from '@/lib/db/schema'
import { verifyRequest, requireWorkspaceAccess } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await requireWorkspaceAccess(auth.userId, id)

    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id))
      .limit(1)

    if (!workspace) {
      return Response.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const [engagement] = await db
      .select()
      .from(workspaceEngagement)
      .where(eq(workspaceEngagement.workspaceId, id))
      .limit(1)

    return Response.json({ ...workspace, engagement: engagement ?? null })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const putSchema = z.object({
  clientName: z.string().min(1).optional(),
  engagementStartDate: z.string().optional(),
  currentPhase: z.number().int().optional(),
  toggleCore: z.boolean().optional(),
  toggleLeadGen: z.boolean().optional(),
  toggleEcom: z.boolean().optional(),
  toggleB2b: z.boolean().optional(),
  toggleB2c: z.boolean().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await requireWorkspaceAccess(auth.userId, id)

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const [updated] = await db
      .update(workspaces)
      .set(parsed.data)
      .where(eq(workspaces.id, id))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Workspace not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
