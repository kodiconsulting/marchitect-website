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
          <h1 className="text-2xl font-bold text-[#252f4a]">Clients</h1>
          <p className="text-[#78829d] mt-1 text-sm">Manage client workspaces</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-[#1B84FF] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1366cc]"
        >
          Add Client
        </Link>
      </div>

      {allWorkspaces.length === 0 ? (
        <Card className="bg-white border-[#e8e8e8]">
          <CardContent className="py-16 text-center">
            <p className="text-[#78829d] text-sm">
              No clients yet.{' '}
              <Link
                href="/dashboard/clients/new"
                className="text-[#1B84FF] hover:text-blue-300 transition-colors"
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
              <Card key={ws.id} className="bg-white border-[#e8e8e8]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[#252f4a] text-lg font-semibold">
                    {ws.clientName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#78829d]">Engagement start:</span>
                    <span className="text-[#4b5675]">
                      {ws.engagementStartDate ?? 'Not set'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {activeToggles.map(({ label, isCore }) => (
                      <span
                        key={label}
                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                          isCore
                            ? 'bg-[#1B84FF] text-[#252f4a]'
                            : 'bg-gray-200 text-[#4b5675]'
                        }`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#78829d]">Phase:</span>
                    <span className="text-[#4b5675]">
                      Phase {ws.currentPhase ?? 1}
                    </span>
                  </div>

                  <div className="pt-1">
                    <Link
                      href={`/dashboard/clients/${ws.id}`}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-[#e8e8e8] px-3 text-sm font-medium text-[#4b5675] transition-colors hover:border-[#1B84FF] hover:text-[#252f4a]"
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
