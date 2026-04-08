'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface Sequence {
  id: string
  name: string
  stage: string | null
  platform: string | null
  docLink: string | null
  notes: string | null
}

interface Props {
  items: Sequence[]
  workspaceId: string
}

const INPUT = 'w-full bg-[#f9f9f9] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF] transition-colors'
const LABEL = 'block text-xs font-medium text-[#78829d] mb-1'

const EMPTY_FORM = { name: '', stage: '', platform: '', docLink: '', notes: '' }

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

export default function SequencesManager({ items: initial, workspaceId }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Sequence | null>(null)
  const [deleting, setDeleting] = useState<Sequence | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  function openAdd() {
    setForm(EMPTY_FORM)
    setShowAdd(true)
  }

  function openEdit(item: Sequence) {
    setForm({
      name: item.name,
      stage: item.stage ?? '',
      platform: item.platform ?? '',
      docLink: item.docLink ?? '',
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
        stage: form.stage.trim() || null,
        platform: form.platform.trim() || null,
        docLink: form.docLink.trim() || null,
        notes: form.notes.trim() || null,
      }
      if (editing) {
        const res = await fetch(`/api/workspaces/${workspaceId}/sequences/${editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setItems(items.map(i => i.id === editing.id ? updated : i))
          setEditing(null)
          router.refresh()
        }
      } else {
        const res = await fetch(`/api/workspaces/${workspaceId}/sequences`, {
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
      const res = await fetch(`/api/workspaces/${workspaceId}/sequences/${deleting.id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems(items.filter(i => i.id !== deleting.id))
        setDeleting(null)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#252f4a]">Sequences</h1>
          <p className="text-[#78829d] mt-1 text-sm">Manage email/SMS sequences and automation flows.</p>
        </div>
        <button onClick={openAdd} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
          Add Sequence
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-[#e8e8e8] rounded-xl py-16 text-center">
          <p className="text-[#78829d] text-sm mb-3">No sequences yet.</p>
          <button onClick={openAdd} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Add Sequence
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Stage / Trigger</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Platform</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Doc Link</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Notes</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors">
                  <td className="px-5 py-3 font-medium text-[#252f4a]">{item.name}</td>
                  <td className="px-4 py-3 text-[#4b5675]">{item.stage || '—'}</td>
                  <td className="px-4 py-3 text-[#4b5675]">{item.platform || '—'}</td>
                  <td className="px-4 py-3">
                    {item.docLink ? (
                      <a href={item.docLink} target="_blank" rel="noopener noreferrer" className="text-[#1B84FF] hover:underline text-xs">View Doc</a>
                    ) : <span className="text-[#78829d]">—</span>}
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
      )}

      {(showAdd || editing) && (
        <Modal title={editing ? 'Edit Sequence' : 'Add Sequence'} onClose={() => { setShowAdd(false); setEditing(null) }}>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={INPUT} placeholder="Sequence name" />
            </div>
            <div>
              <label className={LABEL}>Stage / Trigger</label>
              <input value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })} className={INPUT} placeholder="e.g. New Lead, Post-Visit" />
            </div>
            <div>
              <label className={LABEL}>Platform</label>
              <input value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} className={INPUT} placeholder="e.g. Klaviyo, ActiveCampaign" />
            </div>
            <div>
              <label className={LABEL}>Doc Link</label>
              <input value={form.docLink} onChange={e => setForm({ ...form, docLink: e.target.value })} className={INPUT} placeholder="https://..." type="url" />
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
        <Modal title="Delete Sequence" onClose={() => setDeleting(null)}>
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
