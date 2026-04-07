import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BarChart2,
  Target,
  Database,
  Users,
} from 'lucide-react'

const quickLinks = [
  {
    label: 'Audit Dashboard',
    href: '/dashboard/audit',
    icon: BarChart2,
    description: 'Review and score audit items',
  },
  {
    label: 'Rocks & Goals',
    href: '/dashboard/rocks',
    icon: Target,
    description: 'Track quarterly rocks and goals',
  },
  {
    label: 'Content Oracle',
    href: '/dashboard/oracle',
    icon: Database,
    description: 'Manage content intelligence data',
  },
  {
    label: 'Responsibility Matrix',
    href: '/dashboard/responsibility',
    icon: Users,
    description: 'Assign marketing functions',
  },
]

export default async function ClientDetailPage({
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
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <Link
          href="/dashboard/clients"
          className="text-sm text-zinc-400 hover:text-white transition-colors mb-6 inline-block"
        >
          ← Back to Clients
        </Link>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-16 text-center">
            <p className="text-white font-semibold text-lg mb-2">
              Client not found
            </p>
            <p className="text-zinc-500 text-sm">
              This workspace does not exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeToggleCount = [
    workspace.toggleCore,
    workspace.toggleB2b,
    workspace.toggleB2c,
    workspace.toggleLeadGen,
    workspace.toggleEcom,
  ].filter(Boolean).length

  const toggleDetails = [
    { label: 'CORE', value: workspace.toggleCore },
    { label: 'B2B', value: workspace.toggleB2b },
    { label: 'B2C', value: workspace.toggleB2c },
    { label: 'Lead-Gen', value: workspace.toggleLeadGen },
    { label: 'Ecommerce', value: workspace.toggleEcom },
  ]

  const infoCards = [
    {
      label: 'Engagement Start',
      value: workspace.engagementStartDate ?? 'Not set',
    },
    {
      label: 'Current Phase',
      value: `Phase ${workspace.currentPhase ?? 1}`,
    },
    {
      label: 'Active Toggles',
      value: String(activeToggleCount),
    },
    {
      label: 'Health Score',
      value: '—',
    },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href="/dashboard/clients"
        className="text-sm text-zinc-400 hover:text-white transition-colors mb-6 inline-block"
      >
        ← Back to Clients
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{workspace.clientName}</h1>
        <p className="text-zinc-400 mt-1 text-sm">Client workspace overview</p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {infoCards.map(({ label, value }) => (
          <Card key={label} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick links */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map(({ label, href, icon: Icon, description }) => (
            <Link key={label} href={href}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer h-full">
                <CardContent className="flex items-start gap-4 py-5">
                  <div className="size-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                    <Icon className="size-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Client details */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Client Details
        </h2>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-5">
            <ul className="divide-y divide-zinc-800">
              {toggleDetails.map(({ label, value }) => (
                <li
                  key={label}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <span className="text-sm text-zinc-300">{label}</span>
                  {value ? (
                    <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-600/30">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-zinc-800 text-zinc-500 border border-zinc-700">
                      Inactive
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
