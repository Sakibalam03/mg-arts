import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, message, source } = body as {
      name?: string
      phone?: string
      email?: string
      message?: string
      source?: string
    }

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 })
    }

    const session = await auth.api.getSession({ headers: await headers() })

    const payload = await getPayload({ config })

    const inquiry = await payload.create({
      collection: 'inquiries',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        name,
        phone,
        email: email ?? null,
        message: message ?? null,
        source: source ?? 'contact',
        ...(session ? { user: Number(session.user.id) } : {}),
      } as any,
    })

    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 })
  } catch (err) {
    console.error('[inquiries] POST error:', err)
    return NextResponse.json({ error: 'Failed to submit inquiry.' }, { status: 500 })
  }
}
