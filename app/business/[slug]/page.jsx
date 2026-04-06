import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CircleCheckBig } from 'lucide-react'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import { getAllProducts, getProductBySlug } from '@/lib/products/catalog'

export async function generateStaticParams() {
  return getAllProducts().map((business) => ({
    slug: business.slug,
  }))
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const slug = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug[0] : resolvedParams?.slug
  const business = getProductBySlug(slug)

  if (!business) {
    return {
      title: 'Business Not Found | BNGPowerIndia',
    }
  }

  return {
    title: `${business.name} | BNGPowerIndia`,
    description: business.seoDescription,
    keywords: business.seoKeywords,
    openGraph: {
      title: `${business.name} | BNGPowerIndia`,
      description: business.seoDescription,
      images: [{ url: business.image, alt: business.imageAlt }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${business.name} | BNGPowerIndia`,
      description: business.seoDescription,
      images: [business.image],
    },
  }
}

export default async function BusinessDetailPage({ params }) {
  const resolvedParams = await params
  const slug = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug[0] : resolvedParams?.slug
  const business = getProductBySlug(slug)

  if (!business) {
    notFound()
  }

  const relatedBusinesses = getAllProducts().filter((item) => item.slug !== business.slug)
  const hasCustomIntro = Array.isArray(business.introParagraphs) && business.introParagraphs.length > 0

  return (
    <div>
      <Section className="pt-20 pb-10 md:pt-32">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Link
              href="/business"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all businesses
            </Link>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {business.tag}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                {business.eyebrow}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-foreground md:text-6xl">{business.name}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/90">{business.description}</p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{business.overview}</p>

            {!business.hidePrimaryActions && (
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/dashboard/apply/${business.serviceSlug}`}>
                  <Button className="gap-2 bg-action text-action-foreground hover:bg-action/90">
                    Start {business.shortName} Project
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">Talk to Our Team</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-border bg-secondary shadow-sm">
            <Image
              src={business.image}
              alt={business.imageAlt}
              fill
              className={business.imageMode === 'contain' ? 'object-contain p-8' : 'object-cover'}
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section variant="secondary">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-border bg-background p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold text-primary">{business.sectionOverviewLabel || 'What this page can cover'}</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              {business.sectionOverviewTitle || 'A reusable structure for the detailed business story'}
            </h2>
            {hasCustomIntro ? (
              <div className="mt-4 space-y-4">
                {business.introParagraphs?.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                This section is designed as an editable foundation. You can replace or expand it with technical specs,
                approvals, pricing approach, timelines, case studies, client scenarios, downloadable brochures, and
                a stronger conversion flow.
              </p>
            )}

            {business.featuredPills?.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  {business.featuredPillsLabel || 'Highlights'}
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

            <div className="mt-6 space-y-4">
              {business.deliverables.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-border p-4">
                  <CircleCheckBig className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-background p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold text-primary">{business.sectionAudienceLabel || 'Who this is for'}</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              {business.sectionAudienceTitle || 'Ideal audience and buyer intent'}
            </h2>
            <div className="mt-6 space-y-4">
              {business.idealFor.map((item) => (
                <div key={item} className="rounded-2xl border border-border p-4">
                  <p className="text-sm leading-relaxed text-foreground">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-border bg-secondary/60 p-5">
              <p className="text-sm font-semibold text-primary">Core highlights</p>
              <div className="mt-4 space-y-3">
                {business.highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CircleCheckBig className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold text-primary">{business.sectionJourneyLabel || 'Suggested page journey'}</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            {business.sectionJourneyTitle || 'A reusable structure for your detailed business story'}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {business.processSteps.map((step, index) => (
            <div key={step.title} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.24em] text-primary">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {(!business.hideFaqSection && business.faqs?.length > 0) || !business.hideRelatedProducts ? (
        <Section variant="secondary">
          <div
            className={`grid gap-8 ${
              !business.hideFaqSection && business.faqs?.length > 0 && !business.hideRelatedProducts
                ? 'lg:grid-cols-[1fr_0.9fr]'
                : 'lg:grid-cols-1'
            }`}
          >
            {!business.hideFaqSection && business.faqs?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-primary">FAQ</p>
                <h2 className="mt-2 text-3xl font-bold text-foreground">Starter questions for this page</h2>

                <div className="mt-6 space-y-4">
                  {business.faqs.map((item) => (
                    <div key={item.question} className="rounded-[1.5rem] border border-border bg-background p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!business.hideRelatedProducts && (
              <div className="rounded-[2rem] border border-border bg-background p-6 shadow-sm md:p-8">
                <p className="text-sm font-semibold text-primary">Related Businesses</p>
                <h2 className="mt-2 text-3xl font-bold text-foreground">Explore the other business lines</h2>

                <div className="mt-6 space-y-4">
                  {relatedBusinesses.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/business/${item.slug}`}
                      className="block rounded-[1.5rem] border border-border p-5 transition-colors hover:bg-secondary"
                    >
                      <p className="text-sm font-semibold text-primary">{item.tag}</p>
                      <h3 className="mt-1 text-lg font-semibold text-foreground">{item.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      ) : null}
    </div>
  )
}
