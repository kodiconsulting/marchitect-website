import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { contactInquiries } from '@/lib/db/schema'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(1),
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
    .insert(contactInquiries)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company ?? null,
      message: parsed.data.message,
    })
    .returning({ id: contactInquiries.id })

  return NextResponse.json({ success: true, id: row.id })
}
