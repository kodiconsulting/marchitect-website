import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, sourceDocuments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import SourceDocsManager from './SourceDocsManager'

export default async function ClientSourceDocsPage({
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

  const rawItems = await db
    .select()
    .from(sourceDocuments)
    .where(eq(sourceDocuments.workspaceId, id))

  // sourceDocuments table has no notes column; add null for manager compatibility
  const items = rawItems.map(item => ({ ...item, notes: null as string | null }))

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#252f4a]">Source Materials</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          {workspace.clientName} — research docs, transcripts, and reference files.
        </p>
      </div>

      <SourceDocsManager items={items} workspaceId={id} />
    </div>
  )
}
