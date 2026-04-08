import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { workspaceEngagement } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  phase: z.number().int().min(1),
  summaryNotes: z.string().optional(),
})

interface PhaseHistoryEntry {
  phase: number
  start_date: string
  end_date: string | null
  summary_notes: string | null
}

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

    const { phase, summaryNotes } = parsed.data
    const now = new Date().toISOString()

    // Get existing engagement record
    const [existing] = await db
      .select()
      .from(workspaceEngagement)
      .where(eq(workspaceEngagement.workspaceId, id))
      .limit(1)

    if (!existing) {
      // Create a new engagement record
      const newHistory: PhaseHistoryEntry[] = [
        { phase, start_date: now, end_date: null, summary_notes: summaryNotes ?? null },
      ]
      const [created] = await db
        .insert(workspaceEngagement)
        .values({
          workspaceId: id,
          currentPhase: phase,
          phaseHistory: newHistory,
        })
        .returning()
      return Response.json(created, { status: 201 })
    }

    // Update phase history: close current phase, add new entry
    const history = (existing.phaseHistory as PhaseHistoryEntry[]) ?? []

    // Close the last open entry if any
    const updatedHistory = history.map((entry, idx) => {
      if (idx === history.length - 1 && entry.end_date === null) {
        return { ...entry, end_date: now }
      }
      return entry
    })

    updatedHistory.push({
      phase,
      start_date: now,
      end_date: null,
      summary_notes: summaryNotes ?? null,
    })

    const [updated] = await db
      .update(workspaceEngagement)
      .set({
        currentPhase: phase,
        phaseHistory: updatedHistory,
      })
      .where(eq(workspaceEngagement.workspaceId, id))
      .returning()

    return Response.json(updated)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
