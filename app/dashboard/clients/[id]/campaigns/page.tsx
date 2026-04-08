import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, campaigns } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import CampaignsManager from './CampaignsManager'

export default async function ClientCampaignsPage({
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

  const items = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.workspaceId, id))

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#252f4a]">Campaigns</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          {workspace.clientName} — active and past marketing campaigns.
        </p>
      </div>

      <CampaignsManager items={items} workspaceId={id} />
    </div>
  )
}
