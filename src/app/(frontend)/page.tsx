import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function HomePage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers })

  return (
    <div className="flex items-center justify-between p-6">
      <div>
        <span className="font-sans font-extrabold tracking-tight text-xl">MG Arts</span>
        <p className="text-sm text-muted-foreground mt-1">
          {user ? `Welcome back, ${user.email}` : 'Welcome to your new project.'}
        </p>
      </div>
      <ThemeToggle />
    </div>
  )
}
