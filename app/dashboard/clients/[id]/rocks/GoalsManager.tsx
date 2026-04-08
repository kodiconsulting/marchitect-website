'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Goal {
  id: string
  goalText: string
  timeframe: string
  linkedRevenueTarget: string | null
  status: string
}

interface Props {
  goals: Goal[]
  workspaceId: string
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-base">{title}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

const STATUS_OPTIONS = ['active', 'achieved', 'paused', 'cancelled']

export default function GoalsManager({ goals: initial, workspaceId }: Props) {
  const router = useRouter()
  const [goals, setGoals] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Goal | null>(null)
  const [deleting, setDeleting] = useState<Goal | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ goalText: '', timeframe: '', linkedRevenueTarget: '', status: 'active' })

  function openAdd() {
    setForm({ goalText: '', timeframe: '', linkedRevenueTarget: '', status: 'active' })
    setShowAdd(true)
  }

  function openEdit(goal: Goal) {
    setForm({
      goalText: goal.goalText,
      timeframe: goal.timeframe,
      linkedRevenueTarget: goal.linkedRevenueTarget ?? '',
      status: goal.status,
    })
    setEditing(goal)
  }

  async function handleSave() {
    if (!form.goalText.trim() || !form.timeframe.trim()) return
    setSaving(true)
    try {
      const body = {
        goalText: form.goalText.trim(),
        timeframe: form.timeframe.trim(),
        status: form.status,
        ...(form.linkedRevenueTarget ? { linkedRevenueTarget: parseFloat(form.linkedRevenueTarget) } : {}),
      }
      if (editing) {
        const res = await fetch(`/api/workspaces/${workspaceId}/goals/${editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setGoals(goals.map(g => g.id === editing.id ? updated : g))
          setEditing(null)
          router.refresh()
        }
      } else {
        const res = await fetch(`/api/workspaces/${workspaceId}/goals`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const created = await res.json()
          setGoals([...goals, created])
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
      const res = await fetch(`/api/workspaces/${workspaceId}/goals/${deleting.id}`, { method: 'DELETE' })
      if (res.ok) {
        setGoals(goals.filter(g => g.id !== deleting.id))
        setDeleting(null)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  const STATUS_COLORS: Record<string, string> = {
    active: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    achieved: 'bg-green-500/20 text-green-400 border-green-500/30',
    paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    cancelled: 'bg-zinc-700 text-zinc-400 border-zinc-600',
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Goals</h2>
        <button
          onClick={openAdd}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl py-12 text-center mb-8">
          <p className="text-zinc-500 text-sm">No goals defined yet.</p>
        </div>
      ) : (
        <div className="space-y-2 mb-8">
          {goals.map(goal => (
            <div key={goal.id} className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200">{goal.goalText}</p>
                {goal.linkedRevenueTarget && (
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Revenue target: ${parseFloat(goal.linkedRevenueTarget).toLocaleString()}
                  </p>
                )}
              </div>
              <span className="text-xs text-zinc-400 shrink-0">{goal.timeframe}</span>
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded border shrink-0 ${STATUS_COLORS[goal.status] ?? 'bg-zinc-700 text-zinc-400 border-zinc-600'}`}>
                {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
              </span>
              <button onClick={() => openEdit(goal)} className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors shrink-0">Edit</button>
              <button onClick={() => setDeleting(goal)} className="text-xs text-red-500 hover:text-red-400 transition-colors shrink-0">Delete</button>
            </div>
          ))}
        </div>
      )}

      {(showAdd || editing) && (
        <Modal title={editing ? 'Edit Goal' : 'Add Goal'} onClose={() => { setShowAdd(false); setEditing(null) }}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Goal *</label>
              <textarea
                value={form.goalText}
                onChange={e => setForm({ ...form, goalText: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500 resize-none"
                rows={3}
                placeholder="Describe the goal…"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Timeframe *</label>
              <input
                value={form.timeframe}
                onChange={e => setForm({ ...form, timeframe: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                placeholder="e.g. Q2 2026, FY2026"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Revenue Target ($)</label>
              <input
                type="number"
                value={form.linkedRevenueTarget}
                onChange={e => setForm({ ...form, linkedRevenueTarget: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => { setShowAdd(false); setEditing(null) }}
                className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.goalText.trim() || !form.timeframe.trim()}
                className="text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete Goal" onClose={() => setDeleting(null)}>
          <p className="text-zinc-300 text-sm mb-4">Are you sure you want to delete this goal? This cannot be undone.</p>
          <p className="text-zinc-400 text-sm italic mb-5">&ldquo;{deleting.goalText}&rdquo;</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleting(null)} className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">Cancel</button>
            <button onClick={handleDelete} disabled={saving} className="text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
              {saving ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
