import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, adSpendEntries, budgetExpenses } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import BudgetsManager from './BudgetsManager'

export default async function ClientBudgetsPage({
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

  const [adSpend, expenses] = await Promise.all([
    db.select().from(adSpendEntries).where(eq(adSpendEntries.workspaceId, id)),
    db.select().from(budgetExpenses).where(eq(budgetExpenses.workspaceId, id)),
  ])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#252f4a]">Budgets</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          {workspace.clientName} — ad spend and operating expenses.
        </p>
      </div>

      <BudgetsManager adSpend={adSpend} expenses={expenses} workspaceId={id} />
    </div>
  )
}
