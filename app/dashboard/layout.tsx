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

  const initials = session.user.name
    ? session.user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="flex h-screen overflow-hidden bg-violet-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white flex flex-col shrink-0 border-r border-gray-100 shadow-sm">
        {/* Logo + Client Switcher */}
        <div className="px-4 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="size-8 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              M
            </div>
            <span className="text-gray-900 font-semibold text-sm tracking-tight">Marchitect</span>
          </div>
          <ClientSwitcher
            workspaces={allWorkspaces}
            selectedClientId={selectedClientId}
            selectedClientName={selectedClientName}
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            >
              <Icon className="size-4 shrink-0 text-gray-400" />
              {label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            >
              <Settings className="size-4 shrink-0 text-gray-400" />
              Settings
            </Link>
          )}
        </nav>

        {/* User footer */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="size-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-400 capitalize">{session.user.role}</p>
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
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-violet-50 text-gray-900">
        {children}
      </main>
    </div>
  )
}
