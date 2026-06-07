import type { MetadataRoute } from 'next'
import { getPortfolioProjectSlugs } from '@/lib/cms'

const BASE = 'https://mgarts.co.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/rates`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/pmc`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/vendors/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    const slugs = await getPortfolioProjectSlugs()
    projectRoutes = slugs.map((slug) => ({
      url: `${BASE}/projects/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {}

  return [...staticRoutes, ...projectRoutes]
}
