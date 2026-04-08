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
import { Database } from 'lucide-react'

export default async function OraclePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const allWorkspaces = await db
    .select()
    .from(workspaces)
    .orderBy(desc(workspaces.createdAt))

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#252f4a]">Content Oracle</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          Select a client to view and edit their Oracle.
        </p>
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
          {allWorkspaces.map((ws) => (
            <Card key={ws.id} className="bg-white border-[#e8e8e8] hover:border-[#1B84FF] transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-lg bg-[#f1f1f4] flex items-center justify-center shrink-0">
                    <Database className="size-5 text-[#1B84FF]" />
                  </div>
                  <div>
                    <CardTitle className="text-[#252f4a] text-base font-semibold">
                      {ws.clientName}
                    </CardTitle>
                    <p className="text-xs text-[#78829d] mt-0.5">
                      Phase {ws.currentPhase ?? 1}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/dashboard/clients/${ws.id}/oracle`}
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-[#1B84FF] px-3 text-sm font-medium text-white transition-colors hover:bg-[#1366cc]"
                >
                  View Oracle →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
