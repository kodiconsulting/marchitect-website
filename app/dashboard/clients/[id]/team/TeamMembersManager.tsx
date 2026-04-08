'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface TeamMember {
  id: string
  name: string
  title: string | null
  email: string | null
  phone: string | null
  reportsTo: string | null
}

interface Props {
  members: TeamMember[]
  workspaceId: string
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-base">{title}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

const EMPTY_FORM = { name: '', title: '', email: '', phone: '', reportsTo: '' }

export default function TeamMembersManager({ members: initial, workspaceId }: Props) {
  const router = useRouter()
  const [members, setMembers] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [deleting, setDeleting] = useState<TeamMember | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  function openAdd() {
    setForm(EMPTY_FORM)
    setShowAdd(true)
  }

  function openEdit(m: TeamMember) {
    setForm({
      name: m.name,
      title: m.title ?? '',
      email: m.email ?? '',
      phone: m.phone ?? '',
      reportsTo: m.reportsTo ?? '',
    })
    setEditing(m)
  }

  // For "Reports To" dropdown, exclude self when editing
  const reportsToOptions = editing
    ? members.filter(m => m.id !== editing.id)
    : members

  function reportsToName(id: string | null) {
    if (!id) return '—'
    return members.find(m => m.id === id)?.name ?? '—'
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const body = {
        name: form.name.trim(),
        title: form.title.trim() || undefined,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        reportsTo: form.reportsTo || null,
      }
      if (editing) {
        const res = await fetch(`/api/workspaces/${workspaceId}/team/${editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setMembers(members.map(m => m.id === editing.id ? updated : m))
          setEditing(null)
          router.refresh()
        }
      } else {
        const res = await fetch(`/api/workspaces/${workspaceId}/team`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const created = await res.json()
          setMembers([...members, created])
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
      const res = await fetch(`/api/workspaces/${workspaceId}/team/${deleting.id}`, { method: 'DELETE' })
      if (res.ok) {
        setMembers(members.filter(m => m.id !== deleting.id))
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
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-zinc-400 mt-1 text-sm">Manage client team members and reporting structure.</p>
        </div>
        <button
          onClick={openAdd}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Add Member
        </button>
      </div>

      {members.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl py-16 text-center">
          <p className="text-zinc-500 text-sm">No team members yet. Add the first one.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Reports To</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} className="border-t border-zinc-800 hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{m.title ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-400">{m.email ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-400">{m.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-400">{reportsToName(m.reportsTo)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <button onClick={() => openEdit(m)} className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">Edit</button>
                      <button onClick={() => setDeleting(m)} className="text-xs text-red-500 hover:text-red-400 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showAdd || editing) && (
        <Modal title={editing ? 'Edit Team Member' : 'Add Team Member'} onClose={() => { setShowAdd(false); setEditing(null) }}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Name *</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Title</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                placeholder="e.g. VP of Marketing"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Reports To</label>
              <select
                value={form.reportsTo}
                onChange={e => setForm({ ...form, reportsTo: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
              >
                <option value="">— None —</option>
                {reportsToOptions.map(m => (
                  <option key={m.id} value={m.id}>{m.name}{m.title ? ` (${m.title})` : ''}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => { setShowAdd(false); setEditing(null) }}
                className="text-sm text-zinc-400 hover:text-white px-3 py-1.5"
              >Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                className="text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleting && (
        <Modal title="Remove Team Member" onClose={() => setDeleting(null)}>
          <p className="text-zinc-300 text-sm mb-2">Remove <span className="text-white font-medium">{deleting.name}</span> from this team?</p>
          <p className="text-zinc-500 text-xs mb-5">This will not affect existing rocks, KPIs, or matrix assignments that reference their name.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleting(null)} className="text-sm text-zinc-400 hover:text-white px-3 py-1.5">Cancel</button>
            <button onClick={handleDelete} disabled={saving} className="text-sm bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
              {saving ? 'Removing…' : 'Remove'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
