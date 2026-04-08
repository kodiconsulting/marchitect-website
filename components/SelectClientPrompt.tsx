import Link from 'next/link'
import { UserSquare2 } from 'lucide-react'

export default function SelectClientPrompt({ section }: { section: string }) {
  return (
    <div className="p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="size-14 rounded-full bg-[#f1f1f4] flex items-center justify-center mx-auto mb-4">
          <UserSquare2 className="size-7 text-[#78829d]" />
        </div>
        <h2 className="text-lg font-semibold text-[#252f4a] mb-2">No client selected</h2>
        <p className="text-[#78829d] text-sm mb-6 max-w-xs mx-auto">
          Select a client from the sidebar to view their {section}.
        </p>
        <Link
          href="/dashboard/clients"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-[#1B84FF] px-5 text-sm font-medium text-white hover:bg-[#1366cc] transition-colors"
        >
          Go to Clients
        </Link>
      </div>
    </div>
  )
}
