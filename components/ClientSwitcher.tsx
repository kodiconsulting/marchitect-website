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
        className="w-full flex items-center justify-between text-sm bg-white hover:bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 transition-colors"
      >
        {selectedClientName ? (
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-5 rounded-md bg-[#1B84FF] flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {selectedClientName.charAt(0).toUpperCase()}
            </div>
            <span className="text-[#252f4a] truncate font-medium text-[13px]">{selectedClientName}</span>
          </div>
        ) : (
          <span className="text-[#78829d] text-[13px]">{workspaces.length === 0 ? 'No clients yet' : 'Select client…'}</span>
        )}
        <ChevronDown className={`size-4 shrink-0 text-[#78829d] transition-transform ml-1 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-white border border-[#e8e8e8] rounded-xl shadow-lg overflow-hidden">
            {workspaces.map(ws => (
              <button
                key={ws.id}
                onClick={() => handleSelect(ws)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-[#4b5675] hover:bg-[#eef3ff] hover:text-[#1B84FF] transition-colors text-left"
              >
                <div className="size-6 rounded-md bg-[#1B84FF] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {ws.clientName.charAt(0).toUpperCase()}
                </div>
                <span className="truncate flex-1">{ws.clientName}</span>
                {ws.id === selectedClientId && <Check className="size-4 text-[#1B84FF] shrink-0" />}
              </button>
            ))}
            {selectedClientId && (
              <>
                <div className="border-t border-[#e8e8e8]" />
                <button
                  onClick={handleClear}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-[#78829d] hover:bg-[#f1f1f4] hover:text-[#252f4a] transition-colors"
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
