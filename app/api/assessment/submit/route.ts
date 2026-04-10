import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { assessmentSubmissions } from '@/lib/db/schema'

const schema = z.object({
  sessionId: z.string().min(1),
  responses: z.record(z.string(), z.string()),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', issues: parsed.error.issues }, { status: 400 })
  }

  const [row] = await db
    .insert(assessmentSubmissions)
    .values({ sessionId: parsed.data.sessionId, responses: parsed.data.responses })
    .returning({ id: assessmentSubmissions.id })

  return NextResponse.json({ submissionId: row.id })
}
