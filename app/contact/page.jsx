import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'
import ContactForm from './contact-form'

const contactChannels = [
  {
    title: 'Call our team',
    description:
      'Speak directly with our team for project discussions, technical queries, and immediate guidance on the next step.',
    value: '+91 9151141423',
    href: 'tel:+919151141423',
    icon: Phone,
  },
  {
    title: 'Email for project details',
    description:
      'Share land, location, feedstock, charger requirement, or business objective and we will respond with the right direction.',
    value: 'info@bngpowerindia.com',
    href: 'mailto:info@bngpowerindia.com',
    icon: Mail,
  },
  {
    title: 'WhatsApp for quick coordination',
    description:
      'Useful for quick updates, sharing site details, and faster initial coordination when you want a lighter first conversation.',
    value: 'Start WhatsApp Chat',
    href: 'https://wa.me/919151141423',
    icon: MessageCircle,
  },
]

export const metadata = {
  title: 'Contact BNGPowerIndia | Green Energy and Future Energy Projects',
  description:
    'Contact BNGPowerIndia for CBG, biodiesel, retail fuel station, and EV charging business enquiries, technical guidance, and project support.',
  keywords: [
    'contact BNGPowerIndia',
    'green energy consultation',
    'energy project enquiry',
    'CBG plant contact',
    'biodiesel plant contact',
    'fuel station business enquiry',
    'EV charging project contact',
    'future energy business support',
  ],
}

export default function ContactPage() {
  return (
    <div>
      <Section className="pt-20 pb-10 md:pt-32">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold text-primary">Contact</p>
            <h1 className="text-4xl font-bold text-foreground md:text-6xl">
              Let&apos;s talk about your next energy infrastructure project
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Whether you are evaluating a CBG plant, biodiesel business, retail fuel station, or EV charging
              rollout, this is the right place to begin the conversation. Share the project background and we will
              help you understand the practical next step.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">
              We usually support enquiries around feasibility, project readiness, documentation flow, layout thinking,
              implementation direction, commissioning support, and how to move from interest to a more execution-ready
              plan.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground">
                Green energy
              </span>
              <span className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground">
                Future energy
              </span>
              <span className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground">
                Clean fuel
              </span>
              <span className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground">
                Execution-ready planning
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-secondary shadow-sm">
            <Image
              src="/contact/fuel_station.png"
              alt="Energy infrastructure discussion and site coordination"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,14,13,0.16)_0%,rgba(4,14,13,0.22)_40%,rgba(4,14,13,0.72)_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/15 bg-black/35 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Response window</p>
                      <p className="text-sm text-white/80">Typically within 24 hours</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-white/15 bg-black/35 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Based in Lucknow</p>
                      <p className="text-sm text-white/80">Serving energy opportunities across India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section variant="secondary">
        <div className="mb-12 max-w-4xl">
          <p className="text-sm font-semibold text-primary">Get In Touch</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
            Choose the fastest way to reach our project and operations team
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {contactChannels.map((channel) => (
            <a
              key={channel.title}
              href={channel.href}
              className="block rounded-[2rem] border border-border bg-background p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md"
              target={channel.href.startsWith('https://') ? '_blank' : undefined}
              rel={channel.href.startsWith('https://') ? 'noopener noreferrer' : undefined}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <channel.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">{channel.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{channel.description}</p>
              <p className="mt-5 text-sm font-semibold text-primary">{channel.value}</p>
            </a>
          ))}
        </div>
      </Section>

      <Section>
        <div className="space-y-10">
          <div className="w-full">
            <div className="rounded-[2.25rem] bg-gradient-to-br from-secondary/60 via-background to-secondary/30 px-6 py-8 md:px-8 md:py-10">
              <div className="max-w-4xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">Office & Support</p>
                    <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">Reach BNGPowerIndia</h2>
                    <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
                      Direct lines for project discussions, technical coordination, feasibility questions, and the next
                      step for your business enquiry.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 h-px w-full bg-border" />

              <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
                <div className="md:pr-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Registered Office</p>
                  <p className="mt-4 text-base leading-relaxed text-foreground">
                    A2 1004, Parijat Building, Gomti Nagar, Near Awadh Bus Station, Lucknow, Uttar Pradesh 226010
                  </p>
                </div>

                <div className="border-t border-border pt-8 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Phone</p>
                  <div className="mt-4 space-y-2 text-base text-foreground">
                    <a className="block hover:underline" href="tel:+919151141423">
                      +91 9151141423
                    </a>
                    <a className="block hover:underline" href="tel:+915223384868">
                      0522 3384868
                    </a>
                  </div>
                </div>

                <div className="border-t border-border pt-8 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Email & Hours</p>
                  <a
                    className="mt-4 inline-block text-base text-foreground hover:underline"
                    href="mailto:info@bngpowerindia.com"
                    suppressHydrationWarning
                  >
                    info@bngpowerindia.com
                  </a>
                  <div className="mt-4 space-y-1">
                    <p className="text-sm leading-relaxed text-muted-foreground">Mon-Fri: 09:00 AM - 07:00 PM IST</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">Sat: 10:00 AM - 04:00 PM IST</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="tel:+919151141423">
                  <Button className="bg-action text-action-foreground hover:bg-action/90">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>
                </a>
                <a href="https://wa.me/919151141423" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-5xl">
            <ContactForm />
          </div>
        </div>
      </Section>

      <Section variant="secondary">
        <div className="mb-10 max-w-4xl">
          <p className="text-sm font-semibold text-primary">Location</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
            Visit us in Lucknow or open the location directly in Google Maps
          </h2>
        </div>

        <Card className="overflow-hidden rounded-[2rem] border-border p-4">
          <div className="overflow-hidden rounded-[1.5rem] border border-border">
            <iframe
              title="BNGPowerIndia location"
              src="https://maps.google.com/maps?q=26.873411878638443,81.01825559577259&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-96 w-full"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col gap-4 px-4 pb-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">BNGPowerIndia Office</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Gomti Nagar, Lucknow, Uttar Pradesh
              </p>
            </div>
            <a
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              href="https://www.google.com/maps/search/?api=1&query=26.873411878638443,81.01825559577259"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin className="h-4 w-4" />
              Open in Google Maps
            </a>
          </div>
        </Card>
      </Section>
    </div>
  )
}
