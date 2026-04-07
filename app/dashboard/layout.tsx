import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth'
import Link from 'next/link'
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
  LogOut,
  UserSquare2,
} from 'lucide-react'
import { db } from '@/lib/db'
import { workspaces } from '@/lib/db/schema'
import ClientSwitcher from '@/components/ClientSwitcher'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const isAdmin = session.user.role === 'admin'
  const allWorkspaces = await db.select({ id: workspaces.id, clientName: workspaces.clientName }).from(workspaces)

  const jar = await cookies()
  const selectedClientId = jar.get('selected_client_id')?.value ?? null
  const selectedClientName = jar.get('selected_client_name')?.value ?? null

  const cid = selectedClientId
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/clients', label: 'Clients', icon: UserSquare2 },
    { href: cid ? `/dashboard/clients/${cid}/audit` : '/dashboard/audit', label: 'Audit', icon: BarChart2 },
    { href: cid ? `/dashboard/clients/${cid}/rocks` : '/dashboard/rocks', label: 'Rocks & Goals', icon: Target },
    { href: cid ? `/dashboard/clients/${cid}/oracle` : '/dashboard/oracle', label: 'Oracle', icon: Database },
    { href: cid ? `/dashboard/clients/${cid}/matrix` : '/dashboard/responsibility', label: 'Responsibility Matrix', icon: Users },
    { href: cid ? `/dashboard/clients/${cid}/logins` : '/dashboard/logins', label: 'Login Directory', icon: Key },
    { href: cid ? `/dashboard/clients/${cid}/playbooks` : '/dashboard/playbooks', label: 'Playbooks', icon: BookOpen },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col shrink-0 border-r border-zinc-800">
        {/* Logo + Client Switcher */}
        <div className="px-4 py-4 border-b border-zinc-800">
          <div className="text-xl font-bold text-white tracking-tight mb-3">
            Marchitect
          </div>
          <ClientSwitcher
            workspaces={allWorkspaces}
            selectedClientId={selectedClientId}
            selectedClientName={selectedClientName}
          />
          {selectedClientName && (
            <p className="text-xs text-zinc-500 mt-1.5 px-1 truncate">
              Viewing: {selectedClientName}
            </p>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Settings className="size-4 shrink-0" />
              Settings
            </Link>
          )}
        </nav>

        {/* User footer */}
        <div className="px-3 py-3 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {session.user.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-zinc-400 capitalize">{session.user.role}</p>
            </div>
          </div>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/login' })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-zinc-950 text-white">
        {children}
      </main>
    </div>
  )
}
