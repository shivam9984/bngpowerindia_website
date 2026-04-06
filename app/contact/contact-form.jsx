'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mail, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/info@bngpowerindia.com'
const FORMSUBMIT_SUBJECT = 'New Contact Enquiry from Website'

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  service: '',
  message: '',
  consent: false,
}

export default function ContactForm() {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const payload = new FormData()
      payload.append('firstName', formData.firstName)
      payload.append('lastName', formData.lastName)
      payload.append('email', formData.email)
      payload.append('phone', formData.phone)
      payload.append('service', formData.service)
      payload.append('message', formData.message)
      payload.append('consent', String(formData.consent))
      payload.append('_subject', FORMSUBMIT_SUBJECT)
      payload.append('_replyto', formData.email)
      payload.append('_template', 'table')
      payload.append('_honey', '')

      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: payload,
      })

      if (!response.ok) {
        throw new Error('Unable to submit the enquiry right now.')
      }

      setStatus({
        type: 'success',
        message: 'Thank you! We have received your message. Our team will contact you within 24 hours.',
      })
      setFormData(INITIAL_FORM)
    } catch {
      setStatus({
        type: 'error',
        message: 'We could not send your enquiry right now. Please try again or contact us by phone or email.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full rounded-[2rem] border-border p-8 text-left shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">Project enquiry form</p>
          <h3 className="mt-2 text-2xl font-bold text-foreground">Send us a message</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Briefly describe your project scope, site, location, or technical questions. We&apos;ll review the
            enquiry and get back with the right next step.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6" suppressHydrationWarning>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              First name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              autoComplete="given-name"
              suppressHydrationWarning
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="First name"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Last name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              suppressHydrationWarning
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Email <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              suppressHydrationWarning
              className="w-full rounded-lg border border-border bg-input py-2 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              suppressHydrationWarning
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Business of interest</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              suppressHydrationWarning
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select…</option>
              <option value="cbg">CBG Plant</option>
              <option value="biodiesel">Biodiesel Plant</option>
              <option value="fuel-station">Retail Fuel Station</option>
              <option value="ev-charging">EV Charging</option>
              <option value="service-support">Project Services</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            suppressHydrationWarning
            className="w-full resize-none rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Describe your project, city, land or site status, capacity requirement, or the questions you want to discuss…"
          />
        </div>

        <div className="rounded-[1.5rem] border border-border bg-secondary/40 p-4">
          <p className="text-sm font-semibold text-foreground">Helpful details to mention</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            You can mention location, land status, feedstock availability, charger requirement, expected scale, or the
            current stage of your project. That helps us respond more usefully.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <input
            id="consent"
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            suppressHydrationWarning
            className="mt-1 h-4 w-4 rounded border-border"
          />
          <label htmlFor="consent" className="text-sm text-muted-foreground">
            I agree to the Privacy Policy.
          </label>
        </div>

        <input
          type="text"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
          suppressHydrationWarning
          className="hidden"
          aria-hidden="true"
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-action py-3 font-semibold text-action-foreground hover:bg-action/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
        </Button>

        {status.message ? (
          <div
            className={`rounded-[1.25rem] border px-4 py-3 text-sm leading-relaxed ${
              status.type === 'success'
                ? 'border-primary/20 bg-primary/5 text-foreground'
                : 'border-destructive/20 bg-destructive/5 text-foreground'
            }`}
          >
            {status.message}
          </div>
        ) : null}

        <p className="text-center text-xs text-muted-foreground">
          By submitting you agree to our data processing for the purpose of responding to your enquiry.
        </p>
      </form>
    </Card>
  )
}
