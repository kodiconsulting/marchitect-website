import {
  LayoutDashboard,
  BarChart2,
  Target,
  Database,
  Users,
  Key,
  Settings,
  UserSquare2,
  Contact,
  Megaphone,
  CalendarDays,
  DollarSign,
  Palette,
  FolderOpen,
  Globe,
  LineChart,
  FileText,
  Tag,
  ClipboardCheck,
  BrainCircuit,
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
  const c = (path: string) => cid ? `/dashboard/clients/${cid}${path}` : null

  const allNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ...(isAdmin ? [{ href: '/dashboard/clients', label: 'Clients', icon: UserSquare2 }] : []),
    { href: c('/audit') ?? '/dashboard/audit', label: 'Audit', icon: BarChart2 },

    // Operations
    { href: c('/team') ?? '/dashboard/team', label: 'Team Directory', icon: Contact },
    { href: c('/matrix') ?? '/dashboard/responsibility', label: 'Responsibility Matrix', icon: Users },
    { href: c('/logins') ?? '/dashboard/logins', label: 'Login & Asset Directory', icon: Key },
    { href: c('/brand-assets') ?? '/dashboard/brand-assets', label: 'Brand Assets', icon: Palette },
    { href: c('/digital-properties') ?? '/dashboard/digital-properties', label: 'Digital Properties', icon: Globe },

    // Brand & Market Intelligence
    { href: c('/oracle') ?? '/dashboard/oracle', label: 'Brand', icon: BrainCircuit },

    // Goals & Objectives
    { href: c('/rocks') ?? '/dashboard/rocks', label: 'Goals & Objectives', icon: Target },
    { href: c('/budgets') ?? '/dashboard/budgets', label: 'Budget', icon: DollarSign },

    // Campaigns
    { href: c('/campaigns') ?? '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone },

    // Content & Promotions
    { href: c('/content-strategy') ?? '/dashboard/content-strategy', label: 'Content Strategy', icon: FileText },
    { href: c('/content-calendar') ?? '/dashboard/content-calendar', label: 'Content Calendar', icon: CalendarDays },
    { href: c('/promo') ?? '/dashboard/promo', label: 'Promotions', icon: Tag },
    { href: c('/production-tracker') ?? '/dashboard/production-tracker', label: 'Production Tracker', icon: ClipboardCheck },

    // Source Material
    { href: c('/source-docs') ?? '/dashboard/source-docs', label: 'Source Material', icon: FolderOpen },

    // Dashboards & Reporting
    { href: c('/reporting') ?? '/dashboard/reporting', label: 'Dashboards & Reporting', icon: LineChart },

    ...(isAdmin ? [{ href: '/dashboard/settings', label: 'Settings', icon: Settings }] : []),
  ]

  const navSections: NavSection[] = [
    {
      heading: null,
      items: allNavItems.filter(i =>
        i.label === 'Dashboard' || i.label === 'Clients' || i.label === 'Audit'
      ),
    },
    {
      heading: 'Operations',
      items: allNavItems.filter(i =>
        ['Team Directory', 'Responsibility Matrix', 'Login & Asset Directory', 'Brand Assets', 'Digital Properties'].includes(i.label)
      ),
    },
    {
      heading: 'Brand & Market Intelligence',
      items: allNavItems.filter(i => i.label === 'Brand'),
    },
    {
      heading: 'Goals & Objectives',
      items: allNavItems.filter(i => ['Goals & Objectives', 'Budget'].includes(i.label)),
    },
    {
      heading: null,
      items: allNavItems.filter(i => i.label === 'Campaigns'),
    },
    {
      heading: 'Content & Promotions',
      items: allNavItems.filter(i =>
        ['Content Strategy', 'Content Calendar', 'Promotions', 'Production Tracker'].includes(i.label)
      ),
    },
    {
      heading: null,
      items: allNavItems.filter(i =>
        ['Source Material', 'Dashboards & Reporting'].includes(i.label)
      ),
    },
    ...(isAdmin ? [{ heading: 'Administration', items: allNavItems.filter(i => i.label === 'Settings') }] : []),
  ]

  return { allNavItems, navSections }
}
