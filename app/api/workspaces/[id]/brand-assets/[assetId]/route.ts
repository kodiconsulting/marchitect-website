import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { brandAssets } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  assetName: z.string().optional(),
  assetType: z.string().optional(),
  haveIt: z.string().optional(),
  link: z.string().optional(),
  notes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, assetId } = await params

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const updateData: Partial<typeof brandAssets.$inferInsert> = {}
    const d = parsed.data
    if (d.assetName !== undefined) updateData.assetName = d.assetName
    if (d.assetType !== undefined) updateData.assetType = d.assetType
    if (d.haveIt !== undefined) updateData.haveIt = d.haveIt
    if (d.link !== undefined) updateData.link = d.link
    if (d.notes !== undefined) updateData.notes = d.notes

    const [updated] = await db
      .update(brandAssets)
      .set(updateData)
      .where(and(eq(brandAssets.id, assetId), eq(brandAssets.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Brand asset not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, assetId } = await params

    const [deleted] = await db
      .delete(brandAssets)
      .where(and(eq(brandAssets.id, assetId), eq(brandAssets.workspaceId, id)))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Brand asset not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
