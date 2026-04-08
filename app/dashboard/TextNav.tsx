'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { signOutAction } from '@/app/actions'
import ClientSwitcher from '@/components/ClientSwitcher'
import { buildNav } from './navConfig'

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href
  return pathname === href || pathname.startsWith(href + '/')
}

export default function TextNav({
  cid,
  isAdmin,
  workspaces,
  selectedClientId,
  selectedClientName,
  userName,
  userRole,
}: {
  cid: string | null
  isAdmin: boolean
  workspaces: { id: string; clientName: string }[]
  selectedClientId: string | null
  selectedClientName: string | null
  userName: string
  userRole: string
}) {
  const pathname = usePathname()
  const { navSections } = buildNav(cid, isAdmin)

  return (
    <div className="w-[220px] shrink-0 bg-[#fafafa] border-r border-[#e8e8e8] flex flex-col">
      {/* Workspace / client switcher */}
      <div className="px-4 py-4 border-b border-[#e8e8e8]">
        <ClientSwitcher
          workspaces={workspaces}
          selectedClientId={selectedClientId}
          selectedClientName={selectedClientName}
        />
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navSections.map((section, i) => (
          <div key={i}>
            {section.heading && (
              <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9a9cae]">
                {section.heading}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href, item.exact)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 text-[13px] rounded-lg transition-colors ${
                      active
                        ? 'text-[#1B84FF] font-medium'
                        : 'text-[#4b5675] hover:text-[#252f4a] hover:bg-[#f1f1f4]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + sign out */}
      <div className="px-3 py-3 border-t border-[#e8e8e8]">
        <div className="px-3 mb-1">
          <p className="text-[13px] font-medium text-[#252f4a] truncate">{userName}</p>
          <p className="text-[12px] text-[#78829d] capitalize">{userRole}</p>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#78829d] hover:text-[#252f4a] hover:bg-[#f1f1f4] rounded-lg transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
