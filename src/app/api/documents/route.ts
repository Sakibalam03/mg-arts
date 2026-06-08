import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { projectId, fileUrl, fileName, fileType, label, visibleTo } = body as {
    projectId?: string
    fileUrl?: string
    fileName?: string
    fileType?: string
    label?: string
    visibleTo?: string
  }

  if (!projectId || !fileUrl || !label) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    const doc = await payload.create({
      collection: 'documents',
      overrideAccess: true,
      data: {
        project: Number(projectId),
        uploadedBy: Number(session.user.id),
        fileUrl,
        fileName: fileName ?? '',
        fileType: fileType ?? '',
        label: (label as any) ?? 'other',
        visibleTo: (visibleTo as any) ?? 'all',
      },
    })
    return NextResponse.json({ ok: true, id: doc.id }, { status: 201 })
  } catch (err) {
    console.error('[documents] POST error:', err)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}
