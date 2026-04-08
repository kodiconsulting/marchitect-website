'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Rock {
  id: string
  quarter: string
  title: string
  description: string | null
  owner: string
  status: string
  targetDate: string | null
}

interface TeamMember { id: string; name: string; title: string | null }

interface Props {
  rocks: Rock[]
  workspaceId: string
  quarterKey: string
  quarterLabel: string
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

const STATUS_OPTIONS = ['not_started', 'in_progress', 'complete', 'off_track']
const STATUS_LABELS: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  complete: 'Complete',
  off_track: 'Off Track',
}
const STATUS_COLORS: Record<string, string> = {
  not_started: 'bg-[#f1f1f4] text-[#78829d] border-[#e8e8e8]',
  in_progress: 'bg-blue-500/20 text-[#1B84FF] border-blue-500/30',
  complete: 'bg-green-500/20 text-green-400 border-green-500/30',
  off_track: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function RocksManager({ rocks: initial, workspaceId, quarterKey, quarterLabel, teamMembers }: Props) {
  const router = useRouter()
  const [rocks, setRocks] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Rock | null>(null)
  const [deleting, setDeleting] = useState<Rock | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', owner: '', status: 'not_started', targetDate: '' })

  function openAdd() {
    setForm({ title: '', description: '', owner: '', status: 'not_started', targetDate: '' })
    setShowAdd(true)
  }

  function openEdit(rock: Rock) {
    setForm({
      title: rock.title,
      description: rock.description ?? '',
      owner: rock.owner,
      status: rock.status,
      targetDate: rock.targetDate ?? '',
    })
    setEditing(rock)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.owner.trim()) return
    setSaving(true)
    try {
      const body = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        owner: form.owner.trim(),
        status: form.status,
        targetDate: form.targetDate || undefined,
        quarter: quarterKey,
      }
      if (editing) {
        const res = await fetch(`/api/workspaces/${workspaceId}/rocks/${editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setRocks(rocks.map(r => r.id === editing.id ? updated : r))
          setEditing(null)
          router.refresh()
        }
      } else {
        const res = await fetch(`/api/workspaces/${workspaceId}/rocks`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const created = await res.json()
          setRocks([...rocks, created])
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
      const res = await fetch(`/api/workspaces/${workspaceId}/rocks/${deleting.id}`, { method: 'DELETE' })
      if (res.ok) {
        setRocks(rocks.filter(r => r.id !== deleting.id))
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
        <h2 className="text-sm font-semibold text-[#78829d] uppercase tracking-wider">
          Rocks — {quarterLabel}
        </h2>
        <button
          onClick={openAdd}
          className="text-xs bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          Add Rock
        </button>
      </div>

      {rocks.length === 0 ? (
        <div className="bg-white border border-[#e8e8e8] rounded-xl py-12 text-center mb-8">
          <p className="text-[#78829d] text-sm">No rocks defined yet for {quarterLabel}.</p>
        </div>
      ) : (
        <div className="space-y-2 mb-8">
          {rocks.map(rock => {
            const colorClass = STATUS_COLORS[rock.status] ?? STATUS_COLORS.not_started
            const statusLabel = STATUS_LABELS[rock.status] ?? rock.status
            return (
              <div key={rock.id} className="bg-white border border-[#e8e8e8] rounded-lg px-4 py-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#252f4a]">{rock.title}</p>
                  {rock.description && <p className="text-xs text-[#78829d] mt-0.5">{rock.description}</p>}
                  <p className="text-xs text-[#78829d] mt-1">Owner: {rock.owner}</p>
                </div>
                <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border shrink-0 mt-0.5 ${colorClass}`}>
                  {statusLabel}
                </span>
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  <button onClick={() => openEdit(rock)} className="text-xs text-[#78829d] hover:text-[#4b5675] transition-colors">Edit</button>
                  <button onClick={() => setDeleting(rock)} className="text-xs text-red-500 hover:text-red-400 transition-colors">Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {(showAdd || editing) && (
        <Modal title={editing ? 'Edit Rock' : 'Add Rock'} onClose={() => { setShowAdd(false); setEditing(null) }}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-[#78829d] mb-1">Title *</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF]"
                placeholder="Rock title"
              />
            </div>
            <div>
              <label className="block text-xs text-[#78829d] mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF] resize-none"
                rows={2}
                placeholder="Optional details"
              />
            </div>
            <div>
              <label className="block text-xs text-[#78829d] mb-1">Owner *</label>
              {teamMembers.length > 0 ? (
                <select
                  value={form.owner}
                  onChange={e => setForm({ ...form, owner: e.target.value })}
                  className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] outline-none focus:border-[#1B84FF]"
                >
                  <option value="">— Select owner —</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.name}>{m.name}{m.title ? ` — ${m.title}` : ''}</option>
                  ))}
                </select>
              ) : (
                <input
                  value={form.owner}
                  onChange={e => setForm({ ...form, owner: e.target.value })}
                  className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF]"
                  placeholder="Person responsible"
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#78829d] mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] outline-none focus:border-[#1B84FF]"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#78829d] mb-1">Target Date</label>
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={e => setForm({ ...form, targetDate: e.target.value })}
                  className="w-full bg-[#f1f1f4] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] outline-none focus:border-[#1B84FF]"
                />
              </div>
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
                disabled={saving || !form.title.trim() || !form.owner.trim()}
                className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete Rock" onClose={() => setDeleting(null)}>
          <p className="text-[#4b5675] text-sm mb-4">Are you sure you want to delete this rock? This cannot be undone.</p>
          <p className="text-[#78829d] text-sm italic mb-5">&ldquo;{deleting.title}&rdquo;</p>
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
