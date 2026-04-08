import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, loginEntries } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function ClientLoginsPage({
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

  const entries = await db
    .select()
    .from(loginEntries)
    .where(eq(loginEntries.workspaceId, id))

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Login Directory</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {workspace.clientName} — tools, credentials, and access.
          </p>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex h-8 items-center justify-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white opacity-60 cursor-not-allowed"
        >
          Add Entry
        </button>
      </div>

      {entries.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="py-16 text-center">
            <p className="text-gray-900 font-semibold text-sm mb-2">No login entries yet</p>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Add tools, platforms, and credentials for {workspace.clientName} to keep access organized.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-gray-200">
                    <th className="text-left px-6 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Tool</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">URL</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Username</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Owner</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Monthly Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(entry => (
                    <tr key={entry.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-gray-600 font-medium">{entry.toolName}</td>
                      <td className="px-4 py-3 text-gray-500">{entry.category}</td>
                      <td className="px-4 py-3">
                        {entry.loginUrl ? (
                          <a
                            href={entry.loginUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-600 hover:text-blue-300 text-xs truncate max-w-[160px] block transition-colors"
                          >
                            {entry.loginUrl}
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{entry.username ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{entry.owner ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {entry.monthlyCost != null
                          ? `$${Number(entry.monthlyCost).toFixed(2)}`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
