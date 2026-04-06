import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CircleCheckBig, Leaf, Sparkles, Zap } from 'lucide-react'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { getAllProducts } from '@/lib/products/catalog'

const energyThemes = [
  {
    title: 'Green energy transition',
    description:
      'We focus on infrastructure that supports cleaner fuel production, lower-emission mobility, and more future-ready project execution.',
    icon: Leaf,
  },
  {
    title: 'Future energy systems',
    description:
      'From CBG and biodiesel to EV charging and retail energy rollout, the aim is to build assets that stay relevant as energy demand evolves.',
    icon: Sparkles,
  },
  {
    title: 'Execution-led energy planning',
    description:
      'Every offering is positioned around feasibility, design clarity, approvals, utilities, commissioning, and operational readiness.',
    icon: Zap,
  },
]

export const metadata = {
  title: 'Green Energy Businesses and Future Energy Infrastructure | BNGPowerIndia',
  description:
    'Explore green energy and future energy infrastructure businesses including CBG plants, biodiesel plants, retail fuel stations, and EV charging station installation.',
  keywords: [
    'green energy businesses',
    'future energy businesses',
    'clean energy infrastructure',
    'CBG plant setup',
    'biodiesel plant design',
    'retail fuel station setup',
    'EV charging infrastructure',
    'renewable energy projects',
    'sustainable fuel solutions',
  ],
  openGraph: {
    title: 'Green Energy Businesses and Future Energy Infrastructure | BNGPowerIndia',
    description:
      'CBG, biodiesel, retail fuel, and EV charging businesses designed for cleaner growth, stronger execution, and future-ready energy infrastructure.',
    type: 'website',
  },
}

export default function BusinessPage() {
  const businesses = getAllProducts()

  return (
    <div>
      <Section className="pt-20 pb-12 md:pt-32">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-semibold text-primary">Businesses</p>
            <h1 className="text-4xl font-bold text-foreground md:text-6xl">
              Green energy and future energy infrastructure businesses built for execution
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Our business portfolio is built around the practical side of energy transition. We do not present these
              capabilities as generic listings. Each one addresses a real infrastructure pathway, whether the goal is
              compressed biogas production, biodiesel manufacturing, retail fuel station rollout, or EV charging
              network development.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">
              The larger focus is future energy readiness: cleaner fuels, stronger project structure, better site
              planning, better commissioning preparation, and solutions that help businesses participate in the
              next generation of sustainable energy infrastructure.
            </p>
          </div>

          <div className="rounded-[2rem] border border-border bg-gradient-to-br from-background via-card to-secondary p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold text-primary">What this portfolio represents</p>
            <div className="mt-6 space-y-5">
              {energyThemes.map((theme) => (
                <div key={theme.title} className="rounded-[1.5rem] border border-border bg-background/85 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <theme.icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">{theme.title}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{theme.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section variant="secondary">
        <div className="mb-12 max-w-4xl">
          <p className="text-sm font-semibold text-primary">Energy Solutions</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
            Business overviews designed around clean fuel, energy transition, and future-ready growth
          </h2>
        </div>

        <div className="space-y-12">
          {businesses.map((business, index) => {
            const reversed = index % 2 === 1

            return (
              <article
                key={business.slug}
                className="grid gap-8 rounded-[2rem] border border-border bg-background p-6 shadow-sm md:p-8 lg:grid-cols-[1fr_1.05fr] lg:items-center"
              >
                <div className={reversed ? 'lg:order-2' : ''}>
                  <div className="relative h-[280px] overflow-hidden rounded-[1.5rem] border border-border bg-secondary md:h-[360px]">
                    <Image
                      src={business.image}
                      alt={business.imageAlt}
                      fill
                      className={`${
                        business.imageMode === 'contain' ? 'object-contain p-8' : 'object-cover'
                      }`}
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                  </div>
                </div>

                <div className={reversed ? 'lg:order-1' : ''}>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {business.tag}
                    </span>
                    <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                      {business.eyebrow}
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold text-foreground">{business.name}</h3>
                  <p className="mt-4 text-base leading-relaxed text-foreground/90">{business.description}</p>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{business.overview}</p>

                  {business.featuredPills?.length > 0 && (
                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        {business.featuredPillsLabel || 'Focus areas'}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {business.featuredPills.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 space-y-3">
                    {business.highlights.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CircleCheckBig className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                        <p className="text-sm leading-relaxed text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Link href={`/business/${business.slug}`}>
                      <Button className="gap-2 bg-action text-action-foreground hover:bg-action/90">
                        Explore {business.shortName}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </Section>

      <Section>
        <div className="rounded-[2rem] border border-border bg-gradient-to-r from-background via-card to-secondary/50 p-6 shadow-sm md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-primary">Future Energy Outlook</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">
                Cleaner fuels, smarter mobility, and stronger energy infrastructure are moving together
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              The future of energy is not one technology in isolation. It is an ecosystem that includes renewable fuel
              production, sustainable mobility infrastructure, modern forecourts, and better integrated project
              execution. Our business pages are designed to reflect that shift clearly, so businesses can evaluate each
              opportunity in the broader context of green energy transition, low-carbon growth, and long-term energy
              resilience.
            </p>
          </div>
        </div>
      </Section>
    </div>
  )
}
