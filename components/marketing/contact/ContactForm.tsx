'use client'

import { useState } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setState('error')
      return
    }
    setState('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, message }),
      })
      if (!res.ok) throw new Error('Request failed')
      setState('success')
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('[ContactForm]', err)
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-2xl border border-green-100 bg-green-50 p-8 text-center">
        <p className="text-base font-semibold text-green-800">Message sent.</p>
        <p className="mt-2 text-sm text-green-700">
          We&apos;ll get back to you within one business day.
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[var(--m-accent)] focus:ring-2 focus:ring-[var(--m-accent)]/20'

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {state === 'error' && (
        <p role="alert" className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          autoComplete="name"
          className={inputClass}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="company" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Company <span className="font-normal normal-case text-gray-400">(optional)</span>
        </label>
        <input
          id="company"
          type="text"
          autoComplete="organization"
          className={inputClass}
          placeholder="Company name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          className={`${inputClass} resize-none`}
          placeholder="Tell us what you're working on..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: 'var(--m-accent)' }}
      >
        {state === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
