import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import bcrypt from 'bcryptjs'

export async function POST() {
  const existing = await db.select().from(users).limit(1)
  if (existing.length > 0) {
    return Response.json({ success: true, message: 'Already seeded' })
  }

  const hashedPassword = await bcrypt.hash('marchitect2026', 12)

  await db.insert(users).values({
    email: 'admin@marchitect.com',
    name: 'Mike Nowotarski',
    role: 'admin',
    hashedPassword,
  })

  return Response.json({ success: true, message: 'Seeded' })
}
