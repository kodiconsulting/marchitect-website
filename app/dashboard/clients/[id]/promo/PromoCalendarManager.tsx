'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface PromoEntry {
  id: string
  month: number
  year: number
  serviceCategory: string | null
  offer: string | null
  status: string
  notes: string | null
}

interface Props {
  items: PromoEntry[]
  workspaceId: string
}

const INPUT = 'w-full bg-[#f9f9f9] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF] transition-colors'
const LABEL = 'block text-xs font-medium text-[#78829d] mb-1'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-blue-100 text-blue-700',
  upcoming: 'bg-zinc-100 text-zinc-600',
  complete: 'bg-green-100 text-green-700',
}

const CURRENT_YEAR = 2026

const EMPTY_FORM = {
  month: '1', year: String(CURRENT_YEAR), serviceCategory: '', offer: '', status: 'upcoming', notes: '',
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white border border-[#e8e8e8] rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#252f4a] font-semibold text-base">{title}</h2>
          <button onClick={onClose} className="text-[#78829d] hover:text-[#252f4a] text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function PromoCalendarManager({ items: initial, workspaceId }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<PromoEntry | null>(null)
  const [deleting, setDeleting] = useState<PromoEntry | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  function openAdd() {
    setForm(EMPTY_FORM)
    setShowAdd(true)
  }

  function openEdit(item: PromoEntry) {
    setForm({
      month: String(item.month),
      year: String(item.year),
      serviceCategory: item.serviceCategory ?? '',
      offer: item.offer ?? '',
      status: item.status,
      notes: item.notes ?? '',
    })
    setEditing(item)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const body = {
        month: parseInt(form.month),
        year: parseInt(form.year),
        serviceCategory: form.serviceCategory.trim() || null,
        offer: form.offer.trim() || null,
        status: form.status,
        notes: form.notes.trim() || null,
      }
      if (editing) {
        const res = await fetch(`/api/workspaces/${workspaceId}/promo/${editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setItems(items.map(i => i.id === editing.id ? updated : i))
          setEditing(null)
          router.refresh()
        }
      } else {
        const res = await fetch(`/api/workspaces/${workspaceId}/promo`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const created = await res.json()
          setItems([...items, created])
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
      const res = await fetch(`/api/workspaces/${workspaceId}/promo/${deleting.id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems(items.filter(i => i.id !== deleting.id))
        setDeleting(null)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  // Group by year then month
  const grouped: { year: number; month: number; entries: PromoEntry[] }[] = []
  const seen = new Set<string>()
  const sorted = [...items].sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
  for (const item of sorted) {
    const key = `${item.year}-${item.month}`
    if (!seen.has(key)) {
      seen.add(key)
      grouped.push({ year: item.year, month: item.month, entries: [] })
    }
    grouped.find(g => g.year === item.year && g.month === item.month)!.entries.push(item)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#252f4a]">Promo Calendar</h1>
          <p className="text-[#78829d] mt-1 text-sm">Plan monthly promotions and offers.</p>
        </div>
        <button onClick={openAdd} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
          Add Entry
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-[#e8e8e8] rounded-xl py-16 text-center">
          <p className="text-[#78829d] text-sm mb-3">No promo entries yet.</p>
          <button onClick={openAdd} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Add Entry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={`${group.year}-${group.month}`} className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#e8e8e8] bg-[#f9f9f9]">
                <h3 className="text-sm font-semibold text-[#252f4a]">{MONTHS[group.month - 1]} {group.year}</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8e8e8]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Offer</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Notes</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {group.entries.map(item => (
                    <tr key={item.id} className="border-t border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors">
                      <td className="px-5 py-3 text-[#252f4a] font-medium">{item.serviceCategory || '—'}</td>
                      <td className="px-4 py-3 text-[#4b5675]">{item.offer || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_BADGE[item.status] ?? 'bg-zinc-100 text-zinc-600'}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#4b5675] max-w-xs truncate">{item.notes || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 justify-end">
                          <button onClick={() => openEdit(item)} className="text-xs text-[#78829d] hover:text-[#252f4a] transition-colors">Edit</button>
                          <button onClick={() => setDeleting(item)} className="text-xs text-[#f8285a] hover:text-red-600 transition-colors">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {(showAdd || editing) && (
        <Modal title={editing ? 'Edit Promo Entry' : 'Add Promo Entry'} onClose={() => { setShowAdd(false); setEditing(null) }}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Month *</label>
                <select value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} className={INPUT}>
                  {MONTHS.map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL}>Year *</label>
                <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className={INPUT}>
                  {[CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={LABEL}>Service Category</label>
              <input value={form.serviceCategory} onChange={e => setForm({ ...form, serviceCategory: e.target.value })} className={INPUT} placeholder="e.g. Dental Cleaning" />
            </div>
            <div>
              <label className={LABEL}>Offer</label>
              <input value={form.offer} onChange={e => setForm({ ...form, offer: e.target.value })} className={INPUT} placeholder="e.g. 20% off first visit" />
            </div>
            <div>
              <label className={LABEL}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={INPUT}>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="complete">Complete</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={INPUT} rows={3} placeholder="Additional notes" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => { setShowAdd(false); setEditing(null) }} className="text-sm border border-[#e8e8e8] text-[#4b5675] hover:bg-[#f1f1f4] px-3 py-1.5 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete Promo Entry" onClose={() => setDeleting(null)}>
          <p className="text-[#4b5675] text-sm mb-2">Delete this entry for <span className="text-[#252f4a] font-medium">{MONTHS[(deleting.month ?? 1) - 1]} {deleting.year}</span>?</p>
          <p className="text-[#78829d] text-xs mb-5">This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleting(null)} className="text-sm border border-[#e8e8e8] text-[#4b5675] hover:bg-[#f1f1f4] px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={saving} className="text-sm bg-[#f8285a] hover:bg-red-600 disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
              {saving ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
