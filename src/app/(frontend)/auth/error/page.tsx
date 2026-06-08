'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const MESSAGES: Record<string, string> = {
  expired: 'Your code has expired. Please request a new one.',
  invalid: 'That code was invalid. Please try again.',
  unknown: 'Something went wrong. Please try again.',
}

function ErrorContent() {
  const params = useSearchParams()
  const reason = params.get('reason') ?? 'unknown'
  const message = MESSAGES[reason] ?? MESSAGES.unknown

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-sm space-y-6 p-8 border border-[var(--border)] rounded-lg text-center">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl font-semibold text-[var(--text)]">Sign in failed</h1>
          <p className="text-sm text-[var(--text-muted)]">{message}</p>
        </div>
        <Button asChild className="w-full">
          <Link href="/auth">Try again</Link>
        </Button>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  )
}
