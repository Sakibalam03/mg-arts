'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const LABELS = ['requirement', 'quote', 'boq', 'drawing', 'other'] as const

export function UploadForm({ projectId }: { projectId: string }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [label, setLabel] = useState<string>('requirement')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setStatus('uploading')
    setProgress(0)

    try {
      const urlRes = await fetch(
        `/api/s3/upload-url?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&projectId=${projectId}`,
      )
      if (!urlRes.ok) throw new Error('Failed to get upload URL')
      const { url, key } = await urlRes.json()

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100))
        }
        xhr.onload = () => (xhr.status === 200 ? resolve() : reject(new Error('S3 upload failed')))
        xhr.onerror = () => reject(new Error('S3 upload failed'))
        xhr.open('PUT', url)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })

      const docRes = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          fileUrl: key,
          fileName: file.name,
          fileType: file.type,
          label,
          visibleTo: 'all',
        }),
      })
      if (!docRes.ok) throw new Error('Failed to record document')

      setStatus('done')
      if (fileRef.current) fileRef.current.value = ''
      router.refresh()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[var(--border)] rounded-lg p-5 bg-[var(--bg)]"
    >
      <h3 className="font-bold text-sm mb-4 text-[var(--text)]">Upload Document</h3>
      <div className="flex gap-3 flex-wrap mb-4">
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs text-[var(--text-muted)] block mb-1">Label</label>
          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full border border-[var(--border)] rounded-md px-3 py-1.5 text-[13px] bg-[var(--bg)] text-[var(--text)]"
          >
            {LABELS.map((l) => (
              <option key={l} value={l} className="capitalize">
                {l}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-[2] min-w-[200px]">
          <label className="text-xs text-[var(--text-muted)] block mb-1">File</label>
          <input ref={fileRef} type="file" required className="w-full text-[13px] text-[var(--text)]" />
        </div>
      </div>

      {status === 'uploading' && (
        <div className="mb-3">
          <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">{progress}%</p>
        </div>
      )}
      {status === 'done' && (
        <p className="text-[13px] text-green-500 mb-2">Uploaded successfully.</p>
      )}
      {status === 'error' && (
        <p className="text-[13px] text-[var(--accent)] mb-2">Upload failed — please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'uploading'}
        className="bg-[var(--accent)] text-white border-none rounded-md px-[18px] py-2 font-semibold text-[13px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === 'uploading' ? `Uploading ${progress}%…` : 'Upload'}
      </button>
    </form>
  )
}
