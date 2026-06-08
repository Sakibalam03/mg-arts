'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewBriefPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function update(k: keyof typeof form, v: string) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'pmc' }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="p-8">
        <h1 className="font-serif text-2xl font-semibold text-[var(--text)] mb-2">Brief Submitted</h1>
        <p className="text-sm text-[var(--text-muted)]">
          We&apos;ll review your brief and be in touch soon. Redirecting…
        </p>
      </div>
    )
  }

  const inputCls =
    'w-full border border-[var(--border)] rounded-md px-3 py-2 text-sm bg-[var(--bg)] text-[var(--text)] mt-1.5 focus:outline-none focus:border-[var(--accent)]'

  return (
    <div className="p-8 max-w-lg">
      <h1 className="font-serif text-2xl font-semibold text-[var(--text)] mb-1">Submit PMC Brief</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">
        Describe your project and we&apos;ll get back to you within 1 business day.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-[13px] text-[var(--text-muted)]">Name *</label>
          <input
            required
            className={inputCls}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        <div>
          <label className="text-[13px] text-[var(--text-muted)]">Phone *</label>
          <input
            required
            type="tel"
            className={inputCls}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
        <div>
          <label className="text-[13px] text-[var(--text-muted)]">Email</label>
          <input
            type="email"
            className={inputCls}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div>
          <label className="text-[13px] text-[var(--text-muted)]">Project Brief *</label>
          <textarea
            required
            rows={5}
            className={`${inputCls} resize-y`}
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder="Describe scope, city, timeline, type of work…"
          />
        </div>
        {status === 'error' && (
          <p className="text-[13px] text-[var(--accent)]">Submission failed — please try again.</p>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[var(--accent)] text-white border-none rounded-md py-2.5 font-semibold text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Submitting…' : 'Submit Brief'}
        </button>
      </form>
    </div>
  )
}
