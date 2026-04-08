import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, pillars } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Terminal } from 'lucide-react'
import PlaybookAccordion from './PlaybookAccordion'

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

  if (!workspace) notFound()

  const allPillars = await db
    .select()
    .from(pillars)
    .orderBy(pillars.pillarNumber)

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

      {/* Cowork intro note */}
      <div className="flex items-start gap-3 rounded-lg border border-[#e8e8e8] bg-[#f9f9f9] px-4 py-3 mb-8">
        <Terminal className="size-4 text-[#78829d] mt-0.5 shrink-0" />
        <p className="text-[#78829d] text-sm">
          Each pillar has a corresponding Cowork skill that can generate workshop content.
          Run the skill command in your Cowork sandbox to produce the deliverable for that pillar.
        </p>
      </div>

      {allPillars.length === 0 ? (
        <Card className="bg-white border-[#e8e8e8]">
          <CardContent className="py-16 text-center">
            <p className="text-[#78829d] text-sm">
              No pillars found.{' '}
              <Link href="/seed" className="text-[#1B84FF] underline">Seed the audit library</Link>{' '}
              first.
            </p>
          </CardContent>
        </Card>
      ) : (
        <PlaybookAccordion pillars={allPillars} />
      )}
    </div>
  )
}
