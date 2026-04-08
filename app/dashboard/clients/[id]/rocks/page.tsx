import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, rocks, goals, kpis } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import GoalsManager from './GoalsManager'
import RocksManager from './RocksManager'
import KpisManager from './KpisManager'

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

  if (!workspace) notFound()

  const quarterKey = getCurrentQuarterKey()
  const quarterLabel = getCurrentQuarterLabel()

  const allRocks = await db.select().from(rocks).where(eq(rocks.workspaceId, id))
  const currentRocks = allRocks.filter(r => r.quarter === quarterKey)
  const allGoals = await db.select().from(goals).where(eq(goals.workspaceId, id))
  const allKpis = await db.select().from(kpis).where(eq(kpis.workspaceId, id))

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Rocks & Goals</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {workspace.clientName} — quarterly priorities and key performance indicators.
        </p>
      </div>

      {/* Goals first */}
      <div className="mb-8">
        <GoalsManager goals={allGoals} workspaceId={id} />
      </div>

      {/* Rocks */}
      <div className="mb-8">
        <RocksManager
          rocks={currentRocks}
          workspaceId={id}
          quarterKey={quarterKey}
          quarterLabel={quarterLabel}
        />
      </div>

      {/* KPIs */}
      <div>
        <KpisManager kpis={allKpis} workspaceId={id} />
      </div>
    </div>
  )
}
