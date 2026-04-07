import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, rocks, goals, kpis } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function getCurrentQuarterKey(): string {
  const now = new Date()
  const q = Math.ceil((now.getMonth() + 1) / 3)
  return `${now.getFullYear()}-Q${q}`
}

function getCurrentQuarterLabel(): string {
  const now = new Date()
  const q = Math.ceil((now.getMonth() + 1) / 3)
  return `Q${q} ${now.getFullYear()}`
}

const STATUS_LABELS: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  complete: 'Complete',
  off_track: 'Off Track',
}

const STATUS_COLORS: Record<string, string> = {
  not_started: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  complete: 'bg-green-500/20 text-green-400 border-green-500/30',
  off_track: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default async function ClientRocksPage({
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

  const quarterKey = getCurrentQuarterKey()
  const quarterLabel = getCurrentQuarterLabel()

  const allRocks = await db
    .select()
    .from(rocks)
    .where(eq(rocks.workspaceId, id))

  const currentRocks = allRocks.filter(r => r.quarter === quarterKey)

  const allGoals = await db
    .select()
    .from(goals)
    .where(eq(goals.workspaceId, id))

  const allKpis = await db
    .select()
    .from(kpis)
    .where(eq(kpis.workspaceId, id))

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-zinc-400 hover:text-white transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Rocks & Goals</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          {workspace.clientName} — quarterly priorities and key performance indicators.
        </p>
      </div>

      {/* Rocks section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Rocks — {quarterLabel}
          </h2>
          <Button
            disabled
            className="bg-blue-600 hover:bg-blue-700 text-white border-transparent opacity-60 cursor-not-allowed"
          >
            Add Rock
          </Button>
        </div>

        {currentRocks.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="py-12 text-center">
              <p className="text-zinc-500 text-sm">
                No rocks defined yet for {quarterLabel}.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {currentRocks.map(rock => {
              const statusKey = rock.status ?? 'not_started'
              const colorClass = STATUS_COLORS[statusKey] ?? STATUS_COLORS.not_started
              const statusLabel = STATUS_LABELS[statusKey] ?? statusKey
              return (
                <Card key={rock.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="py-4 flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">{rock.title}</p>
                      {rock.description && (
                        <p className="text-xs text-zinc-400 mt-1">{rock.description}</p>
                      )}
                      <p className="text-xs text-zinc-500 mt-1.5">Owner: {rock.owner}</p>
                    </div>
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border shrink-0 ${colorClass}`}>
                      {statusLabel}
                    </span>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Goals section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Goals
          </h2>
        </div>

        {allGoals.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="py-12 text-center">
              <p className="text-zinc-500 text-sm">No goals defined yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {allGoals.map(goal => (
              <Card key={goal.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="py-3 flex items-center justify-between gap-4">
                  <p className="text-sm text-zinc-300">{goal.goalText}</p>
                  <span className="text-xs text-zinc-500 shrink-0">{goal.timeframe}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* KPIs section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            KPIs
          </h2>
          <Button
            disabled
            variant="outline"
            className="border-zinc-700 text-zinc-300 opacity-60 cursor-not-allowed"
          >
            Add KPI
          </Button>
        </div>

        {allKpis.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="py-12 text-center">
              <p className="text-zinc-500 text-sm">No KPIs defined yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-zinc-800">
                      <th className="text-left px-6 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Owner</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Current</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Target</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allKpis.map(kpi => (
                      <tr key={kpi.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-3 text-zinc-300">{kpi.name}</td>
                        <td className="px-4 py-3 text-zinc-400">{kpi.owner ?? '—'}</td>
                        <td className="px-4 py-3 text-zinc-300">{kpi.currentValue != null ? `${kpi.currentValue} ${kpi.unit}` : '—'}</td>
                        <td className="px-4 py-3 text-zinc-400">{kpi.targetValue != null ? `${kpi.targetValue} ${kpi.unit}` : '—'}</td>
                        <td className="px-4 py-3 text-zinc-400">{kpi.updateFrequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
