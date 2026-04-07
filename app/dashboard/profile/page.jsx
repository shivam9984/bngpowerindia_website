'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  createProfileDocumentSignedUrl,
  updateProfileById,
  uploadProfileDocument,
} from '@/lib/api/profiles'
import { useAuth } from '@/lib/auth/use-auth'
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import indiaLocations from '@/lib/data/india-states-districts.json'
import {
  Briefcase,
  CheckCircle2,
  CreditCard,
  IdCard,
  FileText,
  Hash,
  MapPin,
  ExternalLink,
  PencilLine,
  Phone,
  Upload,
  User,
} from 'lucide-react'

function IconInput({
  name,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  inputMode,
  autoComplete,
  disabled,
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="pl-10"
      />
    </div>
  )
}

export default function ProfilePage() {
  const { user, profile, loading, error, refreshProfile } = useAuth()

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [dirty, setDirty] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [hasManualModeChange, setHasManualModeChange] = useState(false)
  const formRef = useRef(null)

  const DOCS_BUCKET = process.env.NEXT_PUBLIC_PROFILE_DOCS_BUCKET || 'customer_document'
  const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10MB
  const SIGNED_URL_TTL_SECONDS = 60

  const FieldLabel = ({ children, required = false }) => (
    <label className="mb-2 block text-sm font-medium text-foreground">
      {children}
      {required ? <span className="text-action font-semibold"> *</span> : null}
    </label>
  )

  const getFilenameFromUrl = (url) => {
    if (!url) return ''
    try {
      const u = new URL(url)
      return decodeURIComponent(u.pathname.split('/').pop() || '')
    } catch {
      return decodeURIComponent(String(url).split('/').pop() || '')
    }
  }

  const [form, setForm] = useState(() => ({
    full_name: '',
    contact_no: '',
    alternate_contact_no: '',
    occupation: '',

    aadhaar_number: '',
    pan_number: '',

    aadhaar_img_url: '',
    pan_img_url: '',
    passport_photo_url: '',

    full_address: '',
    district: '',
    state: '',
    pincode: '',

    is_profile_complete: false,
    is_kyc_verified: false,
  }))

  const [docUrls, setDocUrls] = useState(() => ({
    aadhaar_img_url: '',
    pan_img_url: '',
    passport_photo_url: '',
  }))

  const [pendingDocs, setPendingDocs] = useState(() => ({
    aadhaar_img_url: null,
    pan_img_url: null,
    passport_photo_url: null,
  }))
  const [docOpening, setDocOpening] = useState(() => ({
    aadhaar: false,
    pan: false,
    photo: false,
  }))

  const email = user?.email ?? null

  const STATES = useMemo(() => {
    const list = Array.isArray(indiaLocations?.states) ? indiaLocations.states : []
    return list.map((s) => s.state)
  }, [])

  const DISTRICTS_BY_STATE = useMemo(() => {
    const map = new Map()
    const list = Array.isArray(indiaLocations?.states) ? indiaLocations.states : []
    for (const item of list) {
      map.set(item.state, Array.isArray(item.districts) ? item.districts : [])
    }
    return map
  }, [])

  const [fieldErrors, setFieldErrors] = useState({})

  const shouldOpenInEditMode = useCallback((nextProfile) => {
    if (!nextProfile) return true

    const createdAt = nextProfile.created_at
    const updatedAt = nextProfile.updated_at
    if (!createdAt || !updatedAt) return true

    const createdTime = new Date(createdAt).getTime()
    const updatedTime = new Date(updatedAt).getTime()
    if (Number.isNaN(createdTime) || Number.isNaN(updatedTime)) return true

    return createdTime === updatedTime
  }, [])

  const hydrateFromProfile = useCallback((nextProfile) => {
    if (!nextProfile) return

    setForm((prev) => ({
      ...prev,
      full_name: nextProfile.full_name ?? '',
      contact_no: nextProfile.contact_no ?? '',
      alternate_contact_no: nextProfile.alternate_contact_no ?? '',
      occupation: nextProfile.occupation ?? '',

      aadhaar_number: nextProfile.aadhaar_number ?? '',
      pan_number: nextProfile.pan_number ?? '',

      full_address: nextProfile.full_address ?? '',
      district: nextProfile.district ?? '',
      state: nextProfile.state ?? '',
      pincode: nextProfile.pincode ?? '',

      is_profile_complete: Boolean(nextProfile.is_profile_complete),
      is_kyc_verified: Boolean(nextProfile.is_kyc_verified),
    }))

    setDocUrls({
      aadhaar_img_url: nextProfile.aadhaar_img_url ?? '',
      pan_img_url: nextProfile.pan_img_url ?? '',
      passport_photo_url: nextProfile.passport_photo_url ?? '',
    })
    setPendingDocs({
      aadhaar_img_url: null,
      pan_img_url: null,
      passport_photo_url: null,
    })
  }, [])

  const validateField = useCallback(
    (name, value, nextState) => {
      const v = String(value ?? '').trim()

      if (name === 'full_name') return v ? '' : 'Full name is required.'

      if (name === 'contact_no') return /^\d{10}$/.test(v) ? '' : 'Mobile number must be 10 digits.'
      if (name === 'alternate_contact_no')
        return !v || /^\d{10}$/.test(v) ? '' : 'Alternate mobile must be 10 digits.'
      if (name === 'occupation') return v ? '' : 'Occupation is required.'

      if (name === 'aadhaar_number') return /^\d{12}$/.test(v) ? '' : 'Aadhaar must be 12 digits.'
      if (name === 'pan_number')
        return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v) ? '' : 'PAN format must be like ABCDE1234F.'

      if (name === 'full_address') return v ? '' : 'Address is required.'
      if (name === 'state') return v ? '' : 'State is required.'
      if (name === 'district') {
        const st = String(nextState?.state ?? '').trim()
        if (!v) return 'District is required.'
        const list = DISTRICTS_BY_STATE.get(st) || []
        return list.includes(v) ? '' : 'Select a district from the list.'
      }
      if (name === 'pincode') return /^\d{6}$/.test(v) ? '' : 'Pincode must be 6 digits.'

      return ''
    },
    [DISTRICTS_BY_STATE],
  )

  const isProfileComplete = useMemo(() => {
    const requiredNames = [
      'full_name',
      'contact_no',
      'occupation',
      'aadhaar_number',
      'pan_number',
      'full_address',
      'state',
      'district',
      'pincode',
    ]
    return requiredNames.every((n) => validateField(n, form[n], form) === '')
  }, [form, validateField])

  useEffect(() => {
    if (!profile) return
    if (dirty) return

    hydrateFromProfile(profile)
    if (!hasManualModeChange) {
      setIsEditMode(shouldOpenInEditMode(profile))
    }
    setFieldErrors({})
  }, [dirty, hasManualModeChange, hydrateFromProfile, profile, shouldOpenInEditMode])

  const handleFieldChange = useCallback((e) => {
    const target = e?.target
    const name = target?.name
    let value = target?.value ?? ''
    if (!name) return

    if (name === 'pan_number') {
      value = String(value).toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9]/g, '').slice(0, 10)
    }
    if (name === 'contact_no' || name === 'alternate_contact_no') {
      value = String(value).replace(/\D/g, '').slice(0, 10)
    }
    if (name === 'aadhaar_number') {
      value = String(value).replace(/\D/g, '').slice(0, 12)
    }
    if (name === 'pincode') {
      value = String(value).replace(/\D/g, '').slice(0, 6)
    }

    setDirty(true)
    setSaveError('')
    setForm((prev) => {
      if (prev[name] === value) return prev
      const nextForm = { ...prev, [name]: value }
      setFieldErrors((prevErrors) => {
        const msg = validateField(name, value, nextForm)
        return prevErrors[name] === msg ? prevErrors : { ...prevErrors, [name]: msg }
      })
      return nextForm
    })
  }, [validateField])

  const handleStateChange = useCallback(
    (nextStateValue) => {
      setDirty(true)
      setSaveError('')
      setForm((prev) => {
        const nextForm = { ...prev, state: nextStateValue, district: '' }
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          state: validateField('state', nextStateValue, nextForm),
          district: validateField('district', '', nextForm),
        }))
        return nextForm
      })
    },
    [validateField],
  )

  const handleDistrictChange = useCallback(
    (nextDistrictValue) => {
      setDirty(true)
      setSaveError('')
      setForm((prev) => {
        const nextForm = { ...prev, district: nextDistrictValue }
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          district: validateField('district', nextDistrictValue, nextForm),
        }))
        return nextForm
      })
    },
    [validateField],
  )

  const hasAllRequiredDocuments = useMemo(
    () =>
      Boolean(docUrls.aadhaar_img_url || pendingDocs.aadhaar_img_url) &&
      Boolean(docUrls.pan_img_url || pendingDocs.pan_img_url) &&
      Boolean(docUrls.passport_photo_url || pendingDocs.passport_photo_url),
    [docUrls, pendingDocs],
  )
  const hasPendingDocumentChanges = useMemo(
    () => Object.values(pendingDocs).some(Boolean),
    [pendingDocs],
  )
  const hasFormChanges = useMemo(() => {
    const currentValues = {
      full_name: String(form.full_name || '').trim(),
      contact_no: String(form.contact_no || ''),
      alternate_contact_no: form.alternate_contact_no || null,
      occupation: form.occupation || null,
      aadhaar_number: form.aadhaar_number || null,
      pan_number: form.pan_number || null,
      full_address: form.full_address || null,
      district: form.district || null,
      state: form.state || null,
      pincode: form.pincode || null,
    }

    const savedValues = {
      full_name: String(profile?.full_name || '').trim(),
      contact_no: String(profile?.contact_no || ''),
      alternate_contact_no: profile?.alternate_contact_no || null,
      occupation: profile?.occupation || null,
      aadhaar_number: profile?.aadhaar_number || null,
      pan_number: profile?.pan_number || null,
      full_address: profile?.full_address || null,
      district: profile?.district || null,
      state: profile?.state || null,
      pincode: profile?.pincode || null,
    }

    return Object.keys(currentValues).some((key) => currentValues[key] !== savedValues[key])
  }, [form, profile])
  const hasChanges = hasFormChanges || hasPendingDocumentChanges
  const isSubmitReady = hasChanges && isProfileComplete && hasAllRequiredDocuments && !saving
  const isReadOnly = !isEditMode
  const inputDisabled = saving || isReadOnly

  const handleEnableEdit = useCallback(() => {
    setSaveError('')
    setFieldErrors({})
    setHasManualModeChange(true)
    setIsEditMode(true)
  }, [])

  const handleCancelEdit = useCallback(() => {
    if (profile) {
      hydrateFromProfile(profile)
    }
    setDirty(false)
    setSaveError('')
    setFieldErrors({})
    setHasManualModeChange(true)
    setIsEditMode(false)
  }, [hydrateFromProfile, profile])

  const uploadDoc = useCallback(async (file, documentType) => {
    if (!file) return null
    if (!user?.id) return null

    try {
      const { data, error } = await uploadProfileDocument({
        bucket: DOCS_BUCKET,
        user,
        file,
        documentType,
      })
      if (error) throw error
      return data
    } catch (uploadError) {
      throw uploadError
    }
  }, [DOCS_BUCKET, user])

  const aadhaarInputRef = useRef(null)
  const panInputRef = useRef(null)
  const photoInputRef = useRef(null)

  const openDocument = useCallback(
    async (path, openingKey) => {
      if (!path) return

      setSaveError('')
      setDocOpening((prev) => ({ ...prev, [openingKey]: true }))
      try {
        const { data: signedUrl, error } = await createProfileDocumentSignedUrl({
          bucket: DOCS_BUCKET,
          path,
          expiresIn: SIGNED_URL_TTL_SECONDS,
        })
        if (error) throw error

        if (!signedUrl) throw new Error('Could not create a signed URL for this document.')
        window.open(signedUrl, '_blank', 'noopener,noreferrer')
      } catch (err) {
        setSaveError('Something went wrong. Please try again.')
      } finally {
        setDocOpening((prev) => ({ ...prev, [openingKey]: false }))
      }
    },
    [DOCS_BUCKET],
  )

  const handleDocSelect = useCallback(
    (docKey) => async (e) => {
      const file = e?.target?.files?.[0] ?? null
      if (!file) return

      setSaveError('')

      if (file.size > MAX_FILE_BYTES) {
        setSaveError('File must be less than 10 MB.')
        e.target.value = ''
        return
      }

      const okType =
        file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/jpg'
      if (!okType) {
        setSaveError('Only PDF or JPEG files are allowed.')
        e.target.value = ''
        return
      }

      setDirty(true)
      setPendingDocs((prev) => ({ ...prev, [docKey]: file }))
      e.target.value = ''
    },
    [MAX_FILE_BYTES],
  )

  const handleSave = useCallback(async () => {
    if (!user?.id) return false
    if (saving) return false

    setSaving(true)
    setSaveError('')
    try {
      const normalizedFullName = String(form.full_name || '').trim()
      const nextDocUrls = { ...docUrls }

      const uploadPlan = [
        { docKey: 'aadhaar_img_url', documentType: 'aadhaar', uploadingKey: 'aadhaar' },
        { docKey: 'pan_img_url', documentType: 'pan', uploadingKey: 'pan' },
        { docKey: 'passport_photo_url', documentType: 'photo', uploadingKey: 'photo' },
      ]

      for (const item of uploadPlan) {
        const file = pendingDocs[item.docKey]
        if (!file) continue

        try {
          const path = await uploadDoc(file, item.documentType)
          nextDocUrls[item.docKey] = path
        } catch (error) {
          throw error
        }
      }

      const payload = {
        full_name: normalizedFullName,
        contact_no: form.contact_no ?? '',
        alternate_contact_no: form.alternate_contact_no || null,
        occupation: form.occupation || null,

        aadhaar_number: form.aadhaar_number || null,
        pan_number: form.pan_number || null,

        aadhaar_img_url: nextDocUrls.aadhaar_img_url || null,
        pan_img_url: nextDocUrls.pan_img_url || null,
        passport_photo_url: nextDocUrls.passport_photo_url || null,

        full_address: form.full_address || null,
        district: form.district || null,
        state: form.state || null,
        pincode: form.pincode || null,

        is_profile_complete: isProfileComplete,
      }

      const { error: updateError } = await updateProfileById(user.id, payload)
      if (updateError) throw updateError

      setDocUrls(nextDocUrls)
      setPendingDocs({
        aadhaar_img_url: null,
        pan_img_url: null,
        passport_photo_url: null,
      })
      setDirty(false)
      setHasManualModeChange(true)
      await refreshProfile?.()
      setIsEditMode(false)
      return true
    } catch (err) {
      setSaveError('Something went wrong. Please try again.')
      return false
    } finally {
      setSaving(false)
    }
  }, [
    docUrls,
    form,
    isProfileComplete,
    pendingDocs,
    refreshProfile,
    saving,
    uploadDoc,
    user,
  ])

  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  useEffect(() => {
    const onDocumentClickCapture = (event) => {
      if (!dirty) return
      const target = event.target instanceof Element ? event.target : null
      const anchor = target?.closest?.('a[href]')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return
      if (href.startsWith('#')) return
      if (anchor.getAttribute('target') === '_blank') return

      event.preventDefault()
      const ok = window.confirm('You have unsaved changes. Click OK to save and leave, or Cancel to stay.')
      if (!ok) return

      void (async () => {
        const saved = await handleSave()
        if (saved) {
          window.location.href = href
        }
      })()
    }

    document.addEventListener('click', onDocumentClickCapture, true)
    return () => document.removeEventListener('click', onDocumentClickCapture, true)
  }, [dirty, handleSave])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveError('')

    const keysToValidate = [
      'full_name',
      'contact_no',
      'occupation',
      'aadhaar_number',
      'pan_number',
      'full_address',
      'state',
      'district',
      'pincode',
    ]

    const nextErrors = {}
    for (const k of keysToValidate) {
      const msg = validateField(k, form[k], form)
      if (msg) nextErrors[k] = msg
    }
    setFieldErrors((prev) => ({ ...prev, ...nextErrors }))

    if (Object.keys(nextErrors).length > 0) {
      setSaveError('Please fill all required fields and upload all required documents.')
      formRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
      return
    }

    await handleSave()
  }

  if (loading) {
    return <LoadingOverlay open variant="page" message="Loading profile" />
  }

  return (
    <div className="relative py-6 md:py-8 print:p-0">
      <LoadingOverlay open={saving} message="Uploading and Saving your profile" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 print:max-w-none print:px-0">
        <div className="mx-auto w-full max-w-5xl space-y-6 print:max-w-none">
          <div className="print:hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight text-left">Profile</h1>
                <p className="text-muted-foreground mt-2">
                  Fill the form below to complete your profile. Accurate information helps us provide better service and support. You can update these details anytime.
                </p>
              </div>
              {isEditMode ? (
                <Button type="button" variant="outline" className="gap-2 shrink-0" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 shrink-0 hover:bg-transparent hover:text-foreground"
                  onClick={handleEnableEdit}
                >
                  <PencilLine className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 print:hidden">
              {String(error)}
            </div>
          ) : null}
          {saveError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 print:hidden">
              {saveError}
            </div>
          ) : null}

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-10"
          >
          <section className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                <User className="h-5 w-5 text-action" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Personal info</h2>
              <p className="text-sm text-muted-foreground">Basic details used for your application.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-3">
                <FieldLabel required>Email address</FieldLabel>
                <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground">
                  {email || profile?.email || '—'}
                </div>
              </div>
              <div className="lg:col-span-3">
                <FieldLabel required>Full name</FieldLabel>
                <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground">
                  {form.full_name || '—'}
                </div>
              </div>
              <div>
                <FieldLabel required>Mobile number</FieldLabel>
                <IconInput
                  name="contact_no"
                  icon={Phone}
                  value={form.contact_no}
                  onChange={handleFieldChange}
                  placeholder="10-digit mobile"
                  required
                  disabled={inputDisabled}
                  inputMode="tel"
                  autoComplete="tel"
                />
                {fieldErrors.contact_no ? (
                  <p className="mt-2 text-xs text-red-600">{fieldErrors.contact_no}</p>
                ) : null}
              </div>
              <div>
                <FieldLabel>Alternate mobile</FieldLabel>
                <IconInput
                  name="alternate_contact_no"
                  icon={Phone}
                  value={form.alternate_contact_no}
                  onChange={handleFieldChange}
                  placeholder="10-digit mobile"
                  disabled={inputDisabled}
                  inputMode="tel"
                  autoComplete="tel"
                />
                {fieldErrors.alternate_contact_no ? (
                  <p className="mt-2 text-xs text-red-600">{fieldErrors.alternate_contact_no}</p>
                ) : null}
              </div>
              <div className="md:col-span-2 lg:col-span-2">
                <FieldLabel required>Occupation</FieldLabel>
                <IconInput
                  name="occupation"
                  icon={Briefcase}
                  value={form.occupation}
                  onChange={handleFieldChange}
                  placeholder="Occupation"
                  required
                  disabled={inputDisabled}
                  autoComplete="organization-title"
                />
                {fieldErrors.occupation ? (
                  <p className="mt-2 text-xs text-red-600">{fieldErrors.occupation}</p>
                ) : null}
              </div>
            </div>
          </section>

          <div className="h-px bg-border" aria-hidden />

          <section className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                <IdCard className="h-5 w-5 text-action" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Identity</h2>
              <p className="text-sm text-muted-foreground">Aadhaar and PAN are used for KYC verification.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel required>Aadhaar number</FieldLabel>
                <IconInput
                  name="aadhaar_number"
                  icon={IdCard}
                  value={form.aadhaar_number}
                  onChange={handleFieldChange}
                  placeholder="12-digit Aadhaar"
                  required
                  disabled={inputDisabled}
                  inputMode="numeric"
                />
                {fieldErrors.aadhaar_number ? (
                  <p className="mt-2 text-xs text-red-600">{fieldErrors.aadhaar_number}</p>
                ) : null}
              </div>
              <div>
                <FieldLabel required>PAN number</FieldLabel>
                <IconInput
                  name="pan_number"
                  icon={CreditCard}
                  value={form.pan_number}
                  onChange={handleFieldChange}
                  placeholder="ABCDE1234F"
                  required
                  disabled={inputDisabled}
                  autoComplete="off"
                />
                {fieldErrors.pan_number ? (
                  <p className="mt-2 text-xs text-red-600">{fieldErrors.pan_number}</p>
                ) : null}
              </div>
            </div>
          </section>

          <div className="h-px bg-border" aria-hidden />

          <section className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                <MapPin className="h-5 w-5 text-action" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Address</h2>
              <p className="text-sm text-muted-foreground">Used for correspondence and verification.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FieldLabel required>Full address</FieldLabel>
                <IconInput
                  name="full_address"
                  icon={MapPin}
                  value={form.full_address}
                  onChange={handleFieldChange}
                  placeholder="House no, street, area..."
                  required
                  disabled={inputDisabled}
                  autoComplete="street-address"
                />
                {fieldErrors.full_address ? (
                  <p className="mt-2 text-xs text-red-600">{fieldErrors.full_address}</p>
                ) : null}
              </div>
              <div>
                <FieldLabel required>State</FieldLabel>
                {isReadOnly ? (
                  <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground">
                    {form.state || '—'}
                  </div>
                ) : (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground z-10" />
                    <Select value={form.state || ''} onValueChange={handleStateChange} disabled={inputDisabled}>
                      <SelectTrigger className="w-full pl-10">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES.map((st) => (
                          <SelectItem key={st} value={st}>
                            {st}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {fieldErrors.state ? <p className="mt-2 text-xs text-red-600">{fieldErrors.state}</p> : null}
              </div>
              <div>
                <FieldLabel required>District</FieldLabel>
                {isReadOnly ? (
                  <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground">
                    {form.district || '—'}
                  </div>
                ) : (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground z-10" />
                    <Select
                      value={form.district || ''}
                      onValueChange={handleDistrictChange}
                      disabled={inputDisabled || !form.state}
                    >
                      <SelectTrigger className="w-full pl-10">
                        <SelectValue placeholder={form.state ? 'Select district' : 'Select state first'} />
                      </SelectTrigger>
                      <SelectContent>
                        {(DISTRICTS_BY_STATE.get(form.state) || []).map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {fieldErrors.district ? <p className="mt-2 text-xs text-red-600">{fieldErrors.district}</p> : null}
              </div>
              <div className="max-w-xs">
                <FieldLabel required>Pincode</FieldLabel>
                <IconInput
                  name="pincode"
                  icon={Hash}
                  value={form.pincode}
                  onChange={handleFieldChange}
                  placeholder="Pincode"
                  required
                  disabled={inputDisabled}
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
                {fieldErrors.pincode ? <p className="mt-2 text-xs text-red-600">{fieldErrors.pincode}</p> : null}
              </div>
            </div>
          </section>

          <div className="h-px bg-border" aria-hidden />

          <section className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                <FileText className="h-5 w-5 text-action" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Documents</h2>
              <p className="text-sm text-muted-foreground">Upload PDF/JPEG files (max 10 MB each).</p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-foreground">Aadhaar Card *</p>
                    <div className="shrink-0 flex items-center gap-2">
                      {isReadOnly && docUrls.aadhaar_img_url ? (
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2"
                          onClick={() => openDocument(docUrls.aadhaar_img_url, 'aadhaar')}
                          disabled={docOpening.aadhaar}
                        >
                          <ExternalLink className="h-4 w-4" />
                          {docOpening.aadhaar ? 'Opening…' : 'View'}
                        </Button>
                      ) : null}
                      <input
                        ref={aadhaarInputRef}
                        type="file"
                        accept="application/pdf,image/jpeg"
                        className="hidden"
                        onChange={handleDocSelect('aadhaar_img_url')}
                        disabled={inputDisabled}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => aadhaarInputRef.current?.click?.()}
                        disabled={inputDisabled}
                      >
                        <Upload className="h-4 w-4" />
                        {docUrls.aadhaar_img_url ? 'Replace' : 'Upload'}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 min-h-5">
                    {pendingDocs.aadhaar_img_url ? (
                      <p className="inline-flex items-center gap-2 text-xs text-amber-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="truncate" title={pendingDocs.aadhaar_img_url.name}>
                          {pendingDocs.aadhaar_img_url.name}{' '}
                          {docUrls.aadhaar_img_url ? 'queued to replace current document' : 'queued for upload'}
                        </span>
                      </p>
                    ) : docUrls.aadhaar_img_url ? (
                      <p className="inline-flex items-center gap-2 text-xs text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="truncate" title={docUrls.aadhaar_img_url}>
                          {getFilenameFromUrl(docUrls.aadhaar_img_url) || 'Uploaded'}
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">No file uploaded</p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-foreground">PAN Card *</p>
                    <div className="shrink-0 flex items-center gap-2">
                      {isReadOnly && docUrls.pan_img_url ? (
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2"
                          onClick={() => openDocument(docUrls.pan_img_url, 'pan')}
                          disabled={docOpening.pan}
                        >
                          <ExternalLink className="h-4 w-4" />
                          {docOpening.pan ? 'Opening…' : 'View'}
                        </Button>
                      ) : null}
                      <input
                        ref={panInputRef}
                        type="file"
                        accept="application/pdf,image/jpeg"
                        className="hidden"
                        onChange={handleDocSelect('pan_img_url')}
                        disabled={inputDisabled}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => panInputRef.current?.click?.()}
                        disabled={inputDisabled}
                      >
                        <Upload className="h-4 w-4" />
                        {docUrls.pan_img_url ? 'Replace' : 'Upload'}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 min-h-5">
                    {pendingDocs.pan_img_url ? (
                      <p className="inline-flex items-center gap-2 text-xs text-amber-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="truncate" title={pendingDocs.pan_img_url.name}>
                          {pendingDocs.pan_img_url.name}{' '}
                          {docUrls.pan_img_url ? 'queued to replace current document' : 'queued for upload'}
                        </span>
                      </p>
                    ) : docUrls.pan_img_url ? (
                      <p className="inline-flex items-center gap-2 text-xs text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="truncate" title={docUrls.pan_img_url}>
                          {getFilenameFromUrl(docUrls.pan_img_url) || 'Uploaded'}
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">No file uploaded</p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-foreground">Photo *</p>
                    <div className="shrink-0 flex items-center gap-2">
                      {isReadOnly && docUrls.passport_photo_url ? (
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2"
                          onClick={() => openDocument(docUrls.passport_photo_url, 'photo')}
                          disabled={docOpening.photo}
                        >
                          <ExternalLink className="h-4 w-4" />
                          {docOpening.photo ? 'Opening…' : 'View'}
                        </Button>
                      ) : null}
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="application/pdf,image/jpeg"
                        className="hidden"
                        onChange={handleDocSelect('passport_photo_url')}
                        disabled={inputDisabled}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => photoInputRef.current?.click?.()}
                        disabled={inputDisabled}
                      >
                        <Upload className="h-4 w-4" />
                        {docUrls.passport_photo_url ? 'Replace' : 'Upload'}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 min-h-5">
                    {pendingDocs.passport_photo_url ? (
                      <p className="inline-flex items-center gap-2 text-xs text-amber-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="truncate" title={pendingDocs.passport_photo_url.name}>
                          {pendingDocs.passport_photo_url.name}{' '}
                          {docUrls.passport_photo_url ? 'queued to replace current document' : 'queued for upload'}
                        </span>
                      </p>
                    ) : docUrls.passport_photo_url ? (
                      <p className="inline-flex items-center gap-2 text-xs text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="truncate" title={docUrls.passport_photo_url}>
                          {getFilenameFromUrl(docUrls.passport_photo_url) || 'Uploaded'}
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">No file uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {!isReadOnly ? (
            <>
              <div className="h-px bg-border print:hidden" aria-hidden />

              <div className="flex flex-col items-end gap-2 print:hidden">
                {!isSubmitReady ? (
                  <p className="text-xs text-muted-foreground">
                    {hasChanges
                      ? 'Fill all required fields and upload Aadhaar, PAN, and Photo to enable Submit.'
                      : 'Make a change to your profile or documents to enable Submit.'}
                  </p>
                ) : null}
                <Button type="submit" disabled={!isSubmitReady} className="gap-2">
                  <Upload className="h-4 w-4" />
                  {saving ? 'Uploading and Saving...' : 'Submit'}
                </Button>
              </div>
            </>
          ) : null}
        </form>
        </div>
      </div>
    </div>
  )
}
