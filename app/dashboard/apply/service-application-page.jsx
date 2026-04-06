'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import indiaLocations from '@/lib/data/india-states-districts.json'
import { getServiceConfig } from '@/lib/applications/config'
import { buildInitialApplicationForm } from '@/lib/applications/forms'
import { useAuth } from '@/lib/auth/use-auth'
import { createApplication } from '@/lib/services/applications'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ClipboardList, MapPin, Send } from 'lucide-react'

const GENERIC_SUBMIT_ERROR = 'Could not submit application.'
const SUCCESS_MESSAGE = 'Form submitted successfully.'
const REQUIRED_MARK = <span className="text-action font-semibold"> *</span>

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
        <Icon className="h-5 w-5 text-action" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
    </div>
  )
}

function FieldError({ message }) {
  if (!message) return null
  return <p className="mt-2 text-xs text-red-600">{message}</p>
}

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-sm font-medium text-foreground">
      {children}
      {required ? REQUIRED_MARK : null}
    </label>
  )
}

function DynamicFormField({ field, value, error, disabled, onTextChange, onSelectChange }) {
  if (field.type === 'select') {
    return (
      <div key={field.name}>
        <FieldLabel required={field.required}>{field.label}</FieldLabel>
        <Select
          value={value || ''}
          onValueChange={(nextValue) => onSelectChange(field.name, nextValue)}
          disabled={disabled}
        >
          <SelectTrigger className="w-full" aria-invalid={!!error}>
            <SelectValue placeholder={field.placeholder || 'Select'} />
          </SelectTrigger>
          <SelectContent>
            {(field.options || []).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError message={error} />
      </div>
    )
  }

  return (
    <div key={field.name}>
      <FieldLabel required={field.required}>{field.label}</FieldLabel>
      <Input
        type={field.type === 'number' ? 'number' : 'text'}
        value={value || ''}
        onChange={onTextChange(field.name)}
        placeholder={field.placeholder || ''}
        disabled={disabled}
        inputMode={field.inputMode}
        step={field.step}
        aria-invalid={!!error}
      />
      <FieldError message={error} />
    </div>
  )
}

function buildLocationOptions() {
  const states = Array.isArray(indiaLocations?.states) ? indiaLocations.states : []
  const stateNames = states.map((item) => item.state)
  const districtsByState = new Map()

  for (const item of states) {
    districtsByState.set(item.state, Array.isArray(item.districts) ? item.districts : [])
  }

  return { stateNames, districtsByState }
}

function validateGoogleMapsPin(value) {
  const nextValue = String(value || '').trim()
  if (!nextValue) return 'Google Maps pin link is required.'

  try {
    const parsed = new URL(nextValue)
    const host = (parsed.hostname || '').toLowerCase()
    if (!host.includes('google') && !host.includes('goo.gl')) {
      return 'Please paste a valid Google Maps link.'
    }
  } catch {
    return 'Please paste a valid URL.'
  }

  return ''
}

function validateFieldValue(field, value) {
  const nextValue = String(value ?? '').trim()
  if (field.required && !nextValue) return `${field.label} is required.`

  if (!nextValue) return ''
  if (field.validation === 'integer' && !/^\d+$/.test(nextValue)) return 'Enter a valid number.'
  if (field.validation === 'decimal' && !/^\d+(\.\d+)?$/.test(nextValue)) return 'Enter a valid number.'
  if (field.validation === 'decimal_2' && !/^\d+(\.\d{1,2})?$/.test(nextValue)) return 'Enter a valid number.'

  return ''
}

function toTrimmedText(value) {
  return String(value ?? '').trim()
}

function toNullableText(value) {
  const nextValue = toTrimmedText(value)
  return nextValue || null
}

function normalizeFreeTextField(name, value) {
  const nextValue = String(value ?? '')

  if (name === 'pincode') {
    return nextValue.replace(/\D/g, '').slice(0, 6)
  }

  return nextValue
}

function buildApplicationRemarks(form) {
  const notes = toNullableText(form.notes)
  if (!notes) return null

  return {
    notes,
  }
}

function validateApplicationForm(form, serviceFields) {
  const errors = {}

  if (!String(form.state || '').trim()) errors.state = 'State is required.'
  if (!String(form.district || '').trim()) errors.district = 'District is required.'
  if (!String(form.subdistrict_tehsil || '').trim()) errors.subdistrict_tehsil = 'Subdistrict/Tehsil is required.'
  if (!/^\d{6}$/.test(String(form.pincode || '').trim())) errors.pincode = 'Pincode must be 6 digits.'
  if (!String(form.full_address || '').trim()) errors.full_address = 'Full address is required.'

  const googleMapsError = validateGoogleMapsPin(form.google_maps_pin)
  if (googleMapsError) errors.google_maps_pin = googleMapsError

  for (const field of serviceFields) {
    const fieldError = validateFieldValue(field, form[field.name])
    if (fieldError) errors[field.name] = fieldError
  }

  return errors
}

function buildServicePayload(form, serviceFields) {
  return serviceFields.reduce((payload, field) => {
    payload[field.name] = toTrimmedText(form[field.name])
    return payload
  }, {})
}

function buildApplicationPayload(form, serviceFields) {
  return {
    ...buildServicePayload(form, serviceFields),
    state: toTrimmedText(form.state),
    district: toTrimmedText(form.district),
    subdistrict_tehsil: toTrimmedText(form.subdistrict_tehsil),
    pincode: toTrimmedText(form.pincode),
    full_address: toTrimmedText(form.full_address),
    google_maps_pin: toTrimmedText(form.google_maps_pin),
    landmark: toNullableText(form.landmark),
    remarks: buildApplicationRemarks(form),
  }
}

export function ServiceApplicationPage({ serviceKey }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const service = getServiceConfig(serviceKey)
  const serviceFields = service.serviceDetails?.fields || []
  const { stateNames, districtsByState } = useMemo(() => buildLocationOptions(), [])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [form, setForm] = useState(() => buildInitialApplicationForm(serviceKey))
  const redirectTimerRef = useRef(null)

  useEffect(() => {
    setForm(buildInitialApplicationForm(serviceKey))
    setFieldErrors({})
    setError('')
    setSuccess('')
  }, [serviceKey])

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current)
      }
    }
  }, [])

  const updateField = useCallback((name, value) => {
    setError('')
    setSuccess('')
    setForm((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleTextChange = useCallback(
    (name) => (event) => {
      updateField(name, normalizeFreeTextField(name, event?.target?.value ?? ''))
    },
    [updateField],
  )

  const handleSelectChange = useCallback(
    (name, value) => {
      updateField(name, value)
    },
    [updateField],
  )

  const handleStateChange = useCallback((value) => {
    setError('')
    setForm((prev) => ({ ...prev, state: value, district: '' }))
  }, [])

  const handleDistrictChange = useCallback(
    (value) => {
      updateField('district', value)
    },
    [updateField],
  )

  async function handleSubmit(event) {
    event.preventDefault()

    if (authLoading) {
      setError('Checking your session. Please try again in a moment.')
      setSuccess('')
      return
    }

    if (!user?.id) {
      setError('Please sign in and try again.')
      setSuccess('')
      return
    }

    setError('')
    setSuccess('')

    const nextErrors = validateApplicationForm(form, serviceFields)
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setError('Please fix the highlighted fields and submit again.')
      return
    }

    setSubmitting(true)
    try {
      const payload = buildApplicationPayload(form, serviceFields)
      const { error: createError } = await createApplication({
        serviceKey: service.key,
        serviceLabel: service.label,
        payload,
        applicantUserId: user.id,
      })

      if (createError) {
        throw createError
      }

      setSuccess(SUCCESS_MESSAGE)
      redirectTimerRef.current = setTimeout(() => {
        router.replace('/dashboard/applicant')
      }, 1500)
    } catch (submitError) {
      setSuccess('')
      setError(submitError?.message || GENERIC_SUBMIT_ERROR)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-6 md:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" asChild className="gap-2">
              <Link href="/dashboard/applicant">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Application form</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Apply for {service.label}
            </h1>
            <p className="text-muted-foreground">
              Provide the basic details below. We&apos;ll reach out to you for the next steps.
            </p>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Application details</CardTitle>
                <CardDescription>Fields marked * are required.</CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-8">
                <LoadingOverlay open={submitting} message="Submitting your application" />
                <section className="space-y-4">
                  <SectionHeading
                    icon={MapPin}
                    title="Project location"
                    description="Provide the full site address and Google Maps pin for accurate verification."
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel required>State</FieldLabel>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Select value={form.state} onValueChange={handleStateChange} disabled={submitting}>
                          <SelectTrigger className="w-full pl-10" aria-invalid={!!fieldErrors.state}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {stateNames.map((stateName) => (
                              <SelectItem key={stateName} value={stateName}>
                                {stateName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FieldError message={fieldErrors.state} />
                    </div>

                    <div>
                      <FieldLabel required>District</FieldLabel>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Select
                          value={form.district}
                          onValueChange={handleDistrictChange}
                          disabled={submitting || !form.state}
                        >
                          <SelectTrigger className="w-full pl-10" aria-invalid={!!fieldErrors.district}>
                            <SelectValue placeholder={form.state ? 'Select district' : 'Select state first'} />
                          </SelectTrigger>
                          <SelectContent>
                            {(districtsByState.get(form.state) || []).map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FieldError message={fieldErrors.district} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel required>Subdistrict/Tehsil</FieldLabel>
                      <Input
                        value={form.subdistrict_tehsil}
                        onChange={handleTextChange('subdistrict_tehsil')}
                        placeholder="Enter tehsil"
                        disabled={submitting}
                        aria-invalid={!!fieldErrors.subdistrict_tehsil}
                      />
                      <FieldError message={fieldErrors.subdistrict_tehsil} />
                    </div>

                    <div className="max-w-xs">
                      <FieldLabel required>Pincode</FieldLabel>
                      <Input
                        value={form.pincode}
                        onChange={handleTextChange('pincode')}
                        placeholder="6-digit pincode"
                        disabled={submitting}
                        inputMode="numeric"
                        aria-invalid={!!fieldErrors.pincode}
                      />
                      <FieldError message={fieldErrors.pincode} />
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel required>Full address</FieldLabel>
                      <Input
                        value={form.full_address}
                        onChange={handleTextChange('full_address')}
                        placeholder="House no, street, area..."
                        disabled={submitting}
                        autoComplete="street-address"
                        aria-invalid={!!fieldErrors.full_address}
                      />
                      <FieldError message={fieldErrors.full_address} />
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel required>Google Maps pin location</FieldLabel>
                      <Input
                        value={form.google_maps_pin}
                        onChange={handleTextChange('google_maps_pin')}
                        placeholder="Paste Google Maps link"
                        disabled={submitting}
                        autoComplete="off"
                        aria-invalid={!!fieldErrors.google_maps_pin}
                      />
                      <FieldError message={fieldErrors.google_maps_pin} />
                      {!fieldErrors.google_maps_pin ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Tip: Drop a pin in Google Maps and copy the share link.
                        </p>
                      ) : null}
                    </div>

                    <div className="sm:col-span-2">
                      <FieldLabel>Landmark (optional)</FieldLabel>
                      <Input
                        value={form.landmark}
                        onChange={handleTextChange('landmark')}
                        placeholder="Nearby landmark"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </section>

                <div className="h-px bg-border" aria-hidden />

                <section className="space-y-4">
                  <SectionHeading
                    icon={ClipboardList}
                    title={service.serviceDetails?.title || 'Service details'}
                    description={service.serviceDetails?.description || ''}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    {serviceFields.map((field) => (
                      <DynamicFormField
                        key={field.name}
                        field={field}
                        value={form[field.name]}
                        error={fieldErrors[field.name]}
                        disabled={submitting}
                        onTextChange={handleTextChange}
                        onSelectChange={handleSelectChange}
                      />
                    ))}
                  </div>
                </section>

                <div className="h-px bg-border" aria-hidden />

                <section className="space-y-4">
                  <SectionHeading
                    icon={Send}
                    title="Additional notes"
                    description="Optional details that can help us understand your requirements."
                  />
                  <Textarea
                    value={form.notes}
                    onChange={handleTextChange('notes')}
                    placeholder="Any details we should know..."
                    disabled={submitting}
                    className="min-h-24"
                  />
                </section>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" asChild disabled={submitting}>
                    <Link href="/dashboard/applicant">Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    className="gap-2"
                    disabled={submitting}
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? 'Submitting...' : 'Submit application'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
