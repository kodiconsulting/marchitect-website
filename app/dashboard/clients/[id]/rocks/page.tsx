import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, rocks, goals, kpis, teamMembers, objectives, oracleFields } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import Link from 'next/link'
import GoalsManager from './GoalsManager'
import RocksManager from './RocksManager'
import KpisManager from './KpisManager'
import ObjectivesManager from './ObjectivesManager'
import type { Objective } from './ObjectivesManager'

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

type OracleFieldRow = Awaited<ReturnType<typeof db.select>>

function computeCompleteness(
  fields: Array<{ category: string; fieldValue: unknown }>
): Record<string, { total: number; filled: number }> {
  const byCategory: Record<string, Array<{ fieldValue: unknown }>> = {}
  for (const field of fields) {
    if (field.category === 'Objective Definition') continue
    if (!byCategory[field.category]) byCategory[field.category] = []
    byCategory[field.category].push(field)
  }
  const result: Record<string, { total: number; filled: number }> = {}
  for (const [cat, catFields] of Object.entries(byCategory)) {
    result[cat] = {
      total: catFields.length,
      filled: catFields.filter(f => f.fieldValue != null && f.fieldValue !== '').length,
    }
  }
  return result
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
  const members = await db
    .select({ id: teamMembers.id, name: teamMembers.name, title: teamMembers.title })
    .from(teamMembers)
    .where(eq(teamMembers.workspaceId, id))

  const allObjectivesRaw = await db
    .select()
    .from(objectives)
    .where(eq(objectives.workspaceId, id))

  const objectiveIds = allObjectivesRaw.map(o => o.id)
  const objectiveOracleFields = objectiveIds.length > 0
    ? await db
        .select()
        .from(oracleFields)
        .where(and(eq(oracleFields.workspaceId, id), inArray(oracleFields.objectiveId, objectiveIds)))
    : []

  const fieldsByObjective: Record<string, typeof objectiveOracleFields> = {}
  for (const oid of objectiveIds) {
    fieldsByObjective[oid] = objectiveOracleFields.filter(f => f.objectiveId === oid)
  }

  const enrichedObjectives: Objective[] = allObjectivesRaw.map(o => ({
    id: o.id,
    workspaceId: o.workspaceId,
    name: o.name,
    successDefinition: o.successDefinition ?? null,
    targetTimeline: o.targetTimeline ?? null,
    priority: o.priority,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    oracleCompleteness: computeCompleteness(fieldsByObjective[o.id] ?? []),
  }))

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#252f4a]">Goals & Objectives</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          {workspace.clientName} — quarterly priorities and key performance indicators.
        </p>
      </div>

      <div className="mb-8">
        <ObjectivesManager objectives={enrichedObjectives} workspaceId={id} />
      </div>

      <div className="mb-8">
        <GoalsManager goals={allGoals} workspaceId={id} />
      </div>

      <div className="mb-8">
        <RocksManager
          rocks={currentRocks}
          workspaceId={id}
          quarterKey={quarterKey}
          quarterLabel={quarterLabel}
          teamMembers={members}
        />
      </div>

      <div>
        <KpisManager kpis={allKpis} workspaceId={id} teamMembers={members} />
      </div>
    </div>
  )
}
