'use client'

import { useState } from 'react'

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const [auditStatus, setAuditStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [auditMessage, setAuditMessage] = useState('')

  async function handleSeed() {
    setStatus('loading')
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      setMessage(data.message)
      setStatus('done')
    } catch {
      setMessage('Something went wrong.')
      setStatus('error')
    }
  }

  async function handleSeedAudit() {
    setAuditStatus('loading')
    try {
      const res = await fetch('/api/seed-audit', { method: 'POST' })
      const data = await res.json()
      setAuditMessage(data.message)
      setAuditStatus(data.success ? 'done' : 'error')
    } catch {
      setAuditMessage('Something went wrong.')
      setAuditStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <h1 className="text-white text-2xl font-bold">Marchitect Setup</h1>
        <p className="text-zinc-400 text-sm text-center">
          Click the button below to create the admin account.
        </p>

        {status === 'done' && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg px-4 py-3 text-sm w-full text-center">
            {message}
            <div className="mt-3">
              <a href="/login" className="text-blue-400 underline">Go to login →</a>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm w-full text-center">
            {message}
          </div>
        )}

        {status !== 'done' && (
          <button
            onClick={handleSeed}
            disabled={status === 'loading'}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {status === 'loading' ? 'Setting up…' : 'Create Admin Account'}
          </button>
        )}

        {status === 'done' && (
          <div className="text-zinc-500 text-xs text-center">
            Login: admin@marchitect.com / marchitect2026
          </div>
        )}

        <div className="w-full border-t border-zinc-800 pt-4 flex flex-col gap-3">
          <p className="text-zinc-400 text-sm text-center">
            Seed the audit item library (12 pillars, 156 items).
          </p>

          {auditStatus === 'done' && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg px-4 py-3 text-sm w-full text-center">
              {auditMessage}
            </div>
          )}

          {auditStatus === 'error' && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm w-full text-center">
              {auditMessage}
            </div>
          )}

          <button
            onClick={handleSeedAudit}
            disabled={auditStatus === 'loading' || auditStatus === 'done'}
            className="w-full bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {auditStatus === 'loading'
              ? 'Seeding…'
              : auditStatus === 'done'
              ? 'Audit Items Seeded'
              : 'Seed Audit Items'}
          </button>
        </div>
      </div>
    </div>
  )
}
