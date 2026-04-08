'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export type MatrixRow = {
  functionId: string
  functionName: string
  category: string
  assignedOwner: string | null
  internalExternal: string | null
  gwcGet: boolean | null
  gwcWant: boolean | null
  gwcCapacity: boolean | null
  notes: string | null
}

const CATEGORIES = [
  'Decision & Approval',
  'Strategy & Planning',
  'Execution & Production',
  'Monitoring & Reporting',
  'Vendor & Contractor Management',
]

function gwcLabel(row: MatrixRow) {
  const parts = [
    row.gwcGet ? 'G' : null,
    row.gwcWant ? 'W' : null,
    row.gwcCapacity ? 'C' : null,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join('/') : '—'
}

export default function MatrixEditor({
  workspaceId,
  initialRows,
}: {
  workspaceId: string
  initialRows: MatrixRow[]
}) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [rows, setRows] = useState(initialRows)
  const [saving, setSaving] = useState<Set<string>>(new Set())

  async function save(functionId: string, patch: Partial<MatrixRow>) {
    setSaving(prev => new Set(prev).add(functionId))
    setRows(prev =>
      prev.map(r => (r.functionId === functionId ? { ...r, ...patch } : r))
    )

    const row = rows.find(r => r.functionId === functionId)!
    const merged = { ...row, ...patch }

    await fetch(`/api/workspaces/${workspaceId}/matrix/${functionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignedOwner: merged.assignedOwner ?? '',
        internalExternal: merged.internalExternal ?? '',
        gwcGet: merged.gwcGet ?? false,
        gwcWant: merged.gwcWant ?? false,
        gwcCapacity: merged.gwcCapacity ?? false,
        notes: merged.notes ?? '',
      }),
    })

    setSaving(prev => {
      const next = new Set(prev)
      next.delete(functionId)
      return next
    })
    router.refresh()
  }

  const byCategory = Object.fromEntries(
    CATEGORIES.map(cat => [cat, rows.filter(r => r.category === cat)])
  )

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#252f4a]">Responsibility Matrix</h1>
          <p className="text-[#78829d] mt-1 text-sm">
            Every marketing function mapped to an owner.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(e => !e)}
          className="inline-flex h-8 items-center justify-center rounded-lg bg-[#1B84FF] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1366cc]"
        >
          {editing ? 'Done' : 'Edit Matrix'}
        </button>
      </div>

      <div className="space-y-6">
        {CATEGORIES.filter(cat => byCategory[cat]?.length).map(cat => (
          <Card key={cat} className="bg-white border-[#e8e8e8]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#252f4a]">{cat}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-[#e8e8e8]">
                      <th className="text-left px-6 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider w-1/3">Function</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">Owner</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">Internal / External</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">GWC</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byCategory[cat].map(row => {
                      const isSaving = saving.has(row.functionId)
                      return (
                        <tr
                          key={row.functionId}
                          className={`border-t border-[#e8e8e8] transition-colors ${isSaving ? 'opacity-60' : 'hover:bg-[#f9f9f9]'}`}
                        >
                          <td className="px-6 py-3 text-[#4b5675]">{row.functionName}</td>

                          {/* Owner */}
                          <td className="px-4 py-3">
                            {editing ? (
                              <input
                                type="text"
                                defaultValue={row.assignedOwner ?? ''}
                                onBlur={e => {
                                  const val = e.target.value.trim() || null
                                  if (val !== row.assignedOwner) save(row.functionId, { assignedOwner: val })
                                }}
                                placeholder="Add owner…"
                                className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded px-2 py-1 text-[#4b5675] placeholder-[#78829d] text-sm outline-none focus:border-blue-500"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-[#78829d]">{row.assignedOwner ?? 'Unassigned'}</span>
                                {!row.assignedOwner && (
                                  <Badge className="bg-[#f6a600]/10 text-[#f6a600] border-[#f6a600]/20 text-xs">Gap</Badge>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Internal / External */}
                          <td className="px-4 py-3">
                            {editing ? (
                              <select
                                value={row.internalExternal ?? ''}
                                onChange={e => {
                                  const val = e.target.value || null
                                  save(row.functionId, { internalExternal: val })
                                }}
                                className="bg-[#f1f1f4] border border-[#e8e8e8] rounded px-2 py-1 text-[#4b5675] text-sm outline-none focus:border-blue-500 cursor-pointer"
                              >
                                <option value="">—</option>
                                <option value="Internal">Internal</option>
                                <option value="External">External</option>
                                <option value="Hybrid">Hybrid</option>
                              </select>
                            ) : (
                              <span className="text-[#78829d]">{row.internalExternal ?? '—'}</span>
                            )}
                          </td>

                          {/* GWC */}
                          <td className="px-4 py-3">
                            {editing ? (
                              <div className="flex items-center gap-3">
                                {(['gwcGet', 'gwcWant', 'gwcCapacity'] as const).map((key, i) => (
                                  <label key={key} className="flex items-center gap-1 cursor-pointer text-[#78829d] text-xs select-none">
                                    <input
                                      type="checkbox"
                                      checked={row[key] ?? false}
                                      onChange={e => save(row.functionId, { [key]: e.target.checked })}
                                      className="accent-[#1B84FF]"
                                    />
                                    {['G', 'W', 'C'][i]}
                                  </label>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[#78829d]">{gwcLabel(row)}</span>
                            )}
                          </td>

                          {/* Notes */}
                          <td className="px-4 py-3">
                            {editing ? (
                              <input
                                type="text"
                                defaultValue={row.notes ?? ''}
                                onBlur={e => {
                                  const val = e.target.value.trim() || null
                                  if (val !== row.notes) save(row.functionId, { notes: val })
                                }}
                                placeholder="Notes…"
                                className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded px-2 py-1 text-[#4b5675] placeholder-[#78829d] text-sm outline-none focus:border-blue-500"
                              />
                            ) : (
                              <span className="text-[#78829d]">{row.notes || '—'}</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
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
