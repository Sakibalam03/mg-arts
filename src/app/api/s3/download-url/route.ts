import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getDownloadUrl } from '@/lib/s3'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const key = req.nextUrl.searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

  const url = await getDownloadUrl(key)
  return NextResponse.json({ url })
}
