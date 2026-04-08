/**
 * Run Drizzle migrations programmatically.
 * Run with: npx tsx scripts/run-migrations.ts
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

;(async () => {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL not set')
    process.exit(1)
  }

  console.log('Connecting to DB...')
  const client = postgres(url, { max: 1 })
  const db = drizzle(client)

  console.log('Running migrations from lib/db/migrations/...')
  await migrate(db, { migrationsFolder: './lib/db/migrations' })

  console.log('Migrations complete.')
  await client.end()
  process.exit(0)
})().catch(e => {
  console.error('Migration failed:', e.message)
  process.exit(1)
})
