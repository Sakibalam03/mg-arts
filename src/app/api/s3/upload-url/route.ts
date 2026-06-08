import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getUploadUrl, buildDocumentKey } from '@/lib/s3'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const fileName = searchParams.get('fileName')
  const contentType = searchParams.get('contentType')
  const projectId = searchParams.get('projectId')

  if (!fileName || !contentType || !projectId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const key = buildDocumentKey(projectId, fileName)
  const url = await getUploadUrl(key, contentType)
  return NextResponse.json({ url, key })
}
