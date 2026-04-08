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
  Contact,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

export type NavSection = {
  heading: string | null
  items: NavItem[]
}

export function buildNav(cid: string | null, isAdmin: boolean) {
  const allNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/clients', label: 'Clients', icon: UserSquare2 },
    { href: cid ? `/dashboard/clients/${cid}/team` : '/dashboard/team', label: 'Team', icon: Contact },
    { href: cid ? `/dashboard/clients/${cid}/audit` : '/dashboard/audit', label: 'Audit', icon: BarChart2 },
    { href: cid ? `/dashboard/clients/${cid}/rocks` : '/dashboard/rocks', label: 'Rocks & Goals', icon: Target },
    { href: cid ? `/dashboard/clients/${cid}/oracle` : '/dashboard/oracle', label: 'Oracle', icon: Database },
    { href: cid ? `/dashboard/clients/${cid}/matrix` : '/dashboard/responsibility', label: 'Responsibility Matrix', icon: Users },
    { href: cid ? `/dashboard/clients/${cid}/logins` : '/dashboard/logins', label: 'Login Directory', icon: Key },
    { href: cid ? `/dashboard/clients/${cid}/playbooks` : '/dashboard/playbooks', label: 'Playbooks', icon: BookOpen },
    ...(isAdmin ? [{ href: '/dashboard/settings', label: 'Settings', icon: Settings }] : []),
  ]

  const navSections: NavSection[] = [
    {
      heading: null,
      items: allNavItems.filter(i => i.href === '/dashboard' || i.href === '/dashboard/clients'),
    },
    {
      heading: 'TOOLS',
      items: allNavItems.filter(i => ['Team', 'Audit', 'Rocks & Goals', 'Oracle', 'Responsibility Matrix'].includes(i.label)),
    },
    {
      heading: 'RESOURCES',
      items: allNavItems.filter(i => ['Login Directory', 'Playbooks'].includes(i.label)),
    },
    ...(isAdmin ? [{ heading: 'ADMINISTRATION', items: allNavItems.filter(i => i.label === 'Settings') }] : []),
  ]

  return { allNavItems, navSections }
}
