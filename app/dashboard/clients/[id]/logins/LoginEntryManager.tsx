'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LoginEntry {
  id: string
  toolName: string
  category: string
  loginUrl: string | null
  username: string | null
  owner: string | null
  monthlyCost: string | null
  notes: string | null
}

const CATEGORIES = [
  'Hosting',
  'CRM',
  'Email Marketing',
  'Ad Platform',
  'Analytics',
  'Social Media',
  'CMS/Website',
  'Design Tools',
  'Other',
]

const INPUT = 'w-full bg-[#f9f9f9] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF] transition-colors'
const LABEL = 'block text-xs font-medium text-[#78829d] mb-1'

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white border border-[#e8e8e8] rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#252f4a] font-semibold text-base">{title}</h2>
          <button onClick={onClose} className="text-[#78829d] hover:text-[#252f4a] transition-colors text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

type FormState = {
  toolName: string
  category: string
  loginUrl: string
  username: string
  owner: string
  monthlyCost: string
  notes: string
}

const EMPTY_FORM: FormState = {
  toolName: '',
  category: CATEGORIES[0],
  loginUrl: '',
  username: '',
  owner: '',
  monthlyCost: '',
  notes: '',
}

interface TeamMember { id: string; name: string; title: string | null }

export default function LoginEntryManager({
  entries: initial,
  workspaceId,
  teamMembers = [],
}: {
  entries: LoginEntry[]
  workspaceId: string
  teamMembers?: TeamMember[]
}) {
  const router = useRouter()
  const [entries, setEntries] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<LoginEntry | null>(null)
  const [deleting, setDeleting] = useState<LoginEntry | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const visible = activeCategory ? entries.filter(e => e.category === activeCategory) : entries

  function openAdd() {
    setForm(EMPTY_FORM)
    setShowAdd(true)
  }

  function openEdit(entry: LoginEntry) {
    setForm({
      toolName: entry.toolName,
      category: entry.category,
      loginUrl: entry.loginUrl ?? '',
      username: entry.username ?? '',
      owner: entry.owner ?? '',
      monthlyCost: entry.monthlyCost ?? '',
      notes: entry.notes ?? '',
    })
    setEditing(entry)
  }

  function field(key: keyof FormState) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [key]: e.target.value })),
    }
  }

  async function handleSave() {
    if (!form.toolName.trim() || !form.category) return
    setSaving(true)

    const payload = {
      toolName: form.toolName.trim(),
      category: form.category,
      loginUrl: form.loginUrl.trim() || undefined,
      username: form.username.trim() || undefined,
      owner: form.owner.trim() || undefined,
      monthlyCost: form.monthlyCost ? parseFloat(form.monthlyCost) : undefined,
      notes: form.notes.trim() || undefined,
    }

    if (editing) {
      await fetch(`/api/workspaces/${workspaceId}/logins/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setEditing(null)
    } else {
      const res = await fetch(`/api/workspaces/${workspaceId}/logins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const created: LoginEntry = await res.json()
        setEntries(prev => [...prev, created])
      }
      setShowAdd(false)
    }

    setSaving(false)
    router.refresh()
  }

  async function handleDelete() {
    if (!deleting) return
    setSaving(true)
    await fetch(`/api/workspaces/${workspaceId}/logins/${deleting.id}`, { method: 'DELETE' })
    setEntries(prev => prev.filter(e => e.id !== deleting.id))
    setDeleting(null)
    setSaving(false)
    router.refresh()
  }

  const EntryForm = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Tool Name *</label>
          <input className={INPUT} placeholder="e.g. HubSpot" {...field('toolName')} />
        </div>
        <div>
          <label className={LABEL}>Category *</label>
          <select className={INPUT} {...field('category')}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={LABEL}>Login URL</label>
        <input className={INPUT} placeholder="https://app.example.com/login" type="url" {...field('loginUrl')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Username / Email</label>
          <input className={INPUT} placeholder="hello@company.com" {...field('username')} />
        </div>
        <div>
          <label className={LABEL}>Owner</label>
          {teamMembers.length > 0 ? (
            <select className={INPUT} value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}>
              <option value="">— Unassigned —</option>
              {teamMembers.map(m => (
                <option key={m.id} value={m.name}>{m.name}{m.title ? ` — ${m.title}` : ''}</option>
              ))}
            </select>
          ) : (
            <input className={INPUT} placeholder="e.g. Jane Smith" {...field('owner')} />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Monthly Cost ($)</label>
          <input className={INPUT} type="number" step="0.01" min="0" placeholder="0.00" {...field('monthlyCost')} />
        </div>
        <div>
          <label className={LABEL}>Notes</label>
          <input className={INPUT} placeholder="Optional notes" {...field('notes')} />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={() => { setShowAdd(false); setEditing(null) }}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-[#e8e8e8] px-4 text-sm font-medium text-[#4b5675] hover:bg-[#f1f1f4] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !form.toolName.trim()}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-[#1B84FF] px-4 text-sm font-medium text-white hover:bg-[#1366cc] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Entry'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium transition-colors ${
              activeCategory === null
                ? 'bg-[#1B84FF] text-white'
                : 'border border-[#e8e8e8] text-[#78829d] hover:border-[#1B84FF] hover:text-[#252f4a]'
            }`}
          >
            All ({entries.length})
          </button>
          {CATEGORIES.filter(c => entries.some(e => e.category === c)).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#1B84FF] text-white'
                  : 'border border-[#e8e8e8] text-[#78829d] hover:border-[#1B84FF] hover:text-[#252f4a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-[#1B84FF] px-4 text-sm font-medium text-white hover:bg-[#1366cc] transition-colors shrink-0 ml-4"
        >
          <Plus className="size-4" />
          Add Entry
        </button>
      </div>

      {/* Table or empty state */}
      {visible.length === 0 ? (
        <Card className="bg-white border-[#e8e8e8]">
          <CardContent className="py-16 text-center">
            <p className="text-[#252f4a] font-semibold text-sm mb-2">No entries yet</p>
            <p className="text-[#78829d] text-sm max-w-sm mx-auto mb-4">
              {activeCategory ? `No ${activeCategory} tools added yet.` : 'Add tools, platforms, and credentials to keep access organized.'}
            </p>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-[#1B84FF] px-4 text-sm font-medium text-white hover:bg-[#1366cc] transition-colors"
            >
              <Plus className="size-4" />
              Add Entry
            </button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border-[#e8e8e8]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#252f4a]">
              {visible.length} {visible.length === 1 ? 'entry' : 'entries'}
              {activeCategory && ` · ${activeCategory}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-[#e8e8e8]">
                    <th className="text-left px-6 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">Tool</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">URL</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">Username</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">Owner</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider">Cost/mo</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-[#78829d] uppercase tracking-wider w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map(entry => (
                    <tr key={entry.id} className="border-t border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[#252f4a] font-medium">{entry.toolName}</span>
                          {entry.notes && (
                            <Badge className="bg-[#f1f1f4] text-[#78829d] border-0 text-xs">{entry.notes}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#78829d]">{entry.category}</td>
                      <td className="px-4 py-3">
                        {entry.loginUrl ? (
                          <a
                            href={entry.loginUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#1B84FF] hover:underline text-xs truncate max-w-[160px]"
                          >
                            <ExternalLink className="size-3 shrink-0" />
                            {new URL(entry.loginUrl).hostname}
                          </a>
                        ) : (
                          <span className="text-[#78829d]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#78829d]">{entry.username ?? '—'}</td>
                      <td className="px-4 py-3 text-[#78829d]">{entry.owner ?? '—'}</td>
                      <td className="px-4 py-3 text-[#78829d]">
                        {entry.monthlyCost != null ? `$${Number(entry.monthlyCost).toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(entry)}
                            className="size-7 flex items-center justify-center rounded text-[#78829d] hover:bg-[#f1f1f4] hover:text-[#252f4a] transition-colors"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleting(entry)}
                            className="size-7 flex items-center justify-center rounded text-[#78829d] hover:bg-red-50 hover:text-[#f8285a] transition-colors"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add modal */}
      {showAdd && (
        <Modal title="Add Login Entry" onClose={() => setShowAdd(false)}>
          {EntryForm}
        </Modal>
      )}

      {/* Edit modal */}
      {editing && (
        <Modal title="Edit Login Entry" onClose={() => setEditing(null)}>
          {EntryForm}
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleting && (
        <Modal title="Delete Entry" onClose={() => setDeleting(null)}>
          <p className="text-[#4b5675] text-sm mb-5">
            Remove <span className="font-semibold text-[#252f4a]">{deleting.toolName}</span> from the login directory?
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleting(null)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-[#e8e8e8] px-4 text-sm font-medium text-[#4b5675] hover:bg-[#f1f1f4] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-[#f8285a] px-4 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
