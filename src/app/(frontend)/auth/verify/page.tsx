'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function VerifyForm() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') ?? ''
  const next = params.get('next') ?? '/dashboard'

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await authClient.signIn.emailOtp({ email, otp })
    setLoading(false)
    if (error) {
      setError(error.message ?? 'Invalid code, please try again')
      return
    }
    router.push(next)
  }

  async function handleResend() {
    setCooldown(30)
    await authClient.emailOtp.sendVerificationOtp({ email, type: 'sign-in' })
  }

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3')

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-sm space-y-6 p-8 border border-[var(--border)] rounded-lg">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl font-semibold text-[var(--text)]">Check your email</h1>
          <p className="text-sm text-[var(--text-muted)]">
            We sent a 6-digit code to <span className="font-medium text-[var(--text)]">{maskedEmail}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="text-center text-2xl tracking-widest"
            autoComplete="one-time-code"
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading || otp.length < 6}>
            {loading ? 'Verifying…' : 'Verify'}
          </Button>
        </form>

        <div className="text-center">
          {cooldown > 0 ? (
            <p className="text-sm text-[var(--text-muted)]">Resend code in {cooldown}s</p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-[var(--text-muted)] underline underline-offset-2 hover:text-[var(--text)]"
            >
              Resend code
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  )
}
