import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { db } from '@/lib/db'
import { workspaces } from '@/lib/db/schema'

const createWorkspaceSchema = z.object({
  clientName: z.string().min(1),
  engagementStartDate: z.string().optional().nullable(),
  toggleB2b: z.boolean().optional(),
  toggleB2c: z.boolean().optional(),
  toggleLeadGen: z.boolean().optional(),
  toggleEcom: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createWorkspaceSchema.parse(body)

    const [workspace] = await db
      .insert(workspaces)
      .values({
        clientName: parsed.clientName,
        engagementStartDate: parsed.engagementStartDate ?? null,
        toggleB2b: parsed.toggleB2b ?? false,
        toggleB2c: parsed.toggleB2c ?? false,
        toggleLeadGen: parsed.toggleLeadGen ?? false,
        toggleEcom: parsed.toggleEcom ?? false,
      })
      .returning()

    return Response.json(workspace, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Invalid input', issues: error.issues }, { status: 400 })
    }
    console.error('Failed to create workspace:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
