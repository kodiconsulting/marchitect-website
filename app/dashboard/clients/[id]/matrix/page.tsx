import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, functionAssignments, marketingFunctions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import MatrixEditor, { type MatrixRow } from './MatrixEditor'

export default async function ClientMatrixPage({
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

  const allFunctions = await db.select().from(marketingFunctions)

  const wsAssignments = await db
    .select()
    .from(functionAssignments)
    .where(eq(functionAssignments.workspaceId, id))

  const assignmentMap = new Map(wsAssignments.map(a => [a.functionId, a]))

  const rows: MatrixRow[] = allFunctions.map(fn => {
    const a = assignmentMap.get(fn.id)
    return {
      functionId: fn.id,
      functionName: fn.functionName,
      category: fn.category,
      assignedOwner: a?.assignedOwner ?? null,
      internalExternal: a?.internalExternal ?? null,
      gwcGet: a?.gwcGet ?? null,
      gwcWant: a?.gwcWant ?? null,
      gwcCapacity: a?.gwcCapacity ?? null,
      notes: a?.notes ?? null,
    }
  })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <MatrixEditor workspaceId={id} initialRows={rows} />
    </div>
  )
}
