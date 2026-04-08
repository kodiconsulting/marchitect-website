/**
 * Seeds the marketing_functions table.
 * Run with: npx tsx scripts/seed-marketing-functions.ts
 * Requires DATABASE_URL in environment (or .env.local).
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { marketingFunctions } from '../lib/db/schema'

const FUNCTIONS: { functionName: string; category: string; description: string }[] = [
  // Decision & Approval
  { functionName: 'Marketing strategy approval', category: 'Decision & Approval', description: 'Final sign-off on overall marketing strategy and direction.' },
  { functionName: 'Budget sign-off', category: 'Decision & Approval', description: 'Approval authority over marketing spend and budget allocation.' },
  { functionName: 'Brand standards', category: 'Decision & Approval', description: 'Ownership of brand guidelines and enforcement of visual/verbal identity.' },

  // Strategy & Planning
  { functionName: 'Annual marketing plan', category: 'Strategy & Planning', description: 'Creation and ownership of the yearly marketing roadmap.' },
  { functionName: 'Campaign planning', category: 'Strategy & Planning', description: 'Scoping and sequencing of individual marketing campaigns.' },
  { functionName: 'Channel selection', category: 'Strategy & Planning', description: 'Deciding which marketing channels to invest in and prioritize.' },

  // Execution & Production
  { functionName: 'Content creation', category: 'Execution & Production', description: 'Writing, designing, and producing marketing assets.' },
  { functionName: 'Paid ads management', category: 'Execution & Production', description: 'Running and optimizing paid advertising campaigns (Google, Meta, etc.).' },
  { functionName: 'Email campaigns', category: 'Execution & Production', description: 'Building, sending, and managing email marketing programs.' },
  { functionName: 'SEO', category: 'Execution & Production', description: 'Search engine optimization for organic discoverability.' },

  // Monitoring & Reporting
  { functionName: 'Analytics reporting', category: 'Monitoring & Reporting', description: 'Pulling and presenting marketing performance data.' },
  { functionName: 'KPI tracking', category: 'Monitoring & Reporting', description: 'Monitoring key performance indicators against targets.' },
  { functionName: 'Campaign performance', category: 'Monitoring & Reporting', description: 'Analyzing results of individual campaigns and making optimizations.' },

  // Vendor & Contractor Management
  { functionName: 'Agency relationships', category: 'Vendor & Contractor Management', description: 'Managing relationships with external marketing agencies.' },
  { functionName: 'Freelancer management', category: 'Vendor & Contractor Management', description: 'Sourcing, briefing, and managing freelance contractors.' },
]

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { ssl: 'require', prepare: false })
  const db = drizzle(client)

  const existing = await db.select().from(marketingFunctions).limit(1)
  if (existing.length > 0) {
    console.log('marketing_functions already has rows — skipping.')
    await client.end()
    return
  }

  console.log(`Seeding ${FUNCTIONS.length} marketing functions…`)
  await db.insert(marketingFunctions).values(FUNCTIONS)
  console.log('Done.')
  await client.end()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
