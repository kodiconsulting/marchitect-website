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
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session.user.name}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Here's an overview of your marketing engagements.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value }) => (
          <Card key={label} className="bg-white border-gray-200">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/audit"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-700"
          >
            View Audit
          </Link>
          <Link
            href="/dashboard/rocks"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-600 transition-colors hover:border-zinc-500 hover:text-gray-900"
          >
            Update Rocks
          </Link>
          <Link
            href="/dashboard/rocks"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-600 transition-colors hover:border-zinc-500 hover:text-gray-900"
          >
            Add KPI
          </Link>
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Recent Activity
        </h2>
        <Card className="bg-white border-gray-200">
          <CardContent className="py-10 text-center">
            <p className="text-gray-400 text-sm">No recent activity.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
