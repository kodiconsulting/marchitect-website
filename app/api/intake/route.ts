import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { intakeResponses, workspaces, oracleFields } from '@/lib/db/schema'
import { verifyRequest, requireWorkspaceAccess } from '@/lib/auth'

const postSchema = z.object({
  workspaceId: z.string().uuid(),
  data: z.record(z.string(), z.unknown()),
  submittedBy: z.string().uuid().optional(),
})

// Map of intake field keys to toggle column names.
// Extend this map as intake questions are defined.
type ToggleKey = 'toggleLeadGen' | 'toggleEcom' | 'toggleB2b' | 'toggleB2c'
const TOGGLE_FIELD_MAP: Record<string, ToggleKey> = {
  has_lead_gen: 'toggleLeadGen',
  has_ecom: 'toggleEcom',
  has_b2b: 'toggleB2b',
  has_b2c: 'toggleB2c',
}

// Map of intake field keys to oracle field (category, fieldName) for pre-population.
const ORACLE_FIELD_MAP: Array<{
  intakeKey: string
  category: string
  fieldName: string
}> = [
  { intakeKey: 'company_name', category: 'company', fieldName: 'company_name' },
  { intakeKey: 'industry', category: 'company', fieldName: 'industry' },
  { intakeKey: 'annual_revenue', category: 'financials', fieldName: 'annual_revenue' },
  { intakeKey: 'website_url', category: 'company', fieldName: 'website_url' },
  { intakeKey: 'monthly_ad_spend', category: 'financials', fieldName: 'monthly_ad_spend' },
  {
    intakeKey: 'primary_revenue_channel',
    category: 'strategy',
    fieldName: 'primary_revenue_channel',
  },
]

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyRequest(request)
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const { workspaceId, data, submittedBy } = parsed.data

    await requireWorkspaceAccess(auth.userId, workspaceId)

    // Upsert intake response
    const [saved] = await db
      .insert(intakeResponses)
      .values({
        workspaceId,
        data,
        submissionDate: new Date(),
        submittedBy: submittedBy ?? null,
      })
      .onConflictDoUpdate({
        target: [intakeResponses.workspaceId],
        set: {
          data,
          submissionDate: new Date(),
          submittedBy: submittedBy ?? null,
        },
      })
      .returning()

    // Activate toggles based on intake data
    const toggleUpdates: Record<ToggleKey, boolean> = {} as Record<ToggleKey, boolean>
    let hasToggleUpdates = false
    for (const [key, col] of Object.entries(TOGGLE_FIELD_MAP)) {
      if (data[key] === true || data[key] === 'true' || data[key] === 1) {
        toggleUpdates[col] = true
        hasToggleUpdates = true
      }
    }

    if (hasToggleUpdates) {
      await db.update(workspaces).set(toggleUpdates).where(eq(workspaces.id, workspaceId))
    }

    // Pre-populate oracle fields from intake data
    const now = new Date()
    const oracleUpserts = ORACLE_FIELD_MAP.filter(({ intakeKey }) => data[intakeKey] !== undefined)

    if (oracleUpserts.length > 0) {
      await Promise.all(
        oracleUpserts.map(({ intakeKey, category, fieldName }) =>
          db
            .insert(oracleFields)
            .values({
              workspaceId,
              category,
              fieldName,
              fieldValue: data[intakeKey],
              lastUpdated: now,
              updatedBy: submittedBy ?? 'intake',
            })
            .onConflictDoUpdate({
              target: [oracleFields.workspaceId, oracleFields.category, oracleFields.fieldName],
              set: {
                fieldValue: data[intakeKey],
                lastUpdated: now,
                updatedBy: submittedBy ?? 'intake',
              },
            })
        )
      )
    }

    return Response.json(saved, { status: 201 })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
