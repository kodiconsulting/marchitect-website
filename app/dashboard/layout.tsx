import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { cookies } from 'next/headers'
import {
  LayoutDashboard,
  BarChart2,
  Target,
  Database,
  Users,
  Key,
  BookOpen,
  Settings,
  UserSquare2,
} from 'lucide-react'
import { db } from '@/lib/db'
import { workspaces } from '@/lib/db/schema'
import IconRail from './IconRail'
import TextNav from './TextNav'
import DashboardHeader from './DashboardHeader'
import type { NavSection } from './TextNav'
import type { NavItem } from './IconRail'

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
  const cid = selectedClientId

  // All nav items (used by both sidebars)
  const allNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/clients', label: 'Clients', icon: UserSquare2 },
    { href: cid ? `/dashboard/clients/${cid}/audit` : '/dashboard/audit', label: 'Audit', icon: BarChart2 },
    { href: cid ? `/dashboard/clients/${cid}/rocks` : '/dashboard/rocks', label: 'Rocks & Goals', icon: Target },
    { href: cid ? `/dashboard/clients/${cid}/oracle` : '/dashboard/oracle', label: 'Oracle', icon: Database },
    { href: cid ? `/dashboard/clients/${cid}/matrix` : '/dashboard/responsibility', label: 'Responsibility Matrix', icon: Users },
    { href: cid ? `/dashboard/clients/${cid}/logins` : '/dashboard/logins', label: 'Login Directory', icon: Key },
    { href: cid ? `/dashboard/clients/${cid}/playbooks` : '/dashboard/playbooks', label: 'Playbooks', icon: BookOpen },
    ...(isAdmin ? [{ href: '/dashboard/settings', label: 'Settings', icon: Settings }] : []),
  ]

  // Grouped for text nav
  const navSections: NavSection[] = [
    {
      heading: null,
      items: allNavItems.filter(i =>
        i.href === '/dashboard' || i.href === '/dashboard/clients'
      ),
    },
    {
      heading: 'TOOLS',
      items: allNavItems.filter(i =>
        ['Audit', 'Rocks & Goals', 'Oracle', 'Responsibility Matrix'].includes(i.label)
      ),
    },
    {
      heading: 'RESOURCES',
      items: allNavItems.filter(i =>
        ['Login Directory', 'Playbooks'].includes(i.label)
      ),
    },
    ...(isAdmin
      ? [{
          heading: 'ADMINISTRATION',
          items: allNavItems.filter(i => i.label === 'Settings'),
        }]
      : []),
  ]

  const initials = session.user.name
    ? session.user.name.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="flex h-screen overflow-hidden bg-[#f9f9f9]">
      {/* Icon Rail */}
      <IconRail navItems={allNavItems} userInitials={initials} />

      {/* Text Nav */}
      <TextNav
        navSections={navSections}
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
