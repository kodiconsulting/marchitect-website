/**
 * Create a Portal workspace and API key for a client.
 * Run with: npx tsx scripts/setup-client.ts "<ClientName>"
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { workspaces, workspaceApiKeys } from '../lib/db/schema'
import { createHash, randomBytes } from 'crypto'
import { sql } from 'drizzle-orm'

;(async () => {
  const clientName = process.argv[2]
  if (!clientName) {
    console.error('Usage: npx tsx scripts/setup-client.ts "<ClientName>"')
    process.exit(1)
  }

  const url = process.env.DATABASE_URL
  if (!url) { console.error('DATABASE_URL not set'); process.exit(1) }

  const client = postgres(url, { ssl: 'require', prepare: false, max: 1 })
  const db = drizzle(client)

  // Check if workspace already exists
  const existing = await db
    .select()
    .from(workspaces)
    .limit(10)

  const match = existing.find(w => w.clientName.toLowerCase() === clientName.toLowerCase())

  let workspaceId: string
  if (match) {
    console.log(`Workspace already exists for "${clientName}": ${match.id}`)
    workspaceId = match.id
  } else {
    const [ws] = await db.insert(workspaces).values({ clientName }).returning()
    workspaceId = ws.id
    console.log(`Created workspace for "${clientName}": ${workspaceId}`)
  }

  // Generate API key
  const rawKey = `sk-${randomBytes(32).toString('hex')}`
  const keyHash = createHash('sha256').update(rawKey).digest('hex')
  await db.insert(workspaceApiKeys).values({ workspaceId, keyHash })

  console.log('\n=== .portal.json ===')
  console.log(JSON.stringify({ workspaceId, apiKey: rawKey, baseUrl: 'http://localhost:3000' }, null, 2))
  console.log('\n(Save the apiKey — it cannot be recovered.)')

  await client.end()
})().catch(e => { console.error('Error:', e.message); process.exit(1) })
