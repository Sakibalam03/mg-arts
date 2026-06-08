import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPortfolioProject, getPortfolioProjectSlugs } from '@/lib/cms'
import type { Media, Brand } from '@/payload-types'

export async function generateStaticParams() {
  try {
    const slugs = await getPortfolioProjectSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const project = await getPortfolioProject(slug)
    if (!project) return {}
    return {
      title: project.metaTitle ?? project.title,
      description:
        project.metaDesc ??
        `${project.category} interior design project in ${project.city} by MG Arts.`,
    }
  } catch {
    return {}
  }
}

function photoUrl(photo: number | Media): string | null {
  if (typeof photo === 'number') return null
  return photo.url ?? null
}

function brandName(brand: number | Brand): string {
  if (typeof brand === 'number') return String(brand)
  return brand.name
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let project = null

  try {
    project = await getPortfolioProject(slug)
  } catch {}

  if (!project) notFound()

  const photos = project.photos.map(photoUrl).filter(Boolean) as string[]
  const brands = project.brands ?? []

  return (
    <div className="flex flex-col">
      <article className="px-6 max-sm:px-4 pt-14 max-sm:pt-10 pb-20 max-sm:pb-12 max-w-4xl mx-auto w-full">
        {/* Breadcrumb meta */}
        <p className="text-[12px] text-muted-foreground capitalize mb-3">
          {project.category} · {project.city} · {project.year}
        </p>

        <h1 className="font-sans font-extrabold text-[clamp(1.75rem,4vw,2.75rem)] tracking-[-0.03em] text-foreground mb-8">
          {project.title}
        </h1>

        {/* Photo grid */}
        {photos.length > 0 && (
          <div
            className={[
              'gap-3 mb-10',
              photos.length === 1
                ? 'block'
                : 'grid grid-cols-2 max-sm:grid-cols-1',
            ].join(' ')}
          >
            {photos.map((url, i) => (
              <div
                key={i}
                className={[
                  'rounded-lg overflow-hidden bg-secondary',
                  i === 0 && photos.length > 2 ? 'col-span-2 max-sm:col-span-1' : '',
                  photos.length === 1 ? 'h-[280px] sm:h-[420px]' : 'aspect-[4/3]',
                ].join(' ')}
              >
                <img
                  src={url}
                  alt={`${project.title} — photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* No photos placeholder */}
        {photos.length === 0 && (
          <div className="h-64 rounded-lg bg-secondary border border-border flex items-center justify-center mb-10">
            <p className="text-[12px] text-muted-foreground uppercase tracking-widest">
              Photos coming soon
            </p>
          </div>
        )}

        {/* Collaborator */}
        {project.collaborator && (
          <p className="text-[14px] text-muted-foreground mb-8">
            In collaboration with{' '}
            <span className="font-semibold text-foreground">{project.collaborator}</span>
          </p>
        )}

        {/* Brands used */}
        {brands.length > 0 && (
          <div className="mb-10">
            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground mb-4">
              Brands Used
            </p>
            <div className="flex flex-wrap gap-2">
              {brands.map((b, i) => (
                <span
                  key={i}
                  className="text-[13px] border border-border rounded-md px-3 py-1.5 text-foreground"
                >
                  {brandName(b)}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
