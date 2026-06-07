import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import type { LandingPage, Notice, Service, RateItem, PortfolioProject, SiteSetting } from '@/payload-types'

async function db() {
  return getPayload({ config: await config })
}

export async function getLandingPage(): Promise<LandingPage> {
  const payload = await db()
  return payload.findGlobal({ slug: 'landing-page' })
}

export async function getAboutPage() {
  const payload = await db()
  return payload.findGlobal({ slug: 'about-page' })
}

export async function getPmcPage() {
  const payload = await db()
  return payload.findGlobal({ slug: 'pmc-page' })
}

export async function getSiteSettings(): Promise<SiteSetting> {
  const payload = await db()
  return payload.findGlobal({ slug: 'site-settings' })
}

export async function getActiveNotice(): Promise<Notice | null> {
  const payload = await db()
  const { docs } = await payload.find({
    collection: 'notices',
    where: { active: { equals: true } },
    sort: '-createdAt',
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getServices(): Promise<Service[]> {
  const payload = await db()
  const { docs } = await payload.find({
    collection: 'services',
    where: { active: { equals: true } },
    sort: 'order',
    limit: 100,
  })
  return docs
}

export async function getRateItems(category?: string): Promise<RateItem[]> {
  const payload = await db()
  const where: Where = category ? { category: { equals: category } } : {}
  const { docs } = await payload.find({
    collection: 'rate-items',
    where,
    sort: 'order',
    limit: 200,
  })
  return docs
}

export async function getPortfolioProjects(params: {
  category?: string
  city?: string
  limit?: number
} = {}): Promise<PortfolioProject[]> {
  const payload = await db()
  const where: Where = {
    ...(params.category ? { category: { equals: params.category } } : {}),
    ...(params.city ? { city: { like: params.city } } : {}),
  }
  const { docs } = await payload.find({
    collection: 'portfolio-projects',
    where,
    sort: '-year',
    limit: params.limit ?? 50,
  })
  return docs
}

export async function getPortfolioProject(slug: string): Promise<PortfolioProject | null> {
  const payload = await db()
  const { docs } = await payload.find({
    collection: 'portfolio-projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getPortfolioProjectSlugs(): Promise<string[]> {
  const payload = await db()
  const { docs } = await payload.find({
    collection: 'portfolio-projects',
    limit: 1000,
  })
  return docs.map((d) => d.slug ?? '').filter(Boolean)
}
