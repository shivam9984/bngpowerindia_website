'use client'

import {
  createApplication as createApplicationRow,
  deleteApplicationById,
  listApplications,
} from '@/lib/api/applications'
import {
  listApplicationPaymentsByApplicationIds,
} from '@/lib/api/application-payments'
import {
  createBiodieselApplicationDetails,
  listBiodieselApplicationDetailsByApplicationIds,
} from '@/lib/api/biodiesel-application-details'
import {
  createCbgPlantApplicationDetails,
  listCbgPlantApplicationDetailsByApplicationIds,
} from '@/lib/api/cbg-plant-application-details'
import {
  createEvChargingApplicationDetails,
  listEvChargingApplicationDetailsByApplicationIds,
} from '@/lib/api/ev-charging-application-details'
import {
  createFuelStationApplicationDetails,
  listFuelStationApplicationDetailsByApplicationIds,
} from '@/lib/api/fuel-station-application-details'
import { listProfilesByIds } from '@/lib/api/profiles'
import { getDetailTableConfig, SERVICE_DEFINITIONS } from '@/lib/applications/config'

function toNullableText(value) {
  const nextValue = String(value ?? '').trim()
  return nextValue ? nextValue : null
}

function toRequiredText(value, fallback = '') {
  const nextValue = String(value ?? '').trim()
  return nextValue || fallback
}

function toNullableNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const nextValue = Number(value)
  return Number.isFinite(nextValue) ? nextValue : null
}

function maskAadhaar(value) {
  const digits = String(value || '').replace(/\D+/g, '')
  if (digits.length !== 12) return ''
  return `XXXX-XXXX-${digits.slice(-4)}`
}

function maskPan(value) {
  const nextValue = String(value || '').trim().toUpperCase()
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(nextValue)) return ''
  return `${nextValue.slice(0, 2)}XXX${nextValue.slice(5, 9)}${nextValue.slice(-1)}`
}

function toApplicationError(message, metadata = {}) {
  const error = new Error(message)
  Object.assign(error, metadata)
  return error
}

function withSupabaseErrorContext(error, step, fallbackMessage) {
  if (!error) {
    return toApplicationError(fallbackMessage, { step })
  }

  return toApplicationError(error.message || fallbackMessage, {
    code: error.code,
    details: error.details,
    hint: error.hint,
    step,
    cause: error,
  })
}

function buildProfileSnapshot(profile) {
  return {
    user_id: profile?.id ?? null,
    email: profile?.email ?? null,
    full_name: profile?.full_name || null,
    contact_no: profile?.contact_no ?? null,
    alternate_contact_no: profile?.alternate_contact_no ?? null,
    occupation: profile?.occupation ?? null,
    aadhaar_number_masked: maskAadhaar(profile?.aadhaar_number) || null,
    pan_number_masked: maskPan(profile?.pan_number) || null,
    address: {
      full_address: profile?.full_address ?? null,
      district: profile?.district ?? null,
      state: profile?.state ?? null,
      pincode: profile?.pincode ?? null,
    },
    documents: {
      aadhaar_img_url: profile?.aadhaar_img_url ?? null,
      aadhaar_back_img_url: profile?.aadhaar_back_img_url ?? null,
      pan_img_url: profile?.pan_img_url ?? null,
      passport_photo_url: profile?.passport_photo_url ?? null,
    },
  }
}

function buildRemarksValue(remarks) {
  if (typeof remarks === 'string') {
    const nextValue = toNullableText(remarks)
    return nextValue ? { notes: nextValue } : null
  }

  if (!remarks || typeof remarks !== 'object' || Array.isArray(remarks)) {
    return null
  }

  const normalized = Object.entries(remarks).reduce((acc, [key, value]) => {
    const normalizedKey = String(key || '').trim()
    if (!normalizedKey) return acc

    if (typeof value === 'string') {
      const nextValue = toNullableText(value)
      if (nextValue) acc[normalizedKey] = nextValue
      return acc
    }

    if (value !== undefined) {
      acc[normalizedKey] = value
    }

    return acc
  }, {})

  return Object.keys(normalized).length > 0 ? normalized : null
}

function extractRemarks(row) {
  const remarks = row?.Remarks
  if (!remarks || typeof remarks !== 'object' || Array.isArray(remarks)) {
    return null
  }

  return remarks
}

function pickLatestPaymentStatus(paymentRows) {
  const map = new Map()
  for (const row of paymentRows || []) {
    const applicationId = row?.application_id
    if (!applicationId || map.has(applicationId)) continue
    const nextStatus = String(row?.payment_status || 'unpaid').toLowerCase()
    map.set(applicationId, nextStatus === 'success' ? 'paid' : nextStatus)
  }
  return map
}

function normalizeApplication(row, detailById, paymentStatusById, profileByUserId) {
  const detail = detailById.get(row.id) || {}
  const profile = profileByUserId.get(row?.applicant_user_id) || null
  const profileSnapshot = buildProfileSnapshot(profile)
  const remarks = extractRemarks(row)
  const submittedByEmail = profile?.email || null

  return {
    id: row?.id,
    serviceKey: row?.service_key,
    serviceLabel: row?.service_label,
    status: row?.status || 'submitted',
    paymentStatus: paymentStatusById.get(row?.id) || 'unpaid',
    submittedAt: row?.created_at || null,
    submittedByUserId: row?.applicant_user_id || null,
    submittedByName: profile?.full_name || null,
    submittedByEmail,
    payload: {
      profile_snapshot: profileSnapshot,
      state: row?.state || '',
      district: row?.district || '',
      subdistrict_tehsil: row?.subdistrict_tehsil || '',
      pincode: row?.pincode || '',
      full_address: row?.full_address || '',
      google_maps_pin: row?.google_maps_pin || '',
      landmark: row?.landmark || '',
      remarks,
      notes: remarks?.notes || '',
      email: submittedByEmail,
      ...detail,
    },
  }
}

function buildApplicationRecord({ serviceKey, serviceLabel, payload, applicantUserId }) {
  return {
    applicant_user_id: applicantUserId,
    service_key: serviceKey,
    service_label: serviceLabel,
    status: 'submitted',
    state: toRequiredText(payload?.state),
    district: toRequiredText(payload?.district),
    subdistrict_tehsil: toRequiredText(payload?.subdistrict_tehsil),
    pincode: toRequiredText(payload?.pincode),
    full_address: toRequiredText(payload?.full_address),
    google_maps_pin: toNullableText(payload?.google_maps_pin),
    landmark: toNullableText(payload?.landmark),
    Remarks: buildRemarksValue(payload?.remarks ?? payload?.notes),
  }
}

function buildDetailRecord(serviceKey, applicationId, payload) {
  const config = getDetailTableConfig(serviceKey)
  if (!config) return null

  const values = { application_id: applicationId }
  for (const field of config.fields) {
    if (config.numericFields.includes(field)) {
      values[field] = toNullableNumber(payload?.[field])
      continue
    }
    values[field] = toRequiredText(payload?.[field])
  }

  return values
}

const DETAIL_READERS = {
  fuel_station: listFuelStationApplicationDetailsByApplicationIds,
  cbg_plant: listCbgPlantApplicationDetailsByApplicationIds,
  biodiesel: listBiodieselApplicationDetailsByApplicationIds,
  ev_charging_station: listEvChargingApplicationDetailsByApplicationIds,
}

const DETAIL_CREATORS = {
  fuel_station: createFuelStationApplicationDetails,
  cbg_plant: createCbgPlantApplicationDetails,
  biodiesel: createBiodieselApplicationDetails,
  ev_charging_station: createEvChargingApplicationDetails,
}

export async function fetchApplications() {
  const { data: applications, error: applicationsError } = await listApplications()
  if (applicationsError) {
    return { data: [], error: applicationsError }
  }

  if (!applications.length) {
    return { data: [], error: null }
  }

  const profileResult = listProfilesByIds(
    applications.map((row) => row?.applicant_user_id),
  )
  const paymentResult = listApplicationPaymentsByApplicationIds(
    applications.map((row) => row?.id),
    'application_id, payment_status, created_at',
  )
  const detailResults = Promise.all(
    SERVICE_DEFINITIONS.map(async ({ key }) => {
      const reader = DETAIL_READERS[key]
      const ids = applications
        .filter((row) => row?.service_key === key)
        .map((row) => row.id)

      if (!reader || !ids.length) {
        return [key, { data: [], error: null }]
      }

      return [key, await reader(ids)]
    }),
  )

  const [
    { data: profileRows, error: profileError },
    { data: paymentRows, error: paymentError },
    detailRows,
  ] = await Promise.all([profileResult, paymentResult, detailResults])

  if (profileError) {
    return { data: [], error: profileError }
  }

  if (paymentError) {
    return { data: [], error: paymentError }
  }

  const detailById = new Map()
  for (const [, result] of detailRows) {
    if (result?.error) {
      return { data: [], error: result.error }
    }

    for (const row of result?.data || []) {
      if (!row?.application_id) continue
      const { application_id, created_at, updated_at, ...detail } = row
      detailById.set(application_id, detail)
    }
  }

  const profileByUserId = new Map(
    (profileRows || [])
      .filter((row) => row?.id)
      .map((row) => [row.id, row]),
  )
  const paymentStatusById = pickLatestPaymentStatus(paymentRows)

  return {
    data: applications.map((row) =>
      normalizeApplication(row, detailById, paymentStatusById, profileByUserId),
    ),
    error: null,
  }
}

export async function createApplication({ serviceKey, serviceLabel, payload, applicantUserId }) {
  if (!applicantUserId) {
    return {
      data: null,
      error: toApplicationError('Please sign in and try again.', { step: 'auth' }),
    }
  }

  const applicationRecord = buildApplicationRecord({
    serviceKey,
    serviceLabel,
    payload,
    applicantUserId,
  })
  const { data: createdApplication, error: applicationError } = await createApplicationRow(
    applicationRecord,
    { returnSingle: true, columns: 'id' },
  )

  if (applicationError) {
    return {
      data: null,
      error: withSupabaseErrorContext(
        applicationError,
        'application_insert',
        'Could not create application.',
      ),
    }
  }

  const detailRecord = buildDetailRecord(serviceKey, createdApplication.id, payload)
  const createDetail = DETAIL_CREATORS[serviceKey]

  if (detailRecord && createDetail) {
    const { error: detailError } = await createDetail(detailRecord)

    if (detailError) {
      await deleteApplicationById(createdApplication.id)
      return {
        data: null,
        error: withSupabaseErrorContext(
          detailError,
          'detail_insert',
          'Could not save service details.',
        ),
      }
    }
  }

  return { data: createdApplication, error: null }
}
