import { NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { marketingFunctions, functionAssignments } from '@/lib/db/schema'
import { auth } from '@/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const allFunctions = await db.select().from(marketingFunctions)
    const wsAssignments = await db
      .select()
      .from(functionAssignments)
      .where(eq(functionAssignments.workspaceId, id))

    const assignmentMap = new Map<string, typeof functionAssignments.$inferSelect>()
    for (const a of wsAssignments) {
      assignmentMap.set(a.functionId, a)
    }

    const response = allFunctions.map((fn) => ({
      ...fn,
      assignment: assignmentMap.get(fn.id) ?? null,
    }))

    return Response.json(response)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
