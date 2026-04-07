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
        <h1 className="text-2xl font-bold text-white">Login Directory</h1>
        <p className="text-zinc-400 mt-1 text-sm">
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
                ? 'inline-flex h-7 items-center rounded-full bg-blue-600 px-3 text-xs font-medium text-white transition-colors'
                : 'inline-flex h-7 items-center rounded-full border border-zinc-700 px-3 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white'
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="py-16 flex flex-col items-center justify-center gap-4">
          <p className="text-zinc-500 text-sm">No login entries yet.</p>
          <button
            type="button"
            className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="size-4" />
            Add Entry
          </button>
        </CardContent>
      </Card>

      {/* Info note */}
      <div className="flex items-start gap-3 mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
        <AlertTriangle className="size-4 text-yellow-400 mt-0.5 shrink-0" />
        <p className="text-zinc-400 text-sm">
          This is not a password manager. Store passwords in 1Password or your team&apos;s
          password manager.
        </p>
      </div>
    </div>
  )
}
