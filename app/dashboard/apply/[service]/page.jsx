'use client'

import { use, useMemo } from 'react'
import { getServiceConfigFromSlug } from '@/lib/applications/config'
import { ServiceApplicationPage } from '../service-application-page'

export default function ApplyServicePage({ params }) {
  const resolvedParams = use(params)
  const serviceSlug = Array.isArray(resolvedParams?.service)
    ? resolvedParams.service[0]
    : resolvedParams?.service
  const service = useMemo(() => getServiceConfigFromSlug(serviceSlug), [serviceSlug])

  if (!service?.key) {
    return null
  }

  return <ServiceApplicationPage serviceKey={service.key} />
}
