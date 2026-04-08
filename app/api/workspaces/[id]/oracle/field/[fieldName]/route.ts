import { NextRequest } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { oracleFields } from '@/lib/db/schema'
import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fieldName: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, fieldName } = await params

    const category = request.nextUrl.searchParams.get('category')
    if (!category) {
      return Response.json(
        { error: 'Query param ?category= is required' },
        { status: 400 }
      )
    }

    const [field] = await db
      .select()
      .from(oracleFields)
      .where(
        and(
          eq(oracleFields.workspaceId, id),
          eq(oracleFields.category, category),
          eq(oracleFields.fieldName, fieldName)
        )
      )
      .limit(1)

    if (!field) {
      return Response.json({ error: 'Field not found' }, { status: 404 })
    }

    return Response.json({
      value: field.fieldValue,
      lastUpdated: field.lastUpdated,
      updatedBy: field.updatedBy,
      relatedAuditItems: field.relatedAuditItems,
    })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
