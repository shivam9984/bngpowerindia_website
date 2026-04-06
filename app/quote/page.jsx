import { Section } from '@/components/layout/section'
import { Card } from '@/components/ui/card'
import QuoteForm from './quote-form'

export default function QuotePage() {
  return (
    <div>
        {/* Page Header */}
        <Section className="pt-20 md:pt-32 pb-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-4">Get a Fuel Quote</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Request a customized quote for your fuel needs. Our team will get back to you within 24 hours.
            </p>
          </div>
        </Section>

        {/* Quote Form */}
        <Section>
          <div className="max-w-3xl mx-auto">
            <QuoteForm />
          </div>
        </Section>

        {/* Info Section */}
        <Section variant="secondary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <h4 className="font-bold text-foreground mb-2">Quick Response</h4>
              <p className="text-muted-foreground text-sm">
                Our sales team responds to all quote requests within 24 business hours.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-bold text-foreground mb-2">Competitive Pricing</h4>
              <p className="text-muted-foreground text-sm">
                Get the best prices on high-quality fuel with volume discounts available.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-bold text-foreground mb-2">Flexible Terms</h4>
              <p className="text-muted-foreground text-sm">
                Custom payment plans and flexible delivery schedules to match your needs.
              </p>
            </Card>
          </div>
        </Section>
    </div>
  )
}
