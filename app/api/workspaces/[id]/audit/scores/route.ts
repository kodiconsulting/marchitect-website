import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { auditScores, auditScoreHistory } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  scores: z.array(
    z.object({
      auditItemId: z.string().uuid(),
      score: z.union([z.literal(0), z.literal(1), z.literal(2)]),
      notes: z.string().optional(),
    })
  ),
  scoredBy: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const { scores, scoredBy = 'system' } = parsed.data
    const now = new Date()

    const results = await Promise.all(
      scores.map(async ({ auditItemId, score, notes }) => {
        // Insert history record
        await db.insert(auditScoreHistory).values({
          workspaceId: id,
          auditItemId,
          score,
          scoredBy,
          scoredDate: now,
          notes: notes ?? null,
        })

        // Upsert current score
        const [upserted] = await db
          .insert(auditScores)
          .values({
            workspaceId: id,
            auditItemId,
            score,
            scoredBy,
            scoredDate: now,
            notes: notes ?? null,
          })
          .onConflictDoUpdate({
            target: [auditScores.workspaceId, auditScores.auditItemId],
            set: {
              score,
              scoredBy,
              scoredDate: now,
              notes: notes ?? null,
            },
          })
          .returning()
        return upserted
      })
    )

    return Response.json(results)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
