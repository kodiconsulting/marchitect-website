import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, promoEntries } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import PromoCalendarManager from './PromoCalendarManager'

export default async function ClientPromoPage({
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
    .from(promoEntries)
    .where(eq(promoEntries.workspaceId, id))

  // month is stored as text in DB; convert to number for the manager
  const items = rawItems.map(item => ({
    ...item,
    month: parseInt(item.month, 10) || 1,
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
        <h1 className="text-2xl font-bold text-[#252f4a]">Promo Calendar</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          {workspace.clientName} — monthly promotional planning.
        </p>
      </div>

      <PromoCalendarManager items={items} workspaceId={id} />
    </div>
  )
}
