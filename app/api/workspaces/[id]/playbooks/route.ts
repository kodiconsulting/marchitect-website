import { NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { workspaces, playbookItems, clientPlaybookStatus } from '@/lib/db/schema'
import { auth } from '@/auth'

function getActiveToggles(workspace: typeof workspaces.$inferSelect): string[] {
  const toggles: string[] = []
  if (workspace.toggleCore) toggles.push('core')
  if (workspace.toggleLeadGen) toggles.push('lead_gen')
  if (workspace.toggleEcom) toggles.push('ecom')
  if (workspace.toggleB2b) toggles.push('b2b')
  if (workspace.toggleB2c) toggles.push('b2c')
  return toggles
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id))
      .limit(1)

    if (!workspace) {
      return Response.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const activeToggles = getActiveToggles(workspace)

    const allPlaybooks = await db.select().from(playbookItems)

    // Filter: include playbooks whose toggleRequirements are empty OR
    // have at least one requirement matching an active toggle
    const filteredPlaybooks = allPlaybooks.filter((pb) => {
      const reqs = pb.toggleRequirements ?? []
      if (reqs.length === 0) return true
      return reqs.some((req) => activeToggles.includes(req))
    })

    // Get client statuses
    const statuses = await db
      .select()
      .from(clientPlaybookStatus)
      .where(eq(clientPlaybookStatus.workspaceId, id))

    const statusMap = new Map<string, typeof clientPlaybookStatus.$inferSelect>()
    for (const s of statuses) {
      statusMap.set(s.playbookItemId, s)
    }

    const result = filteredPlaybooks.map((pb) => ({
      ...pb,
      clientStatus: statusMap.get(pb.id) ?? null,
    }))

    return Response.json(result)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
