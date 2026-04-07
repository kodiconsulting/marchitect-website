'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Check } from 'lucide-react'

interface Workspace {
  id: string
  clientName: string
}

export default function ClientSwitcher({ workspaces }: { workspaces: Workspace[] }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-sm text-zinc-400 bg-zinc-800 hover:bg-zinc-700 rounded-lg px-3 py-2 transition-colors"
      >
        <span className="truncate">
          {workspaces.length === 0 ? 'No clients yet' : 'Select Client'}
        </span>
        <ChevronDown className={`size-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && workspaces.length > 0 && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  setOpen(false)
                  router.push(`/dashboard/clients/${ws.id}`)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors text-left"
              >
                <div className="size-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {ws.clientName.charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{ws.clientName}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
