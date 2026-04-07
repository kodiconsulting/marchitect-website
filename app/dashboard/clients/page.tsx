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
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-zinc-400 mt-1 text-sm">Manage client workspaces</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Add Client
        </Link>
      </div>

      {allWorkspaces.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-16 text-center">
            <p className="text-zinc-500 text-sm">
              No clients yet.{' '}
              <Link
                href="/dashboard/clients/new"
                className="text-blue-400 hover:text-blue-300 transition-colors"
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
              <Card key={ws.id} className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg font-semibold">
                    {ws.clientName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-400">Engagement start:</span>
                    <span className="text-zinc-200">
                      {ws.engagementStartDate ?? 'Not set'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {activeToggles.map(({ label, isCore }) => (
                      <span
                        key={label}
                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                          isCore
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-700 text-zinc-300'
                        }`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-400">Phase:</span>
                    <span className="text-zinc-200">
                      Phase {ws.currentPhase ?? 1}
                    </span>
                  </div>

                  <div className="pt-1">
                    <Link
                      href={`/dashboard/clients/${ws.id}`}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-700 px-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
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
