import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, Info } from 'lucide-react'

const pillars = [
  { label: 'Pillar 1', subtitle: 'Brand Foundation' },
  { label: 'Pillar 2', subtitle: 'Lead Generation' },
  { label: 'Pillar 3', subtitle: 'Nurture & Retention' },
  { label: 'Pillar 4', subtitle: 'Measurement & Optimisation' },
]

export default async function PlaybooksPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#252f4a]">Playbook Library</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          Templates, checklists, and frameworks organized by pillar.
        </p>
      </div>

      {/* Top note */}
      <div className="flex items-start gap-3 rounded-lg border border-[#e8e8e8] bg-white px-4 py-3 mb-8">
        <Info className="size-4 text-[#78829d] mt-0.5 shrink-0" />
        <p className="text-[#78829d] text-sm">
          The full playbook library will be populated as templates are built. Each playbook
          is linked to the audit items it supports.
        </p>
      </div>

      <div className="space-y-3">
        {pillars.map((pillar) => (
          <Card key={pillar.label} className="bg-white border-[#e8e8e8]">
            {/* Collapsed header — acts as an accordion trigger (static scaffold) */}
            <button
              type="button"
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div>
                <span className="text-sm font-semibold text-[#252f4a]">{pillar.label}</span>
                <span className="ml-2 text-sm text-[#78829d]">{pillar.subtitle}</span>
              </div>
              <ChevronDown className="size-4 text-[#78829d] shrink-0" />
            </button>
            <CardContent className="px-5 pb-5 pt-0 border-t border-[#e8e8e8]">
              <p className="text-[#78829d] text-sm py-4 text-center">
                No playbooks added yet for this pillar.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
