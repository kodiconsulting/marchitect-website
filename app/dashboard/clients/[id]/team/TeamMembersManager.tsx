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
  category: string
}

interface Props {
  members: TeamMember[]
  workspaceId: string
}

const INPUT = 'w-full bg-[#f9f9f9] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF] transition-colors'
const LABEL = 'block text-xs font-medium text-[#78829d] mb-1'

const CATEGORY_OPTIONS = [
  { value: 'client', label: 'Client Team' },
  { value: 'marchitect', label: 'Marchitect Team' },
  { value: 'vendor', label: 'Vendor/Contractor' },
]

const CATEGORY_GROUPS: { value: string; label: string }[] = [
  { value: 'client', label: 'Client Team' },
  { value: 'marchitect', label: 'Marchitect Team' },
  { value: 'vendor', label: 'Vendors & Contractors' },
]

const EMPTY_FORM = { name: '', title: '', email: '', phone: '', reportsTo: '', category: 'client' }

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
      category: m.category ?? 'client',
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
        title: form.title.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        reportsTo: form.reportsTo || null,
        category: form.category,
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

  const hasAnyMembers = members.length > 0

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#252f4a]">Team</h1>
          <p className="text-[#78829d] mt-1 text-sm">Manage client team members and reporting structure.</p>
        </div>
        <button
          onClick={openAdd}
          className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Add Member
        </button>
      </div>

      {!hasAnyMembers ? (
        <div className="bg-white border border-[#e8e8e8] rounded-xl py-16 text-center">
          <p className="text-[#78829d] text-sm mb-3">No team members yet. Add the first one.</p>
          <button onClick={openAdd} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Add Member
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORY_GROUPS.map(group => {
            const groupMembers = members.filter(m => (m.category ?? 'client') === group.value)
            if (groupMembers.length === 0) return null
            return (
              <div key={group.value}>
                <h2 className="text-sm font-semibold text-[#78829d] uppercase tracking-wider mb-2">{group.label}</h2>
                <div className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#e8e8e8]">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Name</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Title</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Email</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Phone</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Reports To</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupMembers.map(m => (
                        <tr key={m.id} className="border-t border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors">
                          <td className="px-5 py-3 font-medium text-[#252f4a]">{m.name}</td>
                          <td className="px-4 py-3 text-[#4b5675]">{m.title ?? '—'}</td>
                          <td className="px-4 py-3 text-[#4b5675]">{m.email ?? '—'}</td>
                          <td className="px-4 py-3 text-[#4b5675]">{m.phone ?? '—'}</td>
                          <td className="px-4 py-3 text-[#4b5675]">{reportsToName(m.reportsTo)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 justify-end">
                              <button onClick={() => openEdit(m)} className="text-xs text-[#78829d] hover:text-[#252f4a] transition-colors">Edit</button>
                              <button onClick={() => setDeleting(m)} className="text-xs text-[#f8285a] hover:text-red-600 transition-colors">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {(showAdd || editing) && (
        <Modal title={editing ? 'Edit Team Member' : 'Add Team Member'} onClose={() => { setShowAdd(false); setEditing(null) }}>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Name *</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={INPUT}
                placeholder="Full name"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className={INPUT}
                  placeholder="e.g. VP of Marketing"
                />
              </div>
              <div>
                <label className={LABEL}>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className={INPUT}
                >
                  {CATEGORY_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={INPUT}
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <label className={LABEL}>Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className={INPUT}
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>
            <div>
              <label className={LABEL}>Reports To</label>
              <select
                value={form.reportsTo}
                onChange={e => setForm({ ...form, reportsTo: e.target.value })}
                className={INPUT}
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
                className="text-sm border border-[#e8e8e8] text-[#4b5675] hover:bg-[#f1f1f4] px-3 py-1.5 rounded-lg transition-colors"
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
        <Modal title="Remove Team Member" onClose={() => setDeleting(null)}>
          <p className="text-[#4b5675] text-sm mb-2">Remove <span className="text-[#252f4a] font-medium">{deleting.name}</span> from this team?</p>
          <p className="text-[#78829d] text-xs mb-5">This will not affect existing rocks, KPIs, or matrix assignments that reference their name.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleting(null)} className="text-sm border border-[#e8e8e8] text-[#4b5675] hover:bg-[#f1f1f4] px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={saving} className="text-sm bg-[#f8285a] hover:bg-red-600 disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
              {saving ? 'Removing…' : 'Remove'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
