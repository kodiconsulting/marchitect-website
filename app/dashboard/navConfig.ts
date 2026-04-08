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
  Megaphone,
  CalendarDays,
  Mail,
  DollarSign,
  Palette,
  FolderOpen,
  ClipboardList,
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
    { href: cid ? `/dashboard/clients/${cid}/campaigns` : '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone },
    { href: cid ? `/dashboard/clients/${cid}/promo` : '/dashboard/promo', label: 'Promo Calendar', icon: CalendarDays },
    { href: cid ? `/dashboard/clients/${cid}/sequences` : '/dashboard/sequences', label: 'Sequences', icon: Mail },
    { href: cid ? `/dashboard/clients/${cid}/budgets` : '/dashboard/budgets', label: 'Budgets', icon: DollarSign },
    { href: cid ? `/dashboard/clients/${cid}/brand-assets` : '/dashboard/brand-assets', label: 'Brand Assets', icon: Palette },
    { href: cid ? `/dashboard/clients/${cid}/source-docs` : '/dashboard/source-docs', label: 'Source Materials', icon: FolderOpen },
    { href: cid ? `/dashboard/clients/${cid}/projects` : '/dashboard/projects', label: 'Projects', icon: ClipboardList },
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
      heading: 'MARKETING',
      items: allNavItems.filter(i => ['Campaigns', 'Promo Calendar', 'Sequences', 'Budgets'].includes(i.label)),
    },
    {
      heading: 'RESOURCES',
      items: allNavItems.filter(i => ['Login Directory', 'Playbooks', 'Brand Assets', 'Source Materials', 'Projects'].includes(i.label)),
    },
    ...(isAdmin ? [{ heading: 'ADMINISTRATION', items: allNavItems.filter(i => i.label === 'Settings') }] : []),
  ]

  return { allNavItems, navSections }
}
