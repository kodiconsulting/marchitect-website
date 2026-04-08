import { db } from '../lib/db'
import { workspaceApiKeys } from '../lib/db/schema'
import { createHash, randomBytes } from 'crypto'

;(async () => {
  const workspaceId = process.argv[2]
  if (!workspaceId) {
    console.error('Usage: npx tsx scripts/create-api-key.ts <workspaceId>')
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
