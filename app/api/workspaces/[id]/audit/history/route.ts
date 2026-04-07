import { NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { auditScoreHistory } from '@/lib/db/schema'
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

    const history = await db
      .select()
      .from(auditScoreHistory)
      .where(eq(auditScoreHistory.workspaceId, id))

    return Response.json(history)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
