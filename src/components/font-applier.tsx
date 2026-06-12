"use client"

import { useEffect } from 'react'

interface FontApplierProps {
  dmSansVariable: string
  geistMonoVariable: string
  instrumentSerifVariable: string
}

export function FontApplier({ dmSansVariable, geistMonoVariable, instrumentSerifVariable }: FontApplierProps) {
  useEffect(() => {
    const html = document.documentElement
    html.classList.add(dmSansVariable, geistMonoVariable, instrumentSerifVariable, 'dark')
    return () => {
      html.classList.remove(dmSansVariable, geistMonoVariable, instrumentSerifVariable)
    }
  }, [dmSansVariable, geistMonoVariable, instrumentSerifVariable])

  return null
}
