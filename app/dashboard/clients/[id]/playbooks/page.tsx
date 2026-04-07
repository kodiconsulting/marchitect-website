import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, Info } from 'lucide-react'

const pillars = [
  { label: 'Pillar 1', subtitle: 'Brand Foundation' },
  { label: 'Pillar 2', subtitle: 'Lead Generation' },
  { label: 'Pillar 3', subtitle: 'Nurture & Retention' },
  { label: 'Pillar 4', subtitle: 'Measurement & Optimisation' },
]

export default async function ClientPlaybooksPage({
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

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-zinc-400 hover:text-white transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Playbook Library</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          {workspace.clientName} — templates, checklists, and frameworks organized by pillar.
        </p>
      </div>

      {/* Top note */}
      <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 mb-8">
        <Info className="size-4 text-zinc-400 mt-0.5 shrink-0" />
        <p className="text-zinc-400 text-sm">
          The full playbook library will be populated as templates are built. Each playbook
          is linked to the audit items it supports.
        </p>
      </div>

      <div className="space-y-3">
        {pillars.map(pillar => (
          <Card key={pillar.label} className="bg-zinc-900 border-zinc-800">
            <button
              type="button"
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div>
                <span className="text-sm font-semibold text-white">{pillar.label}</span>
                <span className="ml-2 text-sm text-zinc-500">{pillar.subtitle}</span>
              </div>
              <ChevronDown className="size-4 text-zinc-500 shrink-0" />
            </button>
            <CardContent className="px-5 pb-5 pt-0 border-t border-zinc-800">
              <p className="text-zinc-500 text-sm py-4 text-center">
                No playbooks added yet for this pillar.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
