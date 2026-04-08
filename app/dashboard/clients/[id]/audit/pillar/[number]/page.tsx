import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, pillars, auditItems, auditScores } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import AuditItemRow from './AuditItemRow'

export default async function PillarDrillDownPage({
  params,
}: {
  params: Promise<{ id: string; number: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id, number } = await params
  const pillarNumber = parseInt(number, 10)

  // Fetch workspace
  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, id))
    .limit(1)

  if (!workspace) notFound()

  // Fetch pillar
  const [pillar] = await db
    .select()
    .from(pillars)
    .where(eq(pillars.pillarNumber, pillarNumber))
    .limit(1)

  // Not seeded yet
  if (!pillar) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Link
          href={`/dashboard/clients/${id}/audit`}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 inline-block"
        >
          &larr; Back to Audit
        </Link>
        <Card className="bg-white border-gray-200">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 text-sm">
              Audit items not seeded yet.{' '}
              <Link href="/seed" className="text-violet-600 underline">
                Go to /seed
              </Link>{' '}
              to seed the audit item library.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fetch audit items for this pillar, sorted by tier then item_number
  const items = await db
    .select()
    .from(auditItems)
    .where(eq(auditItems.pillarId, pillar.id))

  // Sort: tier asc, then item_number numerically (e.g. "1.1" < "1.10")
  items.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier
    const [aMaj, aMin] = a.itemNumber.split('.').map(Number)
    const [bMaj, bMin] = b.itemNumber.split('.').map(Number)
    if (aMaj !== bMaj) return aMaj - bMaj
    return aMin - bMin
  })

  // Fetch scores for this workspace for these items
  const itemIds = items.map((i) => i.id)
  let scoreRows: { auditItemId: string; score: number; scoredDate: Date }[] = []
  if (itemIds.length > 0) {
    scoreRows = await db
      .select({
        auditItemId: auditScores.auditItemId,
        score: auditScores.score,
        scoredDate: auditScores.scoredDate,
      })
      .from(auditScores)
      .where(
        and(
          eq(auditScores.workspaceId, id),
          inArray(auditScores.auditItemId, itemIds)
        )
      )
  }

  const scoreMap = new Map<string, { score: number; scoredDate: Date }>(
    scoreRows.map((s) => [s.auditItemId, { score: s.score, scoredDate: s.scoredDate }])
  )

  // Summary counts
  const total = items.length
  let green = 0
  let yellow = 0
  let red = 0
  let notScored = 0
  for (const item of items) {
    const s = scoreMap.get(item.id)
    if (!s) {
      notScored++
    } else if (s.score === 2) {
      green++
    } else if (s.score === 1) {
      yellow++
    } else {
      red++
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}/audit`}
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 inline-block"
      >
        &larr; Back to Audit
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold flex-shrink-0">
            {pillarNumber}
          </span>
          <h1 className="text-2xl font-bold text-gray-900">{pillar.name}</h1>
        </div>
        <p className="text-gray-500 text-sm ml-10">{pillar.description}</p>
      </div>

      {/* Summary row */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
        <span className="text-gray-500">{total} items total</span>
        <span className="text-green-400 font-medium">{green} Complete</span>
        <span className="text-yellow-400 font-medium">{yellow} In Progress</span>
        <span className="text-red-400 font-medium">{red + notScored} Not Done</span>
      </div>

      {/* Item list */}
      <div>
        {items.length === 0 ? (
          <Card className="bg-white border-gray-200">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400 text-sm">No items found for this pillar.</p>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => {
            const s = scoreMap.get(item.id) ?? null
            return (
              <AuditItemRow
                key={item.id}
                item={{
                  id: item.id,
                  itemNumber: item.itemNumber,
                  description: item.description,
                  tier: item.tier,
                  toggleTags: item.toggleTags ?? [],
                }}
                score={s ? { score: s.score, scoredDate: s.scoredDate } : null}
                workspaceId={id}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
