import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, teamMembers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import TeamMembersManager from './TeamMembersManager'

export default async function TeamPage({
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

  const members = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.workspaceId, id))

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-zinc-400 hover:text-white transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>
      <TeamMembersManager members={members} workspaceId={id} />
    </div>
  )
}
