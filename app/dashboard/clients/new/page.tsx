'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FormState {
  clientName: string
  engagementStartDate: string
  toggleB2b: boolean
  toggleB2c: boolean
  toggleLeadGen: boolean
  toggleEcom: boolean
}

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<FormState>({
    clientName: '',
    engagementStartDate: '',
    toggleB2b: false,
    toggleB2c: false,
    toggleLeadGen: false,
    toggleEcom: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.clientName,
          engagementStartDate: form.engagementStartDate || null,
          toggleB2b: form.toggleB2b,
          toggleB2c: form.toggleB2c,
          toggleLeadGen: form.toggleLeadGen,
          toggleEcom: form.toggleEcom,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to create client.')
        return
      }

      router.push('/dashboard/clients')
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const businessModelToggles: { name: keyof FormState; label: string }[] = [
    { name: 'toggleB2b', label: 'B2B' },
    { name: 'toggleB2c', label: 'B2C' },
    { name: 'toggleLeadGen', label: 'Lead-Gen' },
    { name: 'toggleEcom', label: 'Ecommerce' },
  ]

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/clients"
          className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors mb-4 inline-block"
        >
          ← Back to Clients
        </Link>
        <h1 className="text-2xl font-bold text-[#252f4a]">Add Client</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          Create a new client workspace.
        </p>
      </div>

      <Card className="bg-white border-[#e8e8e8]">
        <CardHeader>
          <CardTitle className="text-[#252f4a] text-base font-semibold">
            Client Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="clientName"
                className="block text-sm font-medium text-[#4b5675]"
              >
                Client Name <span className="text-red-400">*</span>
              </label>
              <input
                id="clientName"
                name="clientName"
                type="text"
                required
                value={form.clientName}
                onChange={handleChange}
                placeholder="Acme Corp"
                className="w-full rounded-lg border border-[#e8e8e8] bg-[#f1f1f4] px-3 py-2 text-sm text-[#252f4a] placeholder-[#78829d] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Engagement Start Date */}
            <div className="space-y-1.5">
              <label
                htmlFor="engagementStartDate"
                className="block text-sm font-medium text-[#4b5675]"
              >
                Engagement Start Date
              </label>
              <input
                id="engagementStartDate"
                name="engagementStartDate"
                type="date"
                value={form.engagementStartDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#e8e8e8] bg-[#f1f1f4] px-3 py-2 text-sm text-[#252f4a] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
              />
            </div>

            {/* Business Model Toggles */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#4b5675]">
                Business Model
              </p>
              <p className="text-xs text-[#78829d]">
                CORE is always enabled. Select additional models below.
              </p>
              <div className="space-y-2 pt-1">
                {/* CORE — always on, non-interactive */}
                <label className="flex items-center gap-3 cursor-not-allowed opacity-60">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="size-4 rounded border-[#e8e8e8] bg-[#f1f1f4] accent-[#1B84FF]"
                  />
                  <span className="text-sm text-[#4b5675]">CORE (always on)</span>
                </label>

                {businessModelToggles.map(({ name, label }) => (
                  <label
                    key={name}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      checked={form[name] as boolean}
                      onChange={handleChange}
                      className="size-4 rounded border-[#e8e8e8] bg-[#f1f1f4] accent-[#1B84FF]"
                    />
                    <span className="text-sm text-[#4b5675]">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[#1B84FF] px-5 text-sm font-medium text-white transition-colors hover:bg-[#1366cc] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating…' : 'Create Client'}
              </button>
              <Link
                href="/dashboard/clients"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-[#e8e8e8] px-5 text-sm font-medium text-[#4b5675] transition-colors hover:border-[#1B84FF] hover:text-[#252f4a]"
              >
                Cancel
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
