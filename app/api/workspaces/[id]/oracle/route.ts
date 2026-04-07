import { NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { oracleFields } from '@/lib/db/schema'
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

    const fields = await db
      .select()
      .from(oracleFields)
      .where(eq(oracleFields.workspaceId, id))

    // Group by category → fieldName
    const grouped: Record<
      string,
      Record<
        string,
        {
          value: unknown
          lastUpdated: Date
          updatedBy: string
          relatedAuditItems: string[] | null
        }
      >
    > = {}

    for (const field of fields) {
      if (!grouped[field.category]) {
        grouped[field.category] = {}
      }
      grouped[field.category][field.fieldName] = {
        value: field.fieldValue,
        lastUpdated: field.lastUpdated,
        updatedBy: field.updatedBy,
        relatedAuditItems: field.relatedAuditItems,
      }
    }

    return Response.json(grouped)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
