'use client'

import { usePathname } from 'next/navigation'
import { Search, Bell } from 'lucide-react'

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Home',
  clients: 'Clients',
  new: 'New Client',
  audit: 'Audit',
  pillar: 'Pillar',
  rocks: 'Rocks & Goals',
  oracle: 'Oracle',
  matrix: 'Responsibility Matrix',
  logins: 'Login Directory',
  playbooks: 'Playbooks',
  settings: 'Settings',
  responsibility: 'Responsibility Matrix',
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function buildBreadcrumb(segments: string[], clientName: string | null) {
  const crumbs: string[] = []
  for (const seg of segments) {
    if (UUID_RE.test(seg)) {
      // Replace UUID with client name if we have it
      if (clientName) crumbs.push(clientName)
    } else {
      const label = SEGMENT_LABELS[seg]
      if (label && label !== 'Home') crumbs.push(label)
    }
  }
  return crumbs
}

function getPageTitle(segments: string[], clientName: string | null): string {
  // Walk backwards to find last meaningful (non-UUID) segment
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i]
    if (UUID_RE.test(seg)) {
      return clientName ?? 'Client'
    }
    const label = SEGMENT_LABELS[seg]
    if (label) return label
  }
  return 'Dashboard'
}

export default function DashboardHeader({
  selectedClientName,
}: {
  selectedClientName: string | null
}) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean) // ['dashboard', 'clients', 'uuid', 'audit']

  const title = getPageTitle(segments, selectedClientName)
  const breadcrumbs = buildBreadcrumb(segments, selectedClientName)

  return (
    <div className="h-[60px] shrink-0 bg-white border-b border-[#e8e8e8] px-6 flex items-center justify-between">
      <div>
        <h1 className="text-[20px] font-semibold text-[#252f4a] leading-tight">{title}</h1>
        {breadcrumbs.length > 0 && (
          <p className="text-[12px] text-[#78829d] leading-tight">
            Home
            {breadcrumbs.map((crumb, i) => (
              <span key={i}>
                <span className="mx-1 text-[#e8e8e8]">/</span>
                {crumb}
              </span>
            ))}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="size-9 flex items-center justify-center rounded-lg text-[#78829d] hover:bg-[#f1f1f4] hover:text-[#252f4a] transition-colors"
          title="Search"
        >
          <Search className="size-4" />
        </button>
        <button
          type="button"
          className="size-9 flex items-center justify-center rounded-lg text-[#78829d] hover:bg-[#f1f1f4] hover:text-[#252f4a] transition-colors"
          title="Notifications"
        >
          <Bell className="size-4" />
        </button>
      </div>
    </div>
  )
}
