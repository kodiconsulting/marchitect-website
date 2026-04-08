import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { workspaces } from '@/lib/db/schema'
import IconRail from './IconRail'
import TextNav from './TextNav'
import DashboardHeader from './DashboardHeader'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const isAdmin = session.user.role === 'admin'
  const allWorkspaces = await db
    .select({ id: workspaces.id, clientName: workspaces.clientName })
    .from(workspaces)

  const jar = await cookies()
  const selectedClientId = jar.get('selected_client_id')?.value ?? null
  const selectedClientName = jar.get('selected_client_name')?.value ?? null

  const initials = session.user.name
    ? session.user.name.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="flex h-screen overflow-hidden bg-[#f9f9f9]">
      {/* Icon Rail — icons resolved client-side from navConfig */}
      <IconRail
        cid={selectedClientId}
        isAdmin={isAdmin}
        userInitials={initials}
      />

      {/* Text Nav — labels + sections resolved client-side from navConfig */}
      <TextNav
        cid={selectedClientId}
        isAdmin={isAdmin}
        workspaces={allWorkspaces}
        selectedClientId={selectedClientId}
        selectedClientName={selectedClientName}
        userName={session.user.name ?? ''}
        userRole={session.user.role ?? 'user'}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader selectedClientName={selectedClientName} />
        <div className="flex-1 overflow-auto bg-[#f9f9f9]">
          {children}
        </div>
      </main>
    </div>
  )
}
