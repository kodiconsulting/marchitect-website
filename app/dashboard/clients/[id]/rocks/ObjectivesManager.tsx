'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface Objective {
  id: string
  workspaceId: string
  name: string
  successDefinition: string | null
  targetTimeline: string | null
  priority: string
  status: string
  createdAt: string
  updatedAt: string
  oracleCompleteness: Record<string, { total: number; filled: number }>
}

interface Props {
  objectives: Objective[]
  workspaceId: string
}

const INPUT = 'w-full bg-[#f9f9f9] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF] transition-colors'
const LABEL = 'block text-xs font-medium text-[#78829d] mb-1'

const PRIORITY_BADGE: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-blue-100 text-blue-700',
  low: 'bg-zinc-100 text-zinc-600',
}

const STATUS_BADGE: Record<string, string> = {
  planning: 'bg-zinc-100 text-zinc-600',
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  complete: 'bg-purple-100 text-purple-700',
}

const EMPTY_FORM = {
  name: '',
  successDefinition: '',
  targetTimeline: '',
  priority: 'medium',
  status: 'planning',
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
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

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function OracleCompleteness({ completeness }: { completeness: Record<string, { total: number; filled: number }> }) {
  const categories = Object.keys(completeness)
  if (categories.length === 0) return null
  const filled = categories.filter(c => completeness[c].filled > 0).length
  const total = categories.length
  return (
    <p className="text-xs text-[#78829d] mt-1">
      Oracle: {filled}/{total} sections complete
    </p>
  )
}

export default function ObjectivesManager({ objectives: initial, workspaceId }: Props) {
  const router = useRouter()
  const [objectives, setObjectives] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Objective | null>(null)
  const [deleting, setDeleting] = useState<Objective | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  function openAdd() {
    setForm(EMPTY_FORM)
    setShowAdd(true)
  }

  function openEdit(obj: Objective) {
    setForm({
      name: obj.name,
      successDefinition: obj.successDefinition ?? '',
      targetTimeline: obj.targetTimeline ?? '',
      priority: obj.priority,
      status: obj.status,
    })
    setEditing(obj)
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const body = {
        name: form.name.trim(),
        successDefinition: form.successDefinition.trim() || null,
        targetTimeline: form.targetTimeline.trim() || null,
        priority: form.priority,
        ...(editing ? { status: form.status } : {}),
      }
      if (editing) {
        const res = await fetch(`/api/workspaces/${workspaceId}/objectives/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setObjectives(objectives.map(o => o.id === editing.id ? { ...o, ...updated } : o))
          setEditing(null)
          router.refresh()
        }
      } else {
        const res = await fetch(`/api/workspaces/${workspaceId}/objectives`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          const created = await res.json()
          setObjectives([...objectives, { ...created, oracleCompleteness: {} }])
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
      const res = await fetch(`/api/workspaces/${workspaceId}/objectives/${deleting.id}`, { method: 'DELETE' })
      if (res.ok) {
        setObjectives(objectives.filter(o => o.id !== deleting.id))
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
        <h2 className="text-sm font-semibold text-[#78829d] uppercase tracking-wider">Objectives</h2>
        <button
          onClick={openAdd}
          className="text-xs bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          Add Objective
        </button>
      </div>

      {objectives.length === 0 ? (
        <div className="bg-white border border-[#e8e8e8] rounded-xl py-12 text-center">
          <p className="text-[#78829d] text-sm mb-3">No Objectives defined yet.</p>
          <button
            onClick={openAdd}
            className="text-xs bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Add Objective
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {objectives.map(obj => (
            <div key={obj.id} className="bg-white border border-[#e8e8e8] rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-[#252f4a] text-sm leading-snug">{obj.name}</p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_BADGE[obj.priority] ?? 'bg-zinc-100 text-zinc-600'}`}>
                    {cap(obj.priority)}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_BADGE[obj.status] ?? 'bg-zinc-100 text-zinc-600'}`}>
                    {cap(obj.status)}
                  </span>
                </div>
              </div>

              {obj.successDefinition && (
                <p className="text-xs text-[#78829d] line-clamp-2 leading-relaxed">{obj.successDefinition}</p>
              )}

              {obj.targetTimeline && (
                <p className="text-xs text-[#78829d]">
                  <span className="text-[#aab0be]">Target:</span> {obj.targetTimeline}
                </p>
              )}

              <OracleCompleteness completeness={obj.oracleCompleteness} />

              <div className="flex items-center justify-end gap-3 pt-1 mt-auto border-t border-[#f1f1f4]">
                <button onClick={() => openEdit(obj)} className="text-xs text-[#78829d] hover:text-[#252f4a] transition-colors">Edit</button>
                <button onClick={() => setDeleting(obj)} className="text-xs text-[#f8285a] hover:text-red-600 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAdd || editing) && (
        <Modal
          title={editing ? 'Edit Objective' : 'Add Objective'}
          onClose={() => { setShowAdd(false); setEditing(null) }}
        >
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={INPUT} placeholder="Objective name" />
            </div>
            <div>
              <label className={LABEL}>Success Definition</label>
              <textarea
                value={form.successDefinition}
                onChange={e => setForm({ ...form, successDefinition: e.target.value })}
                className={INPUT}
                rows={3}
                placeholder="What does success look like? E.g. 50 qualified leads/month at <$80 CPL"
              />
            </div>
            <div>
              <label className={LABEL}>Target Timeline</label>
              <input value={form.targetTimeline} onChange={e => setForm({ ...form, targetTimeline: e.target.value })} className={INPUT} placeholder="e.g. Q3 2026" />
            </div>
            <div className={editing ? 'grid grid-cols-2 gap-3' : ''}>
              <div>
                <label className={LABEL}>Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className={INPUT}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              {editing && (
                <div>
                  <label className={LABEL}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={INPUT}>
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => { setShowAdd(false); setEditing(null) }} className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors px-3 py-1.5">
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
        <Modal title="Delete Objective" onClose={() => setDeleting(null)}>
          <p className="text-[#4b5675] text-sm mb-2">
            Delete <span className="text-[#252f4a] font-semibold">{deleting.name}</span>?
          </p>
          <p className="text-[#78829d] text-xs mb-5">
            This will also delete all Oracle data for this Objective (Product/Service, Avatars, Offers, Channel Strategy). This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleting(null)} className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors px-3 py-1.5">
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="text-sm bg-[#f8285a] hover:bg-red-600 disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors"
            >
              {saving ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
