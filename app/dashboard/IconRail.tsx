'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(item.href + '/')
}

export default function IconRail({
  navItems,
  userInitials,
}: {
  navItems: NavItem[]
  userInitials: string
}) {
  const pathname = usePathname()

  return (
    <div className="w-[60px] shrink-0 bg-white border-r border-[#e8e8e8] flex flex-col items-center py-4">
      {/* Logo mark */}
      <div className="size-8 rounded-xl bg-[#1B84FF] flex items-center justify-center text-white font-bold text-sm mb-5 shrink-0">
        M
      </div>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-1 flex-1 w-full px-2">
        {navItems.map((item) => {
          const active = isActive(pathname, item)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`w-full flex items-center justify-center h-10 rounded-xl transition-colors ${
                active
                  ? 'bg-[#1B84FF]/10 text-[#1B84FF]'
                  : 'text-[#78829d] hover:bg-[#f1f1f4] hover:text-[#252f4a]'
              }`}
            >
              <Icon className="size-5 stroke-[1.6]" />
            </Link>
          )
        })}
      </nav>

      {/* User avatar pinned to bottom */}
      <div className="size-8 rounded-full bg-[#1B84FF] flex items-center justify-center text-white text-xs font-semibold shrink-0 select-none">
        {userInitials}
      </div>
    </div>
  )
}
