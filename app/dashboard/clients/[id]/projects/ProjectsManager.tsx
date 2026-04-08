'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface Project {
  id: string
  name: string
  owner: string | null
  status: string
  isPast: boolean
  dueDate: string | null
  notes: string | null
}

interface Props {
  items: Project[]
  workspaceId: string
}

const INPUT = 'w-full bg-[#f9f9f9] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF] transition-colors'
const LABEL = 'block text-xs font-medium text-[#78829d] mb-1'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'complete', label: 'Complete' },
  { value: 'pending', label: 'Pending' },
]

const STATUS_BADGE: Record<string, string> = {
  open: 'bg-zinc-100 text-zinc-600',
  in_progress: 'bg-blue-100 text-blue-700',
  complete: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
}

function statusLabel(s: string) {
  return STATUS_OPTIONS.find(o => o.value === s)?.label ?? s
}

const EMPTY_FORM = { name: '', owner: '', status: 'open', isPast: false, dueDate: '', notes: '' }

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

export default function ProjectsManager({ items: initial, workspaceId }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [tab, setTab] = useState<'active' | 'past'>('active')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState<Project | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM)

  const activeItems = items.filter(i => !i.isPast)
  const pastItems = items.filter(i => i.isPast)
  const tabItems = tab === 'active' ? activeItems : pastItems

  function openAdd() {
    setForm({ ...EMPTY_FORM, isPast: tab === 'past' })
    setShowAdd(true)
  }

  function openEdit(item: Project) {
    setForm({
      name: item.name,
      owner: item.owner ?? '',
      status: item.status,
      isPast: item.isPast,
      dueDate: item.dueDate ?? '',
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
        owner: form.owner.trim() || null,
        status: form.status,
        isPast: form.isPast,
        dueDate: form.dueDate.trim() || null,
        notes: form.notes.trim() || null,
      }
      if (editing) {
        const res = await fetch(`/api/workspaces/${workspaceId}/projects/${editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setItems(items.map(i => i.id === editing.id ? updated : i))
          setEditing(null)
          router.refresh()
        }
      } else {
        const res = await fetch(`/api/workspaces/${workspaceId}/projects`, {
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
      const res = await fetch(`/api/workspaces/${workspaceId}/projects/${deleting.id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems(items.filter(i => i.id !== deleting.id))
        setDeleting(null)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  function formatDate(d: string | null) {
    if (!d) return '—'
    try {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return d
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#252f4a]">Projects</h1>
          <p className="text-[#78829d] mt-1 text-sm">Manage active and past client projects.</p>
        </div>
        <button onClick={openAdd} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
          Add Project
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-[#e8e8e8]">
        {(['active', 'past'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-[#1B84FF] text-[#1B84FF]'
                : 'border-transparent text-[#78829d] hover:text-[#252f4a]'
            }`}
          >
            {t === 'active' ? `Active (${activeItems.length})` : `Past (${pastItems.length})`}
          </button>
        ))}
      </div>

      {tabItems.length === 0 ? (
        <div className="bg-white border border-[#e8e8e8] rounded-xl py-16 text-center">
          <p className="text-[#78829d] text-sm mb-3">No {tab} projects yet.</p>
          <button onClick={openAdd} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Add Project
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Owner</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Due Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Notes</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {tabItems.map(item => (
                <tr key={item.id} className="border-t border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors">
                  <td className="px-5 py-3 font-medium text-[#252f4a]">{item.name}</td>
                  <td className="px-4 py-3 text-[#4b5675]">{item.owner || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_BADGE[item.status] ?? 'bg-zinc-100 text-zinc-600'}`}>
                      {statusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#4b5675] whitespace-nowrap">{formatDate(item.dueDate)}</td>
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
        <Modal title={editing ? 'Edit Project' : 'Add Project'} onClose={() => { setShowAdd(false); setEditing(null) }}>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={INPUT} placeholder="Project name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Owner</label>
                <input value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} className={INPUT} placeholder="Person responsible" />
              </div>
              <div>
                <label className={LABEL}>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={INPUT}>
                  {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={LABEL}>Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={INPUT} rows={3} placeholder="Additional notes" />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isPast"
                checked={form.isPast}
                onChange={e => setForm({ ...form, isPast: e.target.checked })}
                className="rounded border-[#e8e8e8]"
              />
              <label htmlFor="isPast" className="text-sm text-[#4b5675]">Mark as past project</label>
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
        <Modal title="Delete Project" onClose={() => setDeleting(null)}>
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
