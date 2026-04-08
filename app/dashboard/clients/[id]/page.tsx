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
          className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors mb-6 inline-block"
        >
          ← Back to Clients
        </Link>
        <Card className="bg-white border-[#e8e8e8]">
          <CardContent className="py-16 text-center">
            <p className="text-[#252f4a] font-semibold text-lg mb-2">
              Client not found
            </p>
            <p className="text-[#78829d] text-sm">
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
        className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors mb-6 inline-block"
      >
        ← Back to Clients
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#252f4a]">{workspace.clientName}</h1>
        <p className="text-[#78829d] mt-1 text-sm">Client workspace overview</p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {infoCards.map(({ label, value }) => (
          <Card key={label} className="bg-white border-[#e8e8e8]">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-[#78829d] uppercase tracking-wider">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#252f4a]">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick links */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-[#78829d] uppercase tracking-wider mb-3">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map(({ label, href, icon: Icon, description }) => (
            <Link key={label} href={href}>
              <Card className="bg-white border-[#e8e8e8] hover:border-[#1B84FF] transition-colors cursor-pointer h-full">
                <CardContent className="flex items-start gap-4 py-5">
                  <div className="size-10 rounded-lg bg-[#f1f1f4] flex items-center justify-center shrink-0">
                    <Icon className="size-5 text-[#1B84FF]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#252f4a]">{label}</p>
                    <p className="text-xs text-[#78829d] mt-0.5">{description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Client details */}
      <div>
        <h2 className="text-sm font-semibold text-[#78829d] uppercase tracking-wider mb-3">
          Client Details
        </h2>
        <Card className="bg-white border-[#e8e8e8]">
          <CardContent className="py-5">
            <ul className="divide-y divide-zinc-800">
              {toggleDetails.map(({ label, value }) => (
                <li
                  key={label}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <span className="text-sm text-[#4b5675]">{label}</span>
                  {value ? (
                    <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-[#1B84FF]/20 text-[#1B84FF] border border-blue-600/30">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-[#f1f1f4] text-[#78829d] border border-[#e8e8e8]">
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
