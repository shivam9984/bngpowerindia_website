import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  CircleCheckBig,
  ClipboardCheck,
  FileCheck,
  HardHat,
  Network,
  ShieldCheck,
  Wrench,
} from 'lucide-react'
import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'

const servicePillars = [
  {
    title: 'Project assessment and readiness',
    description:
      'Once a client chooses the business direction, we help turn that interest into a workable project by reviewing site realities, land readiness, utility constraints, and the practical conditions needed before execution begins.',
    icon: ClipboardCheck,
  },
  {
    title: 'Documentation and coordination',
    description:
      'We support document flow, approval preparedness, stakeholder coordination, and the structured follow-up that keeps projects moving instead of getting stuck between departments, vendors, and decision points.',
    icon: FileCheck,
  },
  {
    title: 'Execution and commissioning support',
    description:
      'Our service role continues into implementation-stage alignment, site-readiness tracking, execution coordination, commissioning preparation, and post-launch stabilization where needed.',
    icon: HardHat,
  },
]

const lifecycleSteps = [
  {
    step: '01',
    title: 'Scope the project after business selection',
    description:
      'After the client chooses a business line such as CBG, Biodiesel, Fuel Station, or EV Charging, we help define the project basis, site expectations, commercial direction, and execution boundaries.',
  },
  {
    step: '02',
    title: 'Review site, utilities, and practical constraints',
    description:
      'We assess the conditions that influence implementation quality, including land status, access, utilities, circulation, power readiness, feedstock assumptions, and the broader operating context.',
  },
  {
    step: '03',
    title: 'Organize documentation and approval-facing work',
    description:
      'Services at this stage focus on documentation discipline, requirement tracking, submission readiness, and smoother coordination with the external and internal stakeholders involved in the project path.',
  },
  {
    step: '04',
    title: 'Support layout, engineering, and execution alignment',
    description:
      'We help bring structure to the next layer of decisions, from infrastructure planning and utility logic to charger positioning, forecourt movement, plant support systems, and implementation sequencing.',
  },
  {
    step: '05',
    title: 'Move toward commissioning and handover',
    description:
      'As the project matures, the focus shifts to execution control, trial-run readiness, commissioning planning, documentation closure, training inputs, and a more stable move into operations.',
  },
]

const deliveryAreas = [
  'Site review, land-readiness understanding, and early feasibility support',
  'Document preparation support and approval-readiness coordination',
  'Layout planning inputs, infrastructure logic, and implementation sequencing',
  'Vendor, team, and stakeholder coordination through the active project phase',
  'Commissioning preparation, handover support, and operational stabilization inputs',
  'A service structure that can work across green fuel, biofuel, retail energy, and EV infrastructure projects',
]

const sectors = [
  {
    title: 'CBG and biodiesel projects',
    description:
      'For clean fuel production projects, services usually center around planning clarity, utilities, process-support coordination, implementation structure, commissioning readiness, and the move into stable operations.',
    image: '/home/cbg_image.png',
    alt: 'CBG plant infrastructure',
  },
  {
    title: 'Fuel station and EV charging projects',
    description:
      'For customer-facing infrastructure, services often involve documentation flow, layout readiness, site coordination, access and circulation planning, utility alignment, installation sequencing, and launch support.',
    image: '/products/ev-charging-hero.png',
    alt: 'EV charging stations installed in a parking area',
  },
]

export const metadata = {
  title: 'Project Services and Execution Support | BNGPowerIndia',
  description:
    'Delivery services after business selection, including project assessment, documentation support, execution coordination, commissioning readiness, and post-launch support across energy infrastructure projects.',
  keywords: [
    'project execution services',
    'energy execution support',
    'commissioning support',
    'documentation and approvals coordination',
    'post-sales infrastructure services',
    'green energy project execution',
    'future energy delivery support',
    'site readiness and handover services',
  ],
}

export default function ServicesPage() {
  return (
    <div>
      <Section className="pt-20 pb-10 md:pt-32">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold text-primary">Services</p>
            <h1 className="text-4xl font-bold text-foreground md:text-6xl">
              Project services that begin after the business decision is made
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Business pages explain what we offer. Services explain how we help deliver it. Once the client chooses the
              right business line, our service role begins with project structuring, documentation flow, coordination,
              execution readiness, commissioning support, and practical follow-through.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">
              This page is focused on the work that usually happens after business selection: making the project easier
              to execute, easier to coordinate, and better prepared for launch across green energy, clean fuel, retail
              energy, and future mobility infrastructure.
            </p>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-border bg-secondary shadow-sm">
            <Image
              src="/home/fuel_station.png"
              alt="Energy infrastructure site"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section variant="secondary">
        <div className="mb-12 max-w-4xl">
          <p className="text-sm font-semibold text-primary">Service Focus</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
            Support built around delivery, coordination, compliance readiness, and post-sale execution
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {servicePillars.map((pillar) => (
            <div key={pillar.title} className="rounded-[2rem] border border-border bg-background p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <pillar.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-primary">Project Lifecycle</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
              What our service involvement typically looks like after business sales
            </h2>
          </div>

          <div className="space-y-4">
            {lifecycleSteps.map((item) => (
              <div key={item.step} className="grid grid-cols-[auto_1fr] gap-4 rounded-[2rem] border border-border bg-card p-5 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section variant="secondary">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-border bg-background p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold text-primary">Delivery Areas</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Where our service team adds value during the active project phase
            </h2>

            <div className="mt-6 space-y-4">
              {deliveryAreas.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[1.5rem] border border-border p-4">
                  <CircleCheckBig className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-background p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold text-primary">Service Orientation</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              More than consultation, less ambiguity during execution
            </h2>

            <div className="mt-6 space-y-5">
              <div className="rounded-[1.5rem] border border-border p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Network className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Coordination across moving parts</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Many energy projects slow down because responsibility gets fragmented. Our service model helps keep
                  the threads connected across documents, decisions, layouts, vendors, utilities, and execution timing.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-border p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Compliance and readiness awareness</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Services are shaped around readiness, not just speed. That means paying attention to approvals,
                  paperwork, utilities, access, site dependencies, and the small operational details that affect launch.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-border p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Execution-minded support</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The emphasis stays on practical execution. We focus on what helps the project move toward
                  implementation, commissioning, handover, and stable operational conditions after launch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="mb-12 max-w-4xl">
          <p className="text-sm font-semibold text-primary">Applied Across Sectors</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
            The same service discipline supports different energy infrastructure categories
          </h2>
        </div>

        <div className="space-y-10">
          {sectors.map((sector, index) => {
            const reversed = index % 2 === 1

            return (
              <article
                key={sector.title}
                className="grid gap-8 rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8 lg:grid-cols-[1fr_1.05fr] lg:items-center"
              >
                <div className={reversed ? 'lg:order-2' : ''}>
                  <div className="relative h-[280px] overflow-hidden rounded-[1.5rem] border border-border bg-secondary md:h-[340px]">
                    <Image
                      src={sector.image}
                      alt={sector.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                  </div>
                </div>

                <div className={reversed ? 'lg:order-1' : ''}>
                  <h3 className="text-3xl font-bold text-foreground">{sector.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{sector.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </Section>

      <Section variant="secondary">
        <div className="rounded-[2rem] border border-border bg-background p-6 shadow-sm md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-primary">Next Step</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">
                Explore the business first, then see how our service team can support execution
              </h2>
            </div>
            <div>
              <p className="text-base leading-relaxed text-muted-foreground">
                If the business pages explain what fits your energy opportunity, this page explains how we stay involved
                after that choice. From readiness and documentation to coordination and commissioning, the aim is to
                make project delivery more controlled and more practical.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/business">
                  <Button className="gap-2 bg-action text-action-foreground hover:bg-action/90">
                    Explore Businesses
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
