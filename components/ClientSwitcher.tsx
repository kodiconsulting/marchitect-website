'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Check, X } from 'lucide-react'
import { selectClient, clearSelectedClient } from '@/app/actions'

interface Workspace { id: string; clientName: string }

export default function ClientSwitcher({
  workspaces,
  selectedClientId,
  selectedClientName,
}: {
  workspaces: Workspace[]
  selectedClientId: string | null
  selectedClientName: string | null
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSelect(ws: Workspace) {
    setOpen(false)
    await selectClient(ws.id, ws.clientName)
    router.push('/dashboard')
    router.refresh()
  }

  async function handleClear() {
    setOpen(false)
    await clearSelectedClient()
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg px-3 py-2 transition-colors"
      >
        {selectedClientName ? (
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-5 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {selectedClientName.charAt(0).toUpperCase()}
            </div>
            <span className="text-white truncate">{selectedClientName}</span>
          </div>
        ) : (
          <span className="text-zinc-400">{workspaces.length === 0 ? 'No clients yet' : 'Select Client'}</span>
        )}
        <ChevronDown className={`size-4 shrink-0 text-zinc-400 transition-transform ml-1 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
            {workspaces.map(ws => (
              <button
                key={ws.id}
                onClick={() => handleSelect(ws)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors text-left"
              >
                <div className="size-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {ws.clientName.charAt(0).toUpperCase()}
                </div>
                <span className="truncate flex-1">{ws.clientName}</span>
                {ws.id === selectedClientId && <Check className="size-4 text-blue-400 shrink-0" />}
              </button>
            ))}
            {selectedClientId && (
              <>
                <div className="border-t border-zinc-700" />
                <button
                  onClick={handleClear}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <X className="size-4" />
                  Clear selection
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
