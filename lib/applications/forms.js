import { getServiceConfig } from './config'

export const COMMON_APPLICATION_FORM_DEFAULTS = {
  state: '',
  district: '',
  subdistrict_tehsil: '',
  pincode: '',
  full_address: '',
  google_maps_pin: '',
  landmark: '',
  notes: '',
}

export function buildInitialApplicationForm(serviceKey) {
  const service = getServiceConfig(serviceKey)
  const form = { ...COMMON_APPLICATION_FORM_DEFAULTS }

  for (const field of service?.serviceDetails?.fields || []) {
    form[field.name] = ''
  }

  return form
}
