import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

const statCards = [
  { label: 'Active Clients', value: '0' },
  { label: 'Avg Health Score', value: '—' },
  { label: 'Rocks This Quarter', value: '0' },
  { label: 'Items Needing Attention', value: '0' },
]

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#252f4a]">
          Welcome back, {session.user.name}
        </h1>
        <p className="text-[#78829d] mt-1 text-sm">
          Here's an overview of your marketing engagements.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value }) => (
          <Card key={label} className="bg-white border-[#e8e8e8]">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-[#78829d] uppercase tracking-wider">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#252f4a]">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-[#78829d] uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/audit"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-[#1B84FF] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1366cc]"
          >
            View Audit
          </Link>
          <Link
            href="/dashboard/rocks"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-[#e8e8e8] px-4 text-sm font-medium text-[#4b5675] transition-colors hover:border-[#1B84FF] hover:text-[#252f4a]"
          >
            Update Rocks
          </Link>
          <Link
            href="/dashboard/rocks"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-[#e8e8e8] px-4 text-sm font-medium text-[#4b5675] transition-colors hover:border-[#1B84FF] hover:text-[#252f4a]"
          >
            Add KPI
          </Link>
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-sm font-semibold text-[#78829d] uppercase tracking-wider mb-3">
          Recent Activity
        </h2>
        <Card className="bg-white border-[#e8e8e8]">
          <CardContent className="py-10 text-center">
            <p className="text-[#78829d] text-sm">No recent activity.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
