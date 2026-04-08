import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Plus } from 'lucide-react'

const categories = [
  'All',
  'Hosting',
  'CRM',
  'Email Marketing',
  'Ad Platform',
  'Analytics',
  'Social Media',
  'CMS/Website',
  'Design Tools',
  'Other',
]

export default async function LoginsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#252f4a]">Login Directory</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          Central record of all tools and platforms — URLs and usernames only, no passwords.
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat, i) => (
          <button
            key={cat}
            type="button"
            className={
              i === 0
                ? 'inline-flex h-7 items-center rounded-full bg-[#1B84FF] px-3 text-xs font-medium text-[#252f4a] transition-colors'
                : 'inline-flex h-7 items-center rounded-full border border-[#e8e8e8] px-3 text-xs font-medium text-[#78829d] transition-colors hover:border-[#1B84FF] hover:text-[#252f4a]'
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <Card className="bg-white border-[#e8e8e8]">
        <CardContent className="py-16 flex flex-col items-center justify-center gap-4">
          <p className="text-[#78829d] text-sm">No login entries yet.</p>
          <button
            type="button"
            className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-[#1B84FF] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1366cc]"
          >
            <Plus className="size-4" />
            Add Entry
          </button>
        </CardContent>
      </Card>

      {/* Info note */}
      <div className="flex items-start gap-3 mt-6 rounded-lg border border-[#f6a600]/20 bg-yellow-500/5 px-4 py-3">
        <AlertTriangle className="size-4 text-[#f6a600] mt-0.5 shrink-0" />
        <p className="text-[#78829d] text-sm">
          This is not a password manager. Store passwords in 1Password or your team&apos;s
          password manager.
        </p>
      </div>
    </div>
  )
}
