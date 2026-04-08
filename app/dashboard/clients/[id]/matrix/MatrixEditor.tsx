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
          <h1 className="text-2xl font-bold text-gray-900">Responsibility Matrix</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Every marketing function mapped to an owner.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(e => !e)}
          className="inline-flex h-8 items-center justify-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          {editing ? 'Done' : 'Edit Matrix'}
        </button>
      </div>

      <div className="space-y-6">
        {CATEGORIES.filter(cat => byCategory[cat]?.length).map(cat => (
          <Card key={cat} className="bg-white border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-900">{cat}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-gray-200">
                      <th className="text-left px-6 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider w-1/3">Function</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Owner</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Internal / External</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">GWC</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byCategory[cat].map(row => {
                      const isSaving = saving.has(row.functionId)
                      return (
                        <tr
                          key={row.functionId}
                          className={`border-t border-gray-200 transition-colors ${isSaving ? 'opacity-60' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-6 py-3 text-gray-600">{row.functionName}</td>

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
                                className="w-full bg-gray-100 border border-gray-200 rounded px-2 py-1 text-gray-700 placeholder-zinc-600 text-sm outline-none focus:border-blue-500"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">{row.assignedOwner ?? 'Unassigned'}</span>
                                {!row.assignedOwner && (
                                  <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">Gap</Badge>
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
                                className="bg-gray-100 border border-gray-200 rounded px-2 py-1 text-gray-700 text-sm outline-none focus:border-blue-500 cursor-pointer"
                              >
                                <option value="">—</option>
                                <option value="Internal">Internal</option>
                                <option value="External">External</option>
                                <option value="Hybrid">Hybrid</option>
                              </select>
                            ) : (
                              <span className="text-gray-400">{row.internalExternal ?? '—'}</span>
                            )}
                          </td>

                          {/* GWC */}
                          <td className="px-4 py-3">
                            {editing ? (
                              <div className="flex items-center gap-3">
                                {(['gwcGet', 'gwcWant', 'gwcCapacity'] as const).map((key, i) => (
                                  <label key={key} className="flex items-center gap-1 cursor-pointer text-gray-500 text-xs select-none">
                                    <input
                                      type="checkbox"
                                      checked={row[key] ?? false}
                                      onChange={e => save(row.functionId, { [key]: e.target.checked })}
                                      className="accent-blue-500"
                                    />
                                    {['G', 'W', 'C'][i]}
                                  </label>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">{gwcLabel(row)}</span>
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
                                className="w-full bg-gray-100 border border-gray-200 rounded px-2 py-1 text-gray-700 placeholder-zinc-600 text-sm outline-none focus:border-blue-500"
                              />
                            ) : (
                              <span className="text-gray-400">{row.notes || '—'}</span>
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
