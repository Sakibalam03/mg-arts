'use client'

import { useState } from 'react'

interface FormState {
  name: string
  phone: string
  email: string
  message: string
}

export function InquiryForm({ source }: { source: string }) {
  const [form, setForm] = useState<FormState>({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function update(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-border rounded-lg p-8 text-center">
        <p className="font-semibold text-[16px] text-foreground mb-2">We got it — thank you!</p>
        <p className="text-muted-foreground text-[14px]">
          Our team will reach out within 1 business day.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Name" required>
        <input
          required
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          className="field-input"
        />
      </Field>

      <Field label="Phone" required>
        <input
          required
          type="tel"
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          className="field-input"
        />
      </Field>

      <Field label="Email">
        <input
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          className="field-input"
        />
      </Field>

      <Field label="Message">
        <textarea
          rows={4}
          placeholder="Describe your project — scope, city, approximate timeline..."
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          className="field-input resize-none"
        />
      </Field>

      {status === 'error' && (
        <p className="text-[13px] text-primary font-medium">
          Submission failed — please try again or call us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-primary text-primary-foreground font-semibold text-[14px] py-3 rounded-lg hover:bg-accent-hover transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </button>

      <p className="text-[12px] text-muted-foreground text-center">
        We respond within 1 business day.
      </p>
    </form>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-foreground">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
