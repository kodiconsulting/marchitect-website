'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Kpi {
  id: string
  name: string
  definition: string | null
  owner: string | null
  targetValue: string | null
  currentValue: string | null
  unit: string | null
  updateFrequency: string | null
}

interface TeamMember { id: string; name: string; title: string | null }

interface Props {
  kpis: Kpi[]
  workspaceId: string
  teamMembers: TeamMember[]
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-white border border-[#e8e8e8] rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#252f4a] font-semibold text-base">{title}</h2>
          <button onClick={onClose} className="text-[#78829d] hover:text-[#252f4a] transition-colors text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

const FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually']

export default function KpisManager({ kpis: initial, workspaceId, teamMembers }: Props) {
  const router = useRouter()
  const [kpis, setKpis] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Kpi | null>(null)
  const [deleting, setDeleting] = useState<Kpi | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', definition: '', owner: '',
    targetValue: '', currentValue: '', unit: '', updateFrequency: 'Monthly',
  })

  function openAdd() {
    setForm({ name: '', definition: '', owner: '', targetValue: '', currentValue: '', unit: '', updateFrequency: 'Monthly' })
    setShowAdd(true)
  }

  function openEdit(kpi: Kpi) {
    setForm({
      name: kpi.name,
      definition: kpi.definition ?? '',
      owner: kpi.owner ?? '',
      targetValue: kpi.targetValue ?? '',
      currentValue: kpi.currentValue ?? '',
      unit: kpi.unit ?? '',
      updateFrequency: kpi.updateFrequency ?? 'Monthly',
    })
    setEditing(kpi)
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const body = {
        name: form.name.trim(),
        definition: form.definition.trim() || undefined,
        owner: form.owner.trim() || undefined,
        unit: form.unit.trim() || '',
        updateFrequency: form.updateFrequency,
        ...(form.targetValue ? { targetValue: parseFloat(form.targetValue) } : {}),
        ...(form.currentValue ? { currentValue: parseFloat(form.currentValue) } : {}),
      }
      if (editing) {
        const res = await fetch(`/api/workspaces/${workspaceId}/kpis/${editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setKpis(kpis.map(k => k.id === editing.id ? updated : k))
          setEditing(null)
          router.refresh()
        }
      } else {
        const res = await fetch(`/api/workspaces/${workspaceId}/kpis`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const created = await res.json()
          setKpis([...kpis, created])
          setShowAdd(false)
          router.refresh()
        }
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleting) return
    setSaving(true)
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/kpis/${deleting.id}`, { method: 'DELETE' })
      if (res.ok) {
        setKpis(kpis.filter(k => k.id !== deleting.id))
        setDeleting(null)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#78829d] uppercase tracking-wider">KPIs</h2>
        <button
          onClick={openAdd}
          className="text-xs bg-gray-200 hover:bg-zinc-600 text-[#252f4a] font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          Add KPI
        </button>
      </div>

      {kpis.length === 0 ? (
        <div className="bg-white border border-[#e8e8e8] rounded-xl py-12 text-center">
          <p className="text-[#78829d] text-sm">No KPIs defined yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8e8e8]">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-[#78829d] uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-[#78829d] uppercase tracking-wider">Owner</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-[#78829d] uppercase tracking-wider">Current</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-[#78829d] uppercase tracking-wider">Target</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-[#78829d] uppercase tracking-wider">Frequency</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {kpis.map(kpi => (
                  <tr key={kpi.id} className="border-t border-[#e8e8e8] hover:bg-[#f1f1f4]/40 transition-colors">
                    <td className="px-4 py-3 text-[#4b5675] font-medium">{kpi.name}</td>
                    <td className="px-4 py-3 text-[#78829d]">{kpi.owner ?? '—'}</td>
                    <td className="px-4 py-3 text-[#4b5675]">{kpi.currentValue != null ? `${kpi.currentValue}${kpi.unit ? ` ${kpi.unit}` : ''}` : '—'}</td>
                    <td className="px-4 py-3 text-[#78829d]">{kpi.targetValue != null ? `${kpi.targetValue}${kpi.unit ? ` ${kpi.unit}` : ''}` : '—'}</td>
                    <td className="px-4 py-3 text-[#78829d]">{kpi.updateFrequency ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(kpi)} className="text-xs text-[#78829d] hover:text-[#4b5675] transition-colors">Edit</button>
                        <button onClick={() => setDeleting(kpi)} className="text-xs text-red-500 hover:text-red-400 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(showAdd || editing) && (
        <Modal title={editing ? 'Edit KPI' : 'Add KPI'} onClose={() => { setShowAdd(false); setEditing(null) }}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-[#78829d] mb-1">Name *</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF]"
                placeholder="KPI name"
              />
            </div>
            <div>
              <label className="block text-xs text-[#78829d] mb-1">Definition</label>
              <textarea
                value={form.definition}
                onChange={e => setForm({ ...form, definition: e.target.value })}
                className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF] resize-none"
                rows={2}
                placeholder="How is this measured?"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#78829d] mb-1">Owner</label>
                <input
                  value={form.owner}
                  onChange={e => setForm({ ...form, owner: e.target.value })}
                  className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF]"
                  placeholder="Person"
                />
              </div>
              <div>
                <label className="block text-xs text-[#78829d] mb-1">Unit</label>
                <input
                  value={form.unit}
                  onChange={e => setForm({ ...form, unit: e.target.value })}
                  className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF]"
                  placeholder="%, $, leads…"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#78829d] mb-1">Current Value</label>
                <input
                  type="number"
                  value={form.currentValue}
                  onChange={e => setForm({ ...form, currentValue: e.target.value })}
                  className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF]"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-[#78829d] mb-1">Target Value</label>
                <input
                  type="number"
                  value={form.targetValue}
                  onChange={e => setForm({ ...form, targetValue: e.target.value })}
                  className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF]"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#78829d] mb-1">Update Frequency</label>
              <select
                value={form.updateFrequency}
                onChange={e => setForm({ ...form, updateFrequency: e.target.value })}
                className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] outline-none focus:border-[#1B84FF]"
              >
                {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => { setShowAdd(false); setEditing(null) }}
                className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete KPI" onClose={() => setDeleting(null)}>
          <p className="text-[#4b5675] text-sm mb-4">Are you sure you want to delete this KPI? This cannot be undone.</p>
          <p className="text-[#78829d] text-sm italic mb-5">&ldquo;{deleting.name}&rdquo;</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleting(null)} className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors px-3 py-1.5">Cancel</button>
            <button onClick={handleDelete} disabled={saving} className="text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
              {saving ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
