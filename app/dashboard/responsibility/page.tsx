import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type MatrixRow = {
  function: string
  owner: string
  type: string
  gwc: string
  notes: string
}

type MatrixSection = {
  heading: string
  rows: MatrixRow[]
}

const sections: MatrixSection[] = [
  {
    heading: 'Decision & Approval',
    rows: [
      { function: 'Marketing strategy approval', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      { function: 'Budget sign-off', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      { function: 'Brand standards', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
    ],
  },
  {
    heading: 'Strategy & Planning',
    rows: [
      { function: 'Annual marketing plan', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      { function: 'Campaign planning', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      { function: 'Channel selection', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
    ],
  },
  {
    heading: 'Execution & Production',
    rows: [
      { function: 'Content creation', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      { function: 'Paid ads management', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      { function: 'Email campaigns', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      { function: 'SEO', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
    ],
  },
  {
    heading: 'Monitoring & Reporting',
    rows: [
      { function: 'Analytics reporting', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      { function: 'KPI tracking', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      { function: 'Campaign performance', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
    ],
  },
  {
    heading: 'Vendor & Contractor Management',
    rows: [
      { function: 'Agency relationships', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
      { function: 'Freelancer management', owner: 'Unassigned', type: '—', gwc: '—', notes: '' },
    ],
  },
]

export default async function MatrixPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#252f4a]">Responsibility Matrix</h1>
          <p className="text-[#78829d] mt-1 text-sm">
            Every marketing function mapped to an owner.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-8 items-center justify-center rounded-lg bg-[#1B84FF] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1366cc]"
        >
          Edit Matrix
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.heading} className="bg-white border-[#e8e8e8]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#252f4a]">
                {section.heading}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-[#e8e8e8]">
                      <th className="text-left px-6 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider w-1/3">
                        Function
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">
                        Internal / External
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">
                        GWC
                      </th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row) => (
                      <tr
                        key={row.function}
                        className="border-t border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors"
                      >
                        <td className="px-6 py-3 text-[#4b5675]">{row.function}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[#78829d]">{row.owner}</span>
                            <Badge className="bg-[#f6a600]/10 text-[#f6a600] border-[#f6a600]/20 text-xs">
                              Gap
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#78829d]">{row.type}</td>
                        <td className="px-4 py-3 text-[#78829d]">{row.gwc}</td>
                        <td className="px-4 py-3 text-[#78829d]">{row.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
