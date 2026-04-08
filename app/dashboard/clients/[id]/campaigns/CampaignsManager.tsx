'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface Campaign {
  id: string
  name: string
  channel: string | null
  offer: string | null
  audience: string | null
  budget: string | null
  cpl: string | null
  status: string
  notes: string | null
}

interface Props {
  items: Campaign[]
  workspaceId: string
}

const INPUT = 'w-full bg-[#f9f9f9] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF] transition-colors'
const LABEL = 'block text-xs font-medium text-[#78829d] mb-1'

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-blue-100 text-blue-700',
  paused: 'bg-yellow-100 text-yellow-700',
  ended: 'bg-zinc-100 text-zinc-600',
}

const EMPTY_FORM = {
  name: '', channel: '', offer: '', audience: '', budget: '', cpl: '', status: 'active', notes: '',
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

export default function CampaignsManager({ items: initial, workspaceId }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [deleting, setDeleting] = useState<Campaign | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  function openAdd() {
    setForm(EMPTY_FORM)
    setShowAdd(true)
  }

  function openEdit(item: Campaign) {
    setForm({
      name: item.name,
      channel: item.channel ?? '',
      offer: item.offer ?? '',
      audience: item.audience ?? '',
      budget: item.budget ?? '',
      cpl: item.cpl ?? '',
      status: item.status,
      notes: item.notes ?? '',
    })
    setEditing(item)
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const body = {
        name: form.name.trim(),
        channel: form.channel.trim() || null,
        offer: form.offer.trim() || null,
        audience: form.audience.trim() || null,
        budget: form.budget.trim() || null,
        cpl: form.cpl.trim() || null,
        status: form.status,
        notes: form.notes.trim() || null,
      }
      if (editing) {
        const res = await fetch(`/api/workspaces/${workspaceId}/campaigns/${editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setItems(items.map(i => i.id === editing.id ? updated : i))
          setEditing(null)
          router.refresh()
        }
      } else {
        const res = await fetch(`/api/workspaces/${workspaceId}/campaigns`, {
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
      const res = await fetch(`/api/workspaces/${workspaceId}/campaigns/${deleting.id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems(items.filter(i => i.id !== deleting.id))
        setDeleting(null)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  const f = (v: string | null) => v || '—'

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#252f4a]">Campaigns</h1>
          <p className="text-[#78829d] mt-1 text-sm">Track ad campaigns, offers, and performance.</p>
        </div>
        <button onClick={openAdd} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
          Add Campaign
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-[#e8e8e8] rounded-xl py-16 text-center">
          <p className="text-[#78829d] text-sm mb-3">No campaigns yet.</p>
          <button onClick={openAdd} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Add Campaign
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Channel</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Offer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Audience</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Budget</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">CPL</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors">
                  <td className="px-5 py-3 font-medium text-[#252f4a]">{item.name}</td>
                  <td className="px-4 py-3 text-[#4b5675]">{f(item.channel)}</td>
                  <td className="px-4 py-3 text-[#4b5675]">{f(item.offer)}</td>
                  <td className="px-4 py-3 text-[#4b5675]">{f(item.audience)}</td>
                  <td className="px-4 py-3 text-[#4b5675]">{item.budget ? `$${item.budget}` : '—'}</td>
                  <td className="px-4 py-3 text-[#4b5675]">{item.cpl ? `$${item.cpl}` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_BADGE[item.status] ?? 'bg-zinc-100 text-zinc-600'}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
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
      )}

      {(showAdd || editing) && (
        <Modal title={editing ? 'Edit Campaign' : 'Add Campaign'} onClose={() => { setShowAdd(false); setEditing(null) }}>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={INPUT} placeholder="Campaign name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Channel</label>
                <input value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })} className={INPUT} placeholder="e.g. Facebook Ads" />
              </div>
              <div>
                <label className={LABEL}>Offer</label>
                <input value={form.offer} onChange={e => setForm({ ...form, offer: e.target.value })} className={INPUT} placeholder="e.g. Free consult" />
              </div>
            </div>
            <div>
              <label className={LABEL}>Audience</label>
              <input value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })} className={INPUT} placeholder="Target audience" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={LABEL}>Budget ($)</label>
                <input value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} className={INPUT} placeholder="0.00" />
              </div>
              <div>
                <label className={LABEL}>CPL ($)</label>
                <input value={form.cpl} onChange={e => setForm({ ...form, cpl: e.target.value })} className={INPUT} placeholder="0.00" />
              </div>
              <div>
                <label className={LABEL}>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={INPUT}>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
            </div>
            <div>
              <label className={LABEL}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={INPUT} rows={3} placeholder="Additional notes" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => { setShowAdd(false); setEditing(null) }} className="text-sm border border-[#e8e8e8] text-[#4b5675] hover:bg-[#f1f1f4] px-3 py-1.5 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete Campaign" onClose={() => setDeleting(null)}>
          <p className="text-[#4b5675] text-sm mb-2">Delete <span className="text-[#252f4a] font-medium">{deleting.name}</span>?</p>
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
