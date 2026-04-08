import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, loginEntries } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import LoginEntryManager from './LoginEntryManager'

export default async function ClientLoginsPage({
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

  const entries = await db
    .select()
    .from(loginEntries)
    .where(eq(loginEntries.workspaceId, id))

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#252f4a]">Login Directory</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          {workspace.clientName} — tools, credentials, and access. URLs and usernames only — no passwords.
        </p>
      </div>

      <LoginEntryManager entries={entries} workspaceId={id} />
    </div>
  )
}
