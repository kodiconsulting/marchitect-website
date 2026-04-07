import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, functionAssignments, marketingFunctions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const CATEGORIES = [
  'Decision & Approval',
  'Strategy & Planning',
  'Execution & Production',
  'Monitoring & Reporting',
  'Vendor & Contractor Management',
]

type AssignmentRow = {
  functionName: string
  assignedOwner: string | null
  internalExternal: string | null
  gwc: string
  notes: string | null
  category: string
}

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

  const assignments = await db
    .select({
      functionName: marketingFunctions.functionName,
      category: marketingFunctions.category,
      assignedOwner: functionAssignments.assignedOwner,
      internalExternal: functionAssignments.internalExternal,
      gwcGet: functionAssignments.gwcGet,
      gwcWant: functionAssignments.gwcWant,
      gwcCapacity: functionAssignments.gwcCapacity,
      notes: functionAssignments.notes,
    })
    .from(functionAssignments)
    .innerJoin(marketingFunctions, eq(functionAssignments.functionId, marketingFunctions.id))
    .where(eq(functionAssignments.workspaceId, id))

  // Group by category
  const byCategory: Record<string, AssignmentRow[]> = {}
  for (const a of assignments) {
    const cat = a.category
    if (!byCategory[cat]) byCategory[cat] = []
    const gwcParts = [
      a.gwcGet ? 'G' : null,
      a.gwcWant ? 'W' : null,
      a.gwcCapacity ? 'C' : null,
    ].filter(Boolean)
    byCategory[cat].push({
      functionName: a.functionName,
      assignedOwner: a.assignedOwner,
      internalExternal: a.internalExternal,
      gwc: gwcParts.length > 0 ? gwcParts.join('/') : '—',
      notes: a.notes,
      category: cat,
    })
  }

  const hasData = assignments.length > 0

  // Fallback static rows when no DB data
  type StaticRow = { function: string; owner: string; type: string; gwc: string; notes: string }
  type StaticSection = { heading: string; rows: StaticRow[] }
  const staticSections: StaticSection[] = [
    {
      heading: 'Decision & Approval',
      rows: [
        { function: 'Marketing strategy approval', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
        { function: 'Budget sign-off', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
        { function: 'Brand standards', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      ],
    },
    {
      heading: 'Strategy & Planning',
      rows: [
        { function: 'Annual marketing plan', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
        { function: 'Campaign planning', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
        { function: 'Channel selection', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      ],
    },
    {
      heading: 'Execution & Production',
      rows: [
        { function: 'Content creation', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
        { function: 'Paid ads management', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
        { function: 'Email campaigns', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
        { function: 'SEO', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      ],
    },
    {
      heading: 'Monitoring & Reporting',
      rows: [
        { function: 'Analytics reporting', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
        { function: 'KPI tracking', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
        { function: 'Campaign performance', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      ],
    },
    {
      heading: 'Vendor & Contractor Management',
      rows: [
        { function: 'Agency relationships', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
        { function: 'Freelancer management', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      ],
    },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-zinc-400 hover:text-white transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Responsibility Matrix</h1>
          <p className="text-zinc-400 mt-1 text-sm">
            {workspace.clientName} — every marketing function mapped to an owner.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-8 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Edit Matrix
        </button>
      </div>

      <div className="space-y-6">
        {hasData
          ? CATEGORIES.filter(cat => byCategory[cat]?.length).map(cat => (
            <Card key={cat} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white">{cat}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-t border-zinc-800">
                        <th className="text-left px-6 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/3">Function</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Owner</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Internal / External</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">GWC</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byCategory[cat].map(row => (
                        <tr key={row.functionName} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-3 text-zinc-300">{row.functionName}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-500">{row.assignedOwner ?? 'Unassigned'}</span>
                              {!row.assignedOwner && (
                                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">Gap</Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-zinc-500">{row.internalExternal ?? '—'}</td>
                          <td className="px-4 py-3 text-zinc-500">{row.gwc}</td>
                          <td className="px-4 py-3 text-zinc-500">{row.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))
          : staticSections.map(section => (
            <Card key={section.heading} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-white">{section.heading}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-t border-zinc-800">
                        <th className="text-left px-6 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider w-1/3">Function</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Owner</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Internal / External</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">GWC</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map(row => (
                        <tr key={row.function} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-3 text-zinc-300">{row.function}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-500">{row.owner}</span>
                              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">Gap</Badge>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-zinc-500">{row.type}</td>
                          <td className="px-4 py-3 text-zinc-500">{row.gwc}</td>
                          <td className="px-4 py-3 text-zinc-500">{row.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))
        }
      </div>
    </div>
  )
}
