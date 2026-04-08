import { NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { workspaceEngagement } from '@/lib/db/schema'
import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const [engagement] = await db
      .select()
      .from(workspaceEngagement)
      .where(eq(workspaceEngagement.workspaceId, id))
      .limit(1)

    if (!engagement) {
      return Response.json({ error: 'Engagement record not found' }, { status: 404 })
    }

    return Response.json(engagement)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
