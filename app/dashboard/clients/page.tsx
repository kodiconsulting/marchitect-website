import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function ClientsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const allWorkspaces = await db
    .select()
    .from(workspaces)
    .orderBy(desc(workspaces.createdAt))

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage client workspaces</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          Add Client
        </Link>
      </div>

      {allWorkspaces.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="py-16 text-center">
            <p className="text-gray-400 text-sm">
              No clients yet.{' '}
              <Link
                href="/dashboard/clients/new"
                className="text-violet-600 hover:text-blue-300 transition-colors"
              >
                Add your first client.
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {allWorkspaces.map((ws) => {
            const activeToggles: { label: string; isCore: boolean }[] = [
              { label: 'CORE', isCore: true },
              ...(ws.toggleB2b ? [{ label: 'B2B', isCore: false }] : []),
              ...(ws.toggleB2c ? [{ label: 'B2C', isCore: false }] : []),
              ...(ws.toggleLeadGen ? [{ label: 'Lead-Gen', isCore: false }] : []),
              ...(ws.toggleEcom ? [{ label: 'Ecom', isCore: false }] : []),
            ]

            return (
              <Card key={ws.id} className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-gray-900 text-lg font-semibold">
                    {ws.clientName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Engagement start:</span>
                    <span className="text-gray-700">
                      {ws.engagementStartDate ?? 'Not set'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {activeToggles.map(({ label, isCore }) => (
                      <span
                        key={label}
                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                          isCore
                            ? 'bg-violet-600 text-gray-900'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Phase:</span>
                    <span className="text-gray-700">
                      Phase {ws.currentPhase ?? 1}
                    </span>
                  </div>

                  <div className="pt-1">
                    <Link
                      href={`/dashboard/clients/${ws.id}`}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:border-zinc-500 hover:text-gray-900"
                    >
                      View
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
