import Image from 'next/image'
import { Section } from '@/components/layout/section'
import { Card } from '@/components/ui/card'
import { Award, Users, Globe, Target } from 'lucide-react'

const stats = [
  { icon: Award, label: 'Founded', value: '2024' },
  { icon: Target, label: 'Projects Delivered', value: '10+ plants & dealerships' },
  { icon: Globe, label: 'Coverage', value: 'Uttar Pradesh + neighbouring states' },
  { icon: Users, label: 'Approach', value: 'Compliance + practical engineering' },
]

const teamMembers = [
  {
    name: 'Indrasen Rai',
    role: 'Managing Director',
    description:
      'Provides strategic leadership and governance across company operations and partnerships.',
    image: '/team/01-director.jpeg',
  },
  {
    name: 'Satyam Rai',
    role: 'Head of Operations',
    description:
      'Leads commissioning teams and long-term O&M, ensuring projects run safely and efficiently.',
    image: '/team/02-operations.jpeg',
  },
  {
    name: 'Shivani Singh',
    role: 'HR & Marketing Head',
    description:
      'Oversees talent programs and marketing strategy to grow the team and brand presence.',
    image: '/team/03-hr-marketing.jpeg',
  },
]

export default function AboutPage() {
  return (
    <div>
        {/* Page Header */}
        <Section className="pt-20 md:pt-32 pb-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-4">About BNGPowerIndia</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powering sustainable fuel solutions across Uttar Pradesh through compliant, community-first delivery.
            </p>
          </div>
        </Section>

        {/* Snapshot */}
        <Section variant="secondary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-center">
            <div className="mx-auto">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                A practical partner for clean fuel infrastructure
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                BNGPowerIndia plans, builds, and operates CBG &amp; biodiesel plants and facilitates fuel-station
                dealerships. We blend regulatory expertise with practical engineering to deliver compliant projects.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Our teams cover feasibility, DPR, approvals, construction, commissioning, and long-term O&amp;M across
                Uttar Pradesh—helping turn local feedstocks (agri-waste, cattle dung, used cooking oil) into reliable
                fuel assets.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We focus on transparent planning, safe execution, operator training, and monitoring frameworks so
                projects stay on-track and perform reliably after go-live.
              </p>
            </div>
            <div className="relative h-96 overflow-hidden rounded-lg border border-border bg-secondary">
              <Image
                src="/about/cbg_image.png"
                alt="Compressed biogas (CBG) plant infrastructure"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </Section>

        {/* Stats */}
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center text-center">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="p-8 text-center w-full max-w-sm">
                  <Icon className="text-primary mx-auto mb-4" size={32} />
                  <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-foreground font-semibold">{stat.label}</p>
                </Card>
              )
            })}
          </div>
        </Section>

        {/* Mission & Values */}
        <Section variant="secondary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                Deliver scalable CBG &amp; biodiesel projects using local feedstocks and operator-friendly automation.
              </p>
            </Card>
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                Be India’s most trusted partner for decentralized clean-fuel infrastructure.
              </p>
            </Card>
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Values</h3>
              <p className="text-muted-foreground leading-relaxed">
                Safety-first, Community-first, Compliance, and Transparency guide everything we do.
              </p>
            </Card>
          </div>
        </Section>

        {/* Leadership Team */}
        <Section>
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">Leadership Team</h2>
            <p className="text-lg text-muted-foreground">
              Meet the team leading delivery, operations, and growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center text-center">
            {teamMembers.map((member, index) => (
              <Card key={index} className="p-6 text-center w-full max-w-sm">
                <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border border-border bg-secondary">
                  <Image
                    src={member.image}
                    alt={`${member.name} — ${member.role}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-primary font-semibold mb-3 text-sm">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* Partnerships & Standards */}
        <Section variant="secondary">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">Partnerships &amp; Standards</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              From SATAT-aligned delivery to long-term operations, we design processes that keep projects compliant and
              reliable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                'SATAT-aligned CBG delivery & commissioning',
                'Operator training, monitoring & AMC frameworks',
                'Fuel retail liaison with OMC networks',
              ].map((cert, index) => (
                <Card key={index} className="p-6 bg-card hover:border-primary transition-colors">
                  <Award size={48} className="text-primary mx-auto mb-4" />
                  <p className="text-foreground font-semibold">{cert}</p>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA */}
        <Section>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Request a consultation for your clean fuel project
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Tell us your location, feedstock, and timeline—our team will guide feasibility, approvals, and delivery.
            </p>
            <a
              href="/contact"
              className="inline-block bg-primary hover:bg-accent text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Request a Consultation
            </a>
          </div>
        </Section>
    </div>
  )
}
