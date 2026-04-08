import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, pillars, auditItems, auditScores } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

function scoreColor(score: number) {
  if (score >= 70) return 'text-green-400 bg-green-400/10'
  if (score >= 40) return 'text-yellow-400 bg-yellow-400/10'
  return 'text-red-400 bg-red-400/10'
}

function scoreLabel(score: number) {
  if (score >= 70) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Low'
}

function HealthRing({ score }: { score: number }) {
  const color =
    score >= 70 ? '#4ade80' : score >= 40 ? '#facc15' : '#f87171'
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const filled = (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth="12"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{score}%</span>
      </div>
    </div>
  )
}

export default async function ClientAuditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params

  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, id))
    .limit(1)

  if (!workspace) {
    notFound()
  }

  // Fetch pillars
  const allPillars = await db
    .select()
    .from(pillars)
    .orderBy(pillars.pillarNumber)

  // Fetch audit items + scores for this workspace to compute pillar scores
  let pillarScores: Map<string, { total: number; scored: number; greenCount: number }> = new Map()
  let overallScore = 0

  if (allPillars.length > 0) {
    const pillarIds = allPillars.map((p) => p.id)
    const items = await db
      .select()
      .from(auditItems)
      .where(inArray(auditItems.pillarId, pillarIds))

    if (items.length > 0) {
      const itemIds = items.map((i) => i.id)
      const scores = await db
        .select()
        .from(auditScores)
        .where(eq(auditScores.workspaceId, id))

      const scoreMap = new Map<string, number>()
      for (const s of scores) {
        if (itemIds.includes(s.auditItemId)) {
          scoreMap.set(s.auditItemId, s.score)
        }
      }

      // Group items by pillar
      for (const pillar of allPillars) {
        const pillarItems = items.filter((i) => i.pillarId === pillar.id)
        let greenCount = 0
        let scoredCount = 0
        for (const item of pillarItems) {
          const sc = scoreMap.get(item.id)
          if (sc !== undefined) {
            scoredCount++
            if (sc === 2) greenCount++
          }
        }
        pillarScores.set(pillar.id, {
          total: pillarItems.length,
          scored: scoredCount,
          greenCount,
        })
      }

      // Overall score: % of all items scored green
      const totalItems = items.length
      let totalGreen = 0
      for (const item of items) {
        if (scoreMap.get(item.id) === 2) totalGreen++
      }
      overallScore = totalItems > 0 ? Math.round((totalGreen / totalItems) * 100) : 0
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-zinc-400 hover:text-white transition-colors mb-6 inline-block"
      >
        &larr; Back to {workspace.clientName}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Marketing Audit</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          {workspace.clientName} &mdash; health score and pillar breakdown.
        </p>
      </div>

      {/* Health score */}
      <Card className="bg-zinc-900 border-zinc-800 mb-8">
        <CardContent className="flex flex-col sm:flex-row items-center gap-6 py-8">
          <HealthRing score={overallScore} />
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Marketing Health Score
            </p>
            <p className="text-4xl font-bold text-white">{overallScore}%</p>
            <p className="text-zinc-500 text-sm mt-1">
              {allPillars.length === 0
                ? 'Audit items will appear here once the item library is seeded.'
                : 'Score based on green-rated audit items across all pillars.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pillar cards */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Pillar Scores
        </h2>
        {allPillars.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="py-8 text-center">
              <p className="text-zinc-500 text-sm">
                No pillars found. Visit{' '}
                <Link href="/seed" className="text-blue-400 underline">
                  /seed
                </Link>{' '}
                to seed the audit item library.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {allPillars.map((pillar) => {
              const ps = pillarScores.get(pillar.id)
              const pct =
                ps && ps.total > 0
                  ? Math.round((ps.greenCount / ps.total) * 100)
                  : 0
              const colorClass = scoreColor(pct)
              const label = scoreLabel(pct)
              return (
                <Link
                  key={pillar.id}
                  href={`/dashboard/clients/${id}/audit/pillar/${pillar.pillarNumber}`}
                  className="block bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <div className="py-4 px-4">
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <p className="text-xs text-zinc-400 leading-snug flex-1">
                        {pillar.name}
                      </p>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{pct}%</span>
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${colorClass}`}
                      >
                        {label}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Audit items summary */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Audit Items
        </h2>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12 text-center">
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">
              {allPillars.length === 0
                ? `No audit data yet. Items will appear here once audit items are seeded and scored for ${workspace.clientName}.`
                : 'Click a pillar above to view and score individual audit items.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
