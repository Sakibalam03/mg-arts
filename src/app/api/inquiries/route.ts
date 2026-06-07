import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

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

    const payload = await getPayload({ config: await config })

    const inquiry = await payload.create({
      collection: 'inquiries',
      // Payload's overloads conflict with optional fields; runtime validates schema
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        name,
        phone,
        email: email ?? null,
        message: message ?? null,
        source: source ?? 'contact',
      } as any,
    })

    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 })
  } catch (err) {
    console.error('[inquiries] POST error:', err)
    return NextResponse.json({ error: 'Failed to submit inquiry.' }, { status: 500 })
  }
}
