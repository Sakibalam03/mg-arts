import Link from 'next/link'
import { getPortfolioProjects } from '@/lib/cms'
import type { PortfolioProject, Media } from '@/payload-types'

export const metadata = {
  title: 'Projects',
  description:
    'MG Arts completed projects — residential, commercial, hospitality. Browse our portfolio across Mumbai, Bangalore, and Kolkata.',
}

const CATEGORIES = ['all', 'residential', 'commercial', 'hospitality'] as const

function firstPhotoUrl(photos: (number | Media)[]): string | null {
  const first = photos[0]
  if (!first || typeof first === 'number') return null
  return first.url ?? null
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const activeCategory = CATEGORIES.includes(category as (typeof CATEGORIES)[number])
    ? (category as (typeof CATEGORIES)[number])
    : 'all'

  let projects: PortfolioProject[] = []
  try {
    projects = await getPortfolioProjects({
      category: activeCategory === 'all' ? undefined : activeCategory,
    })
  } catch {}

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="px-6 pt-16 pb-10 max-w-6xl mx-auto w-full">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary mb-5">
          Portfolio
        </p>
        <h1 className="font-sans font-extrabold text-[clamp(2rem,5vw,3.25rem)] tracking-[-0.03em] text-foreground mb-4">
          Completed projects.
        </h1>
        <p className="text-muted-foreground text-[15px]">
          Residential, commercial, and hospitality interiors — delivered across India.
        </p>
      </section>

      {/* Category filters */}
      <div className="px-6 max-w-6xl mx-auto w-full pb-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory
            const href = cat === 'all' ? '/projects' : `/projects?category=${cat}`
            return (
              <Link
                key={cat}
                href={href}
                className={[
                  'px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors duration-150 capitalize',
                  isActive
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-background border-border text-foreground hover:border-foreground/30',
                ].join(' ')}
              >
                {cat}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      <section className="px-6 pb-20 max-w-6xl mx-auto w-full">
        {projects.length === 0 ? (
          <div className="border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground text-[14px]">
              {activeCategory === 'all'
                ? 'Portfolio coming soon — projects are being added.'
                : `No ${activeCategory} projects yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {projects.map((project) => {
              const coverUrl = firstPhotoUrl(project.photos)
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug ?? project.id}`}
                  className="group block border border-border rounded-lg overflow-hidden bg-background hover:border-foreground/20 transition-colors duration-200"
                >
                  {/* Cover image */}
                  <div className="h-52 bg-secondary overflow-hidden">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[11px] text-muted-foreground uppercase tracking-widest">
                          Photos coming
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Meta */}
                  <div className="p-4">
                    <p className="font-semibold text-[14px] text-foreground mb-1 group-hover:text-primary transition-colors duration-150">
                      {project.title}
                    </p>
                    <p className="text-[12px] text-muted-foreground capitalize">
                      {project.city} · {project.year} · {project.category}
                    </p>
                    {project.collaborator && (
                      <p className="text-[11px] text-muted-foreground mt-1">
                        with {project.collaborator}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
