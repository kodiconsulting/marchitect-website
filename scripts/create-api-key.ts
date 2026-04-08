/**
 * Creates an API key for a workspace.
 * Run with: npx tsx scripts/create-api-key.ts <workspaceId>
 * Requires DATABASE_URL in environment (or .env.local).
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
import { db } from '../lib/db'
import { workspaceApiKeys } from '../lib/db/schema'
import { createHash, randomBytes } from 'crypto'

;(async () => {
  const workspaceId = process.argv[2]
  if (!workspaceId) {
    console.error('Usage: npx tsx scripts/create-api-key.ts <workspaceId>')
    process.exit(1)
  }

  // Simple UUID guard — saves the user from a raw pg error
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!UUID_RE.test(workspaceId)) {
    console.error('Error: workspaceId must be a valid UUID')
    process.exit(1)
  }

  const rawKey = `sk-${randomBytes(32).toString('hex')}`
  const keyHash = createHash('sha256').update(rawKey).digest('hex')

  await db.insert(workspaceApiKeys).values({ workspaceId, keyHash })

  console.log('Raw API key (save this — it cannot be recovered):')
  console.log(rawKey)
  console.log()
  console.log(`Workspace: ${workspaceId}`)
})().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
