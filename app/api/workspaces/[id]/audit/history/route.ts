import { NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { auditScoreHistory } from '@/lib/db/schema'
import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

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
