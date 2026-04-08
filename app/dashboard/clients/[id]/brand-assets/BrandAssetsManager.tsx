'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface BrandAsset {
  id: string
  assetName: string
  assetType: string | null
  haveIt: string
  link: string | null
  notes: string | null
}

interface Props {
  items: BrandAsset[]
  workspaceId: string
}

const INPUT = 'w-full bg-[#f9f9f9] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF] transition-colors'
const LABEL = 'block text-xs font-medium text-[#78829d] mb-1'

const HAVE_IT_BADGE: Record<string, string> = {
  yes: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  no: 'bg-red-100 text-red-700',
}

const ASSET_TYPES = ['Logo', 'Color', 'Font', 'Photography', 'Brand Guidelines', 'Template', 'Video', 'Other']

const EMPTY_FORM = { assetName: '', assetType: 'Logo', haveIt: 'no', link: '', notes: '' }

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

export default function BrandAssetsManager({ items: initial, workspaceId }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<BrandAsset | null>(null)
  const [deleting, setDeleting] = useState<BrandAsset | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  function openAdd() {
    setForm(EMPTY_FORM)
    setShowAdd(true)
  }

  function openEdit(item: BrandAsset) {
    setForm({
      assetName: item.assetName,
      assetType: item.assetType ?? 'Logo',
      haveIt: item.haveIt,
      link: item.link ?? '',
      notes: item.notes ?? '',
    })
    setEditing(item)
  }

  async function handleSave() {
    if (!form.assetName.trim()) return
    setSaving(true)
    try {
      const body = {
        assetName: form.assetName.trim(),
        assetType: form.assetType || null,
        haveIt: form.haveIt,
        link: form.link.trim() || null,
        notes: form.notes.trim() || null,
      }
      if (editing) {
        const res = await fetch(`/api/workspaces/${workspaceId}/brand-assets/${editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setItems(items.map(i => i.id === editing.id ? updated : i))
          setEditing(null)
          router.refresh()
        }
      } else {
        const res = await fetch(`/api/workspaces/${workspaceId}/brand-assets`, {
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
      const res = await fetch(`/api/workspaces/${workspaceId}/brand-assets/${deleting.id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems(items.filter(i => i.id !== deleting.id))
        setDeleting(null)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  function haveItLabel(v: string) {
    if (v === 'yes') return 'Have It'
    if (v === 'pending') return 'Pending'
    return 'No'
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#252f4a]">Brand Assets</h1>
          <p className="text-[#78829d] mt-1 text-sm">Track logos, colors, fonts, and other brand materials.</p>
        </div>
        <button onClick={openAdd} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
          Add Asset
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-[#e8e8e8] rounded-xl py-16 text-center">
          <p className="text-[#78829d] text-sm mb-3">No brand assets yet.</p>
          <button onClick={openAdd} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Add Asset
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Asset</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Link</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Notes</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors">
                  <td className="px-5 py-3 font-medium text-[#252f4a]">{item.assetName}</td>
                  <td className="px-4 py-3 text-[#4b5675]">{item.assetType || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${HAVE_IT_BADGE[item.haveIt] ?? 'bg-zinc-100 text-zinc-600'}`}>
                      {haveItLabel(item.haveIt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[#1B84FF] hover:underline text-xs">View</a>
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
        <Modal title={editing ? 'Edit Brand Asset' : 'Add Brand Asset'} onClose={() => { setShowAdd(false); setEditing(null) }}>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Asset Name *</label>
              <input value={form.assetName} onChange={e => setForm({ ...form, assetName: e.target.value })} className={INPUT} placeholder="e.g. Primary Logo" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Asset Type</label>
                <select value={form.assetType} onChange={e => setForm({ ...form, assetType: e.target.value })} className={INPUT}>
                  {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Have It?</label>
                <select value={form.haveIt} onChange={e => setForm({ ...form, haveIt: e.target.value })} className={INPUT}>
                  <option value="yes">Yes</option>
                  <option value="pending">Pending</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            <div>
              <label className={LABEL}>Link (URL)</label>
              <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className={INPUT} placeholder="https://..." type="url" />
            </div>
            <div>
              <label className={LABEL}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={INPUT} rows={3} placeholder="Additional notes" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => { setShowAdd(false); setEditing(null) }} className="text-sm border border-[#e8e8e8] text-[#4b5675] hover:bg-[#f1f1f4] px-3 py-1.5 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.assetName.trim()} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete Brand Asset" onClose={() => setDeleting(null)}>
          <p className="text-[#4b5675] text-sm mb-2">Delete <span className="text-[#252f4a] font-medium">{deleting.assetName}</span>?</p>
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
