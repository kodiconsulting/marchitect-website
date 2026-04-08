'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface AdSpend {
  id: string
  channel: string
  weeklyAvg: string | null
  monthlyBudget: string | null
  notes: string | null
}

export interface Expense {
  id: string
  purpose: string
  vendor: string | null
  costPerMonth: string | null
  notes: string | null
}

interface Props {
  adSpend: AdSpend[]
  expenses: Expense[]
  workspaceId: string
}

const INPUT = 'w-full bg-[#f9f9f9] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] outline-none focus:border-[#1B84FF] transition-colors'
const LABEL = 'block text-xs font-medium text-[#78829d] mb-1'

const EMPTY_AD_SPEND = { channel: '', weeklyAvg: '', monthlyBudget: '', notes: '' }
const EMPTY_EXPENSE = { purpose: '', vendor: '', costPerMonth: '', notes: '' }

type AdSpendModal = { type: 'add' } | { type: 'edit'; item: AdSpend } | { type: 'delete'; item: AdSpend }
type ExpenseModal = { type: 'add' } | { type: 'edit'; item: Expense } | { type: 'delete'; item: Expense }

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

function sumField(items: { [k: string]: string | null }[], field: string): string {
  const total = items.reduce((acc, item) => {
    const v = parseFloat((item[field] as string | null) ?? '')
    return acc + (isNaN(v) ? 0 : v)
  }, 0)
  return total > 0 ? total.toFixed(2) : '0.00'
}

export default function BudgetsManager({ adSpend: initialAdSpend, expenses: initialExpenses, workspaceId }: Props) {
  const router = useRouter()
  const [adSpendItems, setAdSpendItems] = useState(initialAdSpend)
  const [expenseItems, setExpenseItems] = useState(initialExpenses)
  const [adSpendModal, setAdSpendModal] = useState<AdSpendModal | null>(null)
  const [expenseModal, setExpenseModal] = useState<ExpenseModal | null>(null)
  const [saving, setSaving] = useState(false)
  const [adSpendForm, setAdSpendForm] = useState(EMPTY_AD_SPEND)
  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE)

  // Ad Spend handlers
  function openAddAdSpend() {
    setAdSpendForm(EMPTY_AD_SPEND)
    setAdSpendModal({ type: 'add' })
  }
  function openEditAdSpend(item: AdSpend) {
    setAdSpendForm({ channel: item.channel, weeklyAvg: item.weeklyAvg ?? '', monthlyBudget: item.monthlyBudget ?? '', notes: item.notes ?? '' })
    setAdSpendModal({ type: 'edit', item })
  }

  async function handleSaveAdSpend() {
    if (!adSpendForm.channel.trim()) return
    setSaving(true)
    try {
      const body = {
        channel: adSpendForm.channel.trim(),
        weeklyAvg: adSpendForm.weeklyAvg.trim() || null,
        monthlyBudget: adSpendForm.monthlyBudget.trim() || null,
        notes: adSpendForm.notes.trim() || null,
      }
      if (adSpendModal?.type === 'edit') {
        const res = await fetch(`/api/workspaces/${workspaceId}/budgets/ad-spend/${adSpendModal.item.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setAdSpendItems(adSpendItems.map(i => i.id === adSpendModal.item.id ? updated : i))
          setAdSpendModal(null)
          router.refresh()
        }
      } else {
        const res = await fetch(`/api/workspaces/${workspaceId}/budgets/ad-spend`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const created = await res.json()
          setAdSpendItems([...adSpendItems, created])
          setAdSpendModal(null)
          router.refresh()
        }
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAdSpend() {
    if (adSpendModal?.type !== 'delete') return
    setSaving(true)
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/budgets/ad-spend/${adSpendModal.item.id}`, { method: 'DELETE' })
      if (res.ok) {
        setAdSpendItems(adSpendItems.filter(i => i.id !== adSpendModal.item.id))
        setAdSpendModal(null)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  // Expense handlers
  function openAddExpense() {
    setExpenseForm(EMPTY_EXPENSE)
    setExpenseModal({ type: 'add' })
  }
  function openEditExpense(item: Expense) {
    setExpenseForm({ purpose: item.purpose, vendor: item.vendor ?? '', costPerMonth: item.costPerMonth ?? '', notes: item.notes ?? '' })
    setExpenseModal({ type: 'edit', item })
  }

  async function handleSaveExpense() {
    if (!expenseForm.purpose.trim()) return
    setSaving(true)
    try {
      const body = {
        purpose: expenseForm.purpose.trim(),
        vendor: expenseForm.vendor.trim() || null,
        costPerMonth: expenseForm.costPerMonth.trim() || null,
        notes: expenseForm.notes.trim() || null,
      }
      if (expenseModal?.type === 'edit') {
        const res = await fetch(`/api/workspaces/${workspaceId}/budgets/expenses/${expenseModal.item.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setExpenseItems(expenseItems.map(i => i.id === expenseModal.item.id ? updated : i))
          setExpenseModal(null)
          router.refresh()
        }
      } else {
        const res = await fetch(`/api/workspaces/${workspaceId}/budgets/expenses`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        })
        if (res.ok) {
          const created = await res.json()
          setExpenseItems([...expenseItems, created])
          setExpenseModal(null)
          router.refresh()
        }
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteExpense() {
    if (expenseModal?.type !== 'delete') return
    setSaving(true)
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/budgets/expenses/${expenseModal.item.id}`, { method: 'DELETE' })
      if (res.ok) {
        setExpenseItems(expenseItems.filter(i => i.id !== expenseModal.item.id))
        setExpenseModal(null)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  const totalWeeklyAvg = sumField(adSpendItems as never[], 'weeklyAvg')
  const totalMonthlyBudget = sumField(adSpendItems as never[], 'monthlyBudget')
  const totalCostPerMonth = sumField(expenseItems as never[], 'costPerMonth')

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#252f4a]">Budgets</h1>
        <p className="text-[#78829d] mt-1 text-sm">Track ad spend allocations and recurring expenses.</p>
      </div>

      {/* Ad Spend Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#78829d] uppercase tracking-wider">Ad Spend</h2>
          <button onClick={openAddAdSpend} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Add Channel
          </button>
        </div>

        {adSpendItems.length === 0 ? (
          <div className="bg-white border border-[#e8e8e8] rounded-xl py-12 text-center">
            <p className="text-[#78829d] text-sm mb-3">No ad spend entries yet.</p>
            <button onClick={openAddAdSpend} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
              Add Channel
            </button>
          </div>
        ) : (
          <div className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8e8e8]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Channel</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Weekly Avg</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Monthly Budget</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Notes</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {adSpendItems.map(item => (
                  <tr key={item.id} className="border-t border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-5 py-3 font-medium text-[#252f4a]">{item.channel}</td>
                    <td className="px-4 py-3 text-[#4b5675]">{item.weeklyAvg ? `$${item.weeklyAvg}` : '—'}</td>
                    <td className="px-4 py-3 text-[#4b5675]">{item.monthlyBudget ? `$${item.monthlyBudget}` : '—'}</td>
                    <td className="px-4 py-3 text-[#4b5675] max-w-xs truncate">{item.notes || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 justify-end">
                        <button onClick={() => openEditAdSpend(item)} className="text-xs text-[#78829d] hover:text-[#252f4a] transition-colors">Edit</button>
                        <button onClick={() => setAdSpendModal({ type: 'delete', item })} className="text-xs text-[#f8285a] hover:text-red-600 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#e8e8e8] bg-[#f9f9f9]">
                  <td className="px-5 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Totals</td>
                  <td className="px-4 py-3 font-semibold text-[#252f4a]">${totalWeeklyAvg}</td>
                  <td className="px-4 py-3 font-semibold text-[#252f4a]">${totalMonthlyBudget}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Expenses Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#78829d] uppercase tracking-wider">Expenses</h2>
          <button onClick={openAddExpense} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Add Expense
          </button>
        </div>

        {expenseItems.length === 0 ? (
          <div className="bg-white border border-[#e8e8e8] rounded-xl py-12 text-center">
            <p className="text-[#78829d] text-sm mb-3">No expenses yet.</p>
            <button onClick={openAddExpense} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] text-white font-medium px-4 py-2 rounded-lg transition-colors">
              Add Expense
            </button>
          </div>
        ) : (
          <div className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8e8e8]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Purpose</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Vendor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Cost / Month</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Notes</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {expenseItems.map(item => (
                  <tr key={item.id} className="border-t border-[#e8e8e8] hover:bg-[#f9f9f9] transition-colors">
                    <td className="px-5 py-3 font-medium text-[#252f4a]">{item.purpose}</td>
                    <td className="px-4 py-3 text-[#4b5675]">{item.vendor || '—'}</td>
                    <td className="px-4 py-3 text-[#4b5675]">{item.costPerMonth ? `$${item.costPerMonth}` : '—'}</td>
                    <td className="px-4 py-3 text-[#4b5675] max-w-xs truncate">{item.notes || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 justify-end">
                        <button onClick={() => openEditExpense(item)} className="text-xs text-[#78829d] hover:text-[#252f4a] transition-colors">Edit</button>
                        <button onClick={() => setExpenseModal({ type: 'delete', item })} className="text-xs text-[#f8285a] hover:text-red-600 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#e8e8e8] bg-[#f9f9f9]">
                  <td className="px-5 py-3 text-xs font-semibold text-[#78829d] uppercase tracking-wider">Total</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 font-semibold text-[#252f4a]">${totalCostPerMonth}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Ad Spend Add/Edit Modal */}
      {(adSpendModal?.type === 'add' || adSpendModal?.type === 'edit') && (
        <Modal title={adSpendModal.type === 'edit' ? 'Edit Ad Spend' : 'Add Ad Spend'} onClose={() => setAdSpendModal(null)}>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Channel *</label>
              <input value={adSpendForm.channel} onChange={e => setAdSpendForm({ ...adSpendForm, channel: e.target.value })} className={INPUT} placeholder="e.g. Facebook Ads, Google Search" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Weekly Avg ($)</label>
                <input value={adSpendForm.weeklyAvg} onChange={e => setAdSpendForm({ ...adSpendForm, weeklyAvg: e.target.value })} className={INPUT} placeholder="0.00" />
              </div>
              <div>
                <label className={LABEL}>Monthly Budget ($)</label>
                <input value={adSpendForm.monthlyBudget} onChange={e => setAdSpendForm({ ...adSpendForm, monthlyBudget: e.target.value })} className={INPUT} placeholder="0.00" />
              </div>
            </div>
            <div>
              <label className={LABEL}>Notes</label>
              <textarea value={adSpendForm.notes} onChange={e => setAdSpendForm({ ...adSpendForm, notes: e.target.value })} className={INPUT} rows={3} placeholder="Additional notes" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setAdSpendModal(null)} className="text-sm border border-[#e8e8e8] text-[#4b5675] hover:bg-[#f1f1f4] px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSaveAdSpend} disabled={saving || !adSpendForm.channel.trim()} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Ad Spend Delete Modal */}
      {adSpendModal?.type === 'delete' && (
        <Modal title="Delete Ad Spend" onClose={() => setAdSpendModal(null)}>
          <p className="text-[#4b5675] text-sm mb-2">Delete <span className="text-[#252f4a] font-medium">{adSpendModal.item.channel}</span>?</p>
          <p className="text-[#78829d] text-xs mb-5">This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setAdSpendModal(null)} className="text-sm border border-[#e8e8e8] text-[#4b5675] hover:bg-[#f1f1f4] px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleDeleteAdSpend} disabled={saving} className="text-sm bg-[#f8285a] hover:bg-red-600 disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
              {saving ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}

      {/* Expense Add/Edit Modal */}
      {(expenseModal?.type === 'add' || expenseModal?.type === 'edit') && (
        <Modal title={expenseModal.type === 'edit' ? 'Edit Expense' : 'Add Expense'} onClose={() => setExpenseModal(null)}>
          <div className="space-y-3">
            <div>
              <label className={LABEL}>Purpose *</label>
              <input value={expenseForm.purpose} onChange={e => setExpenseForm({ ...expenseForm, purpose: e.target.value })} className={INPUT} placeholder="e.g. CRM Software, Copywriting" />
            </div>
            <div>
              <label className={LABEL}>Vendor</label>
              <input value={expenseForm.vendor} onChange={e => setExpenseForm({ ...expenseForm, vendor: e.target.value })} className={INPUT} placeholder="Vendor or service name" />
            </div>
            <div>
              <label className={LABEL}>Cost Per Month ($)</label>
              <input value={expenseForm.costPerMonth} onChange={e => setExpenseForm({ ...expenseForm, costPerMonth: e.target.value })} className={INPUT} placeholder="0.00" />
            </div>
            <div>
              <label className={LABEL}>Notes</label>
              <textarea value={expenseForm.notes} onChange={e => setExpenseForm({ ...expenseForm, notes: e.target.value })} className={INPUT} rows={3} placeholder="Additional notes" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setExpenseModal(null)} className="text-sm border border-[#e8e8e8] text-[#4b5675] hover:bg-[#f1f1f4] px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSaveExpense} disabled={saving || !expenseForm.purpose.trim()} className="text-sm bg-[#1B84FF] hover:bg-[#1366cc] disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Expense Delete Modal */}
      {expenseModal?.type === 'delete' && (
        <Modal title="Delete Expense" onClose={() => setExpenseModal(null)}>
          <p className="text-[#4b5675] text-sm mb-2">Delete <span className="text-[#252f4a] font-medium">{expenseModal.item.purpose}</span>?</p>
          <p className="text-[#78829d] text-xs mb-5">This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setExpenseModal(null)} className="text-sm border border-[#e8e8e8] text-[#4b5675] hover:bg-[#f1f1f4] px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleDeleteExpense} disabled={saving} className="text-sm bg-[#f8285a] hover:bg-red-600 disabled:opacity-50 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
              {saving ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
