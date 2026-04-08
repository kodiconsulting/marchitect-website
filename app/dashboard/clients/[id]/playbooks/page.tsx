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
        className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#252f4a]">Playbook Library</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          {workspace.clientName} — templates, checklists, and frameworks organized by pillar.
        </p>
      </div>

      {/* Top note */}
      <div className="flex items-start gap-3 rounded-lg border border-[#e8e8e8] bg-white px-4 py-3 mb-8">
        <Info className="size-4 text-[#78829d] mt-0.5 shrink-0" />
        <p className="text-[#78829d] text-sm">
          The full playbook library will be populated as templates are built. Each playbook
          is linked to the audit items it supports.
        </p>
      </div>

      <div className="space-y-3">
        {pillars.map(pillar => (
          <Card key={pillar.label} className="bg-white border-[#e8e8e8]">
            <button
              type="button"
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div>
                <span className="text-sm font-semibold text-[#252f4a]">{pillar.label}</span>
                <span className="ml-2 text-sm text-[#78829d]">{pillar.subtitle}</span>
              </div>
              <ChevronDown className="size-4 text-[#78829d] shrink-0" />
            </button>
            <CardContent className="px-5 pb-5 pt-0 border-t border-[#e8e8e8]">
              <p className="text-[#78829d] text-sm py-4 text-center">
                No playbooks added yet for this pillar.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
