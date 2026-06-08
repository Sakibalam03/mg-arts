import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import type { LandingPage, Notice, Service, RateItem, PortfolioProject, SiteSetting } from '@/payload-types'
import type { NavItem, FooterColumn } from '@/types/nav'
import MENUS from 'constants/menus'

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

const DEFAULT_NAV: NavItem[] = MENUS.header as NavItem[]

const DEFAULT_FOOTER: FooterColumn[] = MENUS.footer.map((col) => ({
  heading: col.heading,
  items: col.items.map((item) => ({ text: item.text, link: item.to ?? '' })),
}))

export async function getNavigation(): Promise<NavItem[]> {
  try {
    const payload = await db()
    const nav = await payload.findGlobal({ slug: 'navigation' })
    if (!nav.items?.length) return DEFAULT_NAV
    return nav.items.map((item) => ({
      text: item.label,
      to: item.link ?? undefined,
      sections: item.sections?.map((section) => ({
        title: section.title ?? undefined,
        items: (section.items ?? []).map((sub) => ({
          title: sub.title,
          to: sub.link,
          description: sub.description ?? undefined,
        })),
      })),
    }))
  } catch {
    return DEFAULT_NAV
  }
}

export interface FooterData {
  tagline: string
  copyrightName: string
  columns: FooterColumn[]
}

const DEFAULT_FOOTER_DATA: FooterData = {
  tagline: 'Interior Execution & PMC',
  copyrightName: 'MG Arts',
  columns: DEFAULT_FOOTER,
}

export async function getFooter(): Promise<FooterData> {
  try {
    const payload = await db()
    const footer = await payload.findGlobal({ slug: 'footer' })
    return {
      tagline: footer.tagline || DEFAULT_FOOTER_DATA.tagline,
      copyrightName: footer.copyrightName || DEFAULT_FOOTER_DATA.copyrightName,
      columns: footer.columns?.length
        ? footer.columns.map((col) => ({
            heading: col.heading,
            items: (col.items ?? []).map((item) => ({ text: item.text, link: item.link })),
          }))
        : DEFAULT_FOOTER,
    }
  } catch {
    return DEFAULT_FOOTER_DATA
  }
}
