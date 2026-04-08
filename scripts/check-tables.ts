import { config } from 'dotenv'
config({ path: '.env.local' })
import postgres from 'postgres'

;(async () => {
  const client = postgres(process.env.DATABASE_URL!, { max: 1 })
  const tables = await client`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `
  console.log('Tables in public schema:')
  tables.forEach(t => console.log(' -', t.table_name))
  console.log(`\nTotal: ${tables.length} tables`)
  await client.end()
})().catch(e => { console.error(e.message); process.exit(1) })
