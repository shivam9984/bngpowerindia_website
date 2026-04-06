'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

const INITIAL_FORM = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  fuelType: 'premium-gasoline',
  quantity: '',
  frequency: 'one-time',
  deliveryAddress: '',
  additionalNotes: '',
}

const FREQUENCY_OPTIONS = [
  { value: 'one-time', label: 'One-Time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
]

export default function QuoteForm() {
  const [formData, setFormData] = useState(INITIAL_FORM)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    alert('Thank you for your quote request! Our sales team will contact you within 24 hours.')
    setFormData(INITIAL_FORM)
  }

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="mb-6 text-2xl font-bold text-foreground">Company Information</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your Company"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Contact Name *</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your Name"
              />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-2xl font-bold text-foreground">Fuel Requirements</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Fuel Type *</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="premium-gasoline">Premium Gasoline (95 Octane)</option>
                <option value="gasoline">Regular Gasoline (92 Octane)</option>
                <option value="diesel">Diesel Fuel</option>
                <option value="biodiesel">Bio-Diesel Blend</option>
                <option value="heating-oil">Heating Oil</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Quantity (Gallons) *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="100"
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="1000"
              />
            </div>
          </div>
          <div>
            <label className="mt-6 block text-sm font-semibold text-foreground">Delivery Frequency *</label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {FREQUENCY_OPTIONS.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="frequency"
                    value={option.value}
                    checked={formData.frequency === option.value}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span className="text-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-2xl font-bold text-foreground">Delivery Information</h3>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Delivery Address *</label>
            <input
              type="text"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="123 Business Lane, City, State 12345"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-2xl font-bold text-foreground">Additional Information</h3>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={4}
              className="w-full resize-none rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Any special requirements or additional information..."
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary py-3 text-lg font-semibold text-primary-foreground hover:bg-accent"
        >
          Request Quote
        </Button>
      </form>
    </Card>
  )
}
