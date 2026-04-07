import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

const PILLARS = [
  'Strategy & Positioning',
  'Brand & Identity',
  'Website & SEO',
  'Content Marketing',
  'Email Marketing',
  'Social Media',
  'Paid Advertising',
  'Lead Generation',
  'Analytics & Reporting',
  'CRM & Automation',
  'Sales Enablement',
  'Customer Experience',
]

function scoreColor(score: number) {
  if (score >= 70) return 'text-green-400 bg-green-400/10'
  if (score >= 40) return 'text-yellow-400 bg-yellow-400/10'
  return 'text-red-400 bg-red-400/10'
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

  const overallScore = 0

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-zinc-400 hover:text-white transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Marketing Audit</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          {workspace.clientName} — health score and pillar breakdown.
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
              Audit items will appear here once the item library is seeded.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pillar cards */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Pillar Scores
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {PILLARS.map((pillar, i) => {
            const score = 0
            const colorClass = scoreColor(score)
            return (
              <Card key={i} className="bg-zinc-900 border-zinc-800">
                <CardContent className="py-4 px-4">
                  <p className="text-xs text-zinc-400 mb-2 leading-snug">{pillar}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">{score}%</span>
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${colorClass}`}
                    >
                      Low
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Audit items */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Audit Items
        </h2>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12 text-center">
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">
              No audit data yet. Items will appear here once audit items are seeded
              and scored for {workspace.clientName}.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
