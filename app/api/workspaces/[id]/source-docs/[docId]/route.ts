import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { sourceDocuments } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  fileName: z.string().optional(),
  docDate: z.string().optional(),
  docType: z.string().optional(),
  fileLink: z.string().optional(),
  keyThemes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, docId } = await params

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const updateData: Partial<typeof sourceDocuments.$inferInsert> = {}
    const d = parsed.data
    if (d.fileName !== undefined) updateData.fileName = d.fileName
    if (d.docDate !== undefined) updateData.docDate = d.docDate
    if (d.docType !== undefined) updateData.docType = d.docType
    if (d.fileLink !== undefined) updateData.fileLink = d.fileLink
    if (d.keyThemes !== undefined) updateData.keyThemes = d.keyThemes

    const [updated] = await db
      .update(sourceDocuments)
      .set(updateData)
      .where(and(eq(sourceDocuments.id, docId), eq(sourceDocuments.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Source document not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, docId } = await params

    const [deleted] = await db
      .delete(sourceDocuments)
      .where(and(eq(sourceDocuments.id, docId), eq(sourceDocuments.workspaceId, id)))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Source document not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
