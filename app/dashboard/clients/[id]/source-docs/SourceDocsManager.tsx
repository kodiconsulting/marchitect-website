'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface SourceDoc {
  id: string
  docDate: string | null
  docType: string | null
  fileName: string
  fileLink: string | null
  notes: string | null
  keyThemes: string | null
}

interface Props {
  items: SourceDoc[]
  workspaceId: string
}

const INPUT = 'w-full bg-[#f9f9f9] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF] transition-colors'
const LABEL = 'block text-xs font-medium text-[#78829d] mb-1'

const DOC_TYPES = ['Interview', 'Transcript', 'Strategy Doc', 'Brief', 'Report', 'Research', 'Other']

const EMPTY_FORM = { fileName: '', docDate: '', docType: 'Other', fileLink: '', keyThemes: '', notes: '' }

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

export default function SourceDocsManager({ items: initial, workspaceId }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<SourceDoc | null>(null)
  const [deleting, setDeleting] = useState<SourceDoc | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  function openAdd() {
    setForm(EMPTY_FORM)
    setShowAdd(true)
  }

  function openEdit(item: SourceDoc) {
    setForm({
      fileName: item.fileName,
      docDate: item.docDate ?? '',
      docType: item.docType ?? 'Other',
      fileLink: item.fileLink ?? '',
      keyThemes: item.keyThemes ?? '',
      notes: item.notes ?? '',
    })
    setEditing(item)
  }

  async function handleSave() {
    if (!form.fileName.trim()) return
    setSaving(true)
    try {
      const body = {
        fileName: form.fileName.trim(),
        docDate: form.docDate.trim() || null,
        docType: form.docType || null,
        fileLink: form.fileLink.trim() || null,
        keyThemes: form.keyThemes.trim() || null,
        notes: form.notes.trim() || null,
      }
      if (editing) {
        const res = await fetch(`/api/workspaces/${workspaceId}/source-docs/${editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setItems(items.map(i => i.id === editing.id ? updated : i))
          setEditing(null)
          router.refresh()
        }
      } else {
        const res = await fetch(`/api/workspaces/${workspaceId}/source-docs`, {
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
      const res = await fetch(`/api/workspaces/${workspaceId}/source-docs/${deleting.id}`, { method: 'DELETE' })
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
          <h1 className="text-2xl font-bold text-[#252f4a]">Source Documents</h1>
          <p className="text-[#78829d] mt-1 text-sm">Store interviews, transcripts, strategy docs, and research.</p>
        </div>
        <button onClick={openAdd} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
          Add Document
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-[#e8e8e8] rounded-xl py-16 text-center">
          <p className="text-[#78829d] text-sm mb-3">No source documents yet.</p>
          <button onClick={openAdd} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Add Document
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e8e8e8]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">File Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Key Themes</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors">
                  <td className="px-5 py-3 font-medium text-[#252f4a]">
                    {item.fileLink ? (
                      <a href={item.fileLink} target="_blank" rel="noopener noreferrer" className="text-[#1B84FF] hover:underline">{item.fileName}</a>
                    ) : item.fileName}
                  </td>
                  <td className="px-4 py-3 text-[#4b5675]">{item.docType || '—'}</td>
                  <td className="px-4 py-3 text-[#4b5675] whitespace-nowrap">{formatDate(item.docDate)}</td>
                  <td className="px-4 py-3 text-[#4b5675] max-w-xs truncate">{item.keyThemes || '—'}</td>
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
        <Modal title={editing ? 'Edit Document' : 'Add Document'} onClose={() => { setShowAdd(false); setEditing(null) }}>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>File Name *</label>
              <input value={form.fileName} onChange={e => setForm({ ...form, fileName: e.target.value })} className={INPUT} placeholder="Document name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Doc Type</label>
                <select value={form.docType} onChange={e => setForm({ ...form, docType: e.target.value })} className={INPUT}>
                  {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Date</label>
                <input type="date" value={form.docDate} onChange={e => setForm({ ...form, docDate: e.target.value })} className={INPUT} />
              </div>
            </div>
            <div>
              <label className={LABEL}>File Link (URL)</label>
              <input value={form.fileLink} onChange={e => setForm({ ...form, fileLink: e.target.value })} className={INPUT} placeholder="https://..." type="url" />
            </div>
            <div>
              <label className={LABEL}>Key Themes</label>
              <textarea value={form.keyThemes} onChange={e => setForm({ ...form, keyThemes: e.target.value })} className={INPUT} rows={3} placeholder="Main topics or themes covered" />
            </div>
            <div>
              <label className={LABEL}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={INPUT} rows={2} placeholder="Additional notes" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => { setShowAdd(false); setEditing(null) }} className="text-sm border border-[#e8e8e8] text-[#4b5675] hover:bg-[#f1f1f4] px-3 py-1.5 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.fileName.trim()} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete Document" onClose={() => setDeleting(null)}>
          <p className="text-[#4b5675] text-sm mb-2">Delete <span className="text-[#252f4a] font-medium">{deleting.fileName}</span>?</p>
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
