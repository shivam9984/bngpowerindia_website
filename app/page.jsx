import { Section } from '@/components/layout/section'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Award,
  BatteryCharging,
  BriefcaseBusiness,
  CircleCheckBig,
  Factory,
  Fuel,
  Leaf,
  MapPinned,
  MoveRight,
  Network,
  NotebookPen,
  Route,
  Shield,
  Sparkles,
  Wrench,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import HomeHeroSlider from './home-hero-slider'

const approachSteps = [
  {
    icon: MapPinned,
    step: '01',
    title: 'Assess the opportunity',
    description:
      'We begin with site realities, utility readiness, project objectives, stakeholder needs, and the compliance path before work starts.',
  },
  {
    icon: NotebookPen,
    step: '02',
    title: 'Structure the execution plan',
    description:
      'Scope definition, documentation flow, engineering coordination, and milestone planning are shaped into a practical rollout framework.',
  },
  {
    icon: Route,
    step: '03',
    title: 'Deliver with control',
    description:
      'We support approvals, vendor alignment, site execution, installation sequencing, testing, and commissioning with delivery discipline.',
  },
  {
    icon: Network,
    step: '04',
    title: 'Stay involved after launch',
    description:
      'Training, stabilisation support, documentation closure, and ongoing advisory help keep operations predictable beyond commissioning.',
  },
]

const services = [
  {
    tag: 'Compressed Bio Gas',
    title: 'CBG Plant Setup & Operations',
    description:
      "End-to-end CBG plant commissioning under India’s SATAT scheme with practical planning, equipment coordination, and startup support.",
    points: ['SATAT-ready documentation', 'Feedstock planning for agri-waste and dung', 'Commissioning and operator handover'],
    highlight: 'Waste to fuel',
    metric: '3-phase delivery',
    icon: Factory,
    eyebrow: 'Biogas infrastructure',
    detail:
      'Ideal for promoters building decentralised energy assets with a strong feedstock and offtake strategy.',
    href: '/business/cbg-plant',
    image: '/home/cbg_image.png',
  },
  {
    tag: 'Biodiesel',
    title: 'Bio Diesel Plant Design & Supply',
    description:
      "Complete biodiesel production facilities from feedstock handling to finished B100, aligned to commercial blending and compliance needs.",
    points: [
      'B20 and B100 production readiness',
      'UCO and multi-feedstock process design',
      'Storage, utilities, and quality setup',
    ],
    highlight: 'Blending-ready output',
    metric: 'Process + utility planning',
    icon: Leaf,
    eyebrow: 'Liquid biofuel production',
    detail:
      'Designed for operators who need cleaner fuel processing capacity with a commercially grounded production setup.',
    href: '/business/biodiesel',
    image: '/home/bio_diesel_plant.png',
  },
  {
    tag: 'Fuel Retail',
    title: 'Fuel Station Dealership Facilitation',
    description:
      'End-to-end support for fuel station setup including site readiness, approvals, layout planning, and commissioning coordination.',
    points: [
      'Site selection and feasibility review',
      'NOC and documentation support',
      'Forecourt layout and execution guidance',
    ],
    highlight: 'Retail rollout support',
    metric: 'Site to startup',
    icon: Fuel,
    eyebrow: 'Forecourt and retail energy',
    detail:
      'Built for entrepreneurs and partners who need a clearer route from documentation to live retail operations.',
    href: '/business/fuel-station',
    image: '/home/fuel_station.png',
  },
  {
    tag: 'E-Mobility',
    title: 'EV Charging Station Installation',
    description:
      'Charging infrastructure planning and installation support for commercial sites, fleet depots, campuses, and public-facing locations.',
    points: [
      'AC and DC charger deployment planning',
      'Load assessment and site layout guidance',
      'Installation coordination and commissioning support',
    ],
    highlight: 'Future-ready mobility',
    metric: 'AC + DC charger support',
    icon: BatteryCharging,
    eyebrow: 'Charging infrastructure',
    detail:
      'Suited to commercial campuses, fleet yards, dealerships, and public-facing locations preparing for EV adoption.',
    href: '/business/ev-charging-station',
    image: '/apply/ev-charging.svg',
  },
]

const strengths = [
  {
    icon: Shield,
    title: 'Execution with compliance in mind',
    description:
      'We do not treat approvals, documentation, and safety as afterthoughts. They are built into delivery from the beginning.',
  },
  {
    icon: Wrench,
    title: 'Practical site-grounded planning',
    description:
      'Recommendations are shaped around land, utilities, civil readiness, operating realities, and long-term maintainability.',
  },
  {
    icon: Award,
    title: 'One partner across multiple tracks',
    description:
      'From biofuel plants to retail forecourts and EV charging, the approach stays coordinated even as project types change.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Built for serious decision-makers',
    description:
      'Promoters, operators, and business owners get clearer visibility into scope, milestones, risks, and next steps.',
  },
]

export default function Home() {
  return (
    <div>
      <HomeHeroSlider />

      <Section variant="secondary">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-semibold text-primary">Our Mission</p>
            <h2 className="mb-5 text-4xl font-bold text-foreground">Build cleaner energy projects with clarity, discipline, and long-term value</h2>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Our mission is not limited to one business line. We help businesses and promoters move energy
              infrastructure ideas into workable projects through better planning, stronger execution, and more
              reliable operational handover.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              That means staying focused on what matters most: realistic site decisions, structured approvals,
              coordinated delivery, and dependable systems that can keep performing after launch.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-background/80 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">What drives us</p>
                <p className="mt-3 text-lg font-semibold text-foreground">Cleaner infrastructure that is practical to build and realistic to operate.</p>
              </div>
              <div className="rounded-3xl border border-border bg-background/80 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">What we protect</p>
                <p className="mt-3 text-lg font-semibold text-foreground">Time, capital, compliance readiness, and execution confidence.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-gradient-to-br from-background via-card to-secondary p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Our working approach</p>
                <p className="text-sm text-muted-foreground">A generic execution model we apply across project types</p>
              </div>
            </div>

            <div className="space-y-4">
              {approachSteps.map((step) => (
                <div key={step.step} className="grid grid-cols-[auto_1fr] gap-4 rounded-3xl border border-border bg-background/80 p-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold tracking-[0.24em] text-primary">{step.step}</span>
                    <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold text-primary">Our Businesses</p>
          <h2 className="mb-4 text-4xl font-bold text-foreground">Core service lines for clean energy and infrastructure rollout</h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Each line below is presented as a real delivery stream with its own planning context, execution logic, and commissioning priorities.
          </p>
        </div>

        <div className="space-y-10">
          {services.map((service, index) => {
            const reversed = index % 2 === 1
            return (
              <div
                key={service.title}
                className={`grid gap-8 rounded-[2rem] border border-border/80 p-6 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center ${
                  reversed ? 'bg-secondary/55' : 'bg-gradient-to-r from-background via-card to-secondary/40'
                }`}
              >
                <div className={reversed ? 'lg:order-2' : ''}>
                  <div className="relative h-[280px] overflow-hidden rounded-[1.5rem] border border-border bg-secondary md:h-[360px]">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                  </div>
                </div>

                <div className={reversed ? 'lg:order-1' : ''}>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {service.eyebrow}
                    </span>
                    <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                      {service.metric}
                    </span>
                  </div>

                  <div className="mb-5 flex items-start gap-4">
                    <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <service.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">{service.highlight}</p>
                      <h3 className="mt-1 text-3xl font-bold text-foreground">{service.title}</h3>
                    </div>
                  </div>

                  <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{service.description}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{service.detail}</p>

                  <div className="mt-6 grid gap-3">
                    {service.points.map((point) => (
                      <div key={point} className="flex items-start gap-3">
                        <CircleCheckBig className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                        <p className="text-sm text-foreground">{point}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link href={service.href}>
                      <Button className="gap-2 bg-primary px-6 text-primary-foreground hover:bg-accent">
                        Explore Solutions
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <MoveRight className="h-4 w-4 text-primary" />
                      Structured for planning, execution, and launch
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      <Section variant="secondary">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold text-primary">Why Choose Us</p>
          <h2 className="mb-4 text-4xl font-bold text-foreground">A cleaner way to move complex projects forward</h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            We combine project thinking, site reality, and delivery discipline so decisions feel clearer and execution stays more controlled.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {strengths.map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-border bg-background/85 p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] border border-border bg-gradient-to-r from-background via-card to-background p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-semibold text-primary">What clients usually value most</p>
              <h3 className="mt-2 text-2xl font-bold text-foreground">Less ambiguity before execution begins</h3>
            </div>
            <p className="text-muted-foreground">
              Whether the project is a plant, a retail setup, or a charging installation, our role is to reduce uncertainty through better structure, stronger preparation, and tighter coordination.
            </p>
          </div>
        </div>
      </Section>

    </div>
  )
}
