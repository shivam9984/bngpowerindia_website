const APPLICATION_SERVICES = {
  fuel_station: {
    key: 'fuel_station',
    slug: 'fuel-station',
    label: 'Fuel Station',
    detailTable: 'fuel_station_application_details',
    serviceDetails: {
      title: 'Fuel station details',
      description: 'Share a few project specifics to help us prepare the right checklist.',
      fields: [
        {
          name: 'fuel_company_name',
          label: 'Fuel company name',
          type: 'select',
          required: true,
          placeholder: 'Select fuel company',
          options: ['HPCL-Mittal Energy', 'Nayara Energy', 'Eco Bharat Bio fuel'],
        },
        {
          name: 'land_type',
          label: 'Land type',
          type: 'select',
          required: true,
          placeholder: 'Select land type',
          options: ['Owned', 'Leased', 'Rented', 'Under process', 'Not sure'],
        },
        {
          name: 'rear_depth_mt',
          label: 'Rear depth (m)',
          type: 'number',
          required: true,
          placeholder: 'e.g. 45.50',
          inputMode: 'decimal',
          step: '0.01',
          validation: 'decimal_2',
        },
        {
          name: 'front_width_mt',
          label: 'Front width (m)',
          type: 'number',
          required: true,
          placeholder: 'e.g. 25.00',
          inputMode: 'decimal',
          step: '0.01',
          validation: 'decimal_2',
        },
        {
          name: 'lhs_depth_mt',
          label: 'LHS depth (m)',
          type: 'number',
          required: false,
          placeholder: 'e.g. 30.00',
          inputMode: 'decimal',
          step: '0.01',
          validation: 'decimal_2',
        },
        {
          name: 'rhs_depth_mt',
          label: 'RHS depth (m)',
          type: 'number',
          required: false,
          placeholder: 'e.g. 30.00',
          inputMode: 'decimal',
          step: '0.01',
          validation: 'decimal_2',
        },
        {
          name: 'khasra_no',
          label: 'Khasra number',
          type: 'text',
          required: true,
          placeholder: 'Enter khasra no',
        },
        {
          name: 'road_type',
          label: 'Road type',
          type: 'select',
          required: true,
          placeholder: 'Select road type',
          options: ['National Highway', 'State Highway', 'City Road', 'Rural Road', 'Other'],
        },
        {
          name: 'road_width_mt',
          label: 'Road width (m)',
          type: 'number',
          required: true,
          placeholder: 'e.g. 12.00',
          inputMode: 'decimal',
          step: '0.01',
          validation: 'decimal_2',
        },
      ],
    },
  },
  cbg_plant: {
    key: 'cbg_plant',
    slug: 'cbg-plant',
    label: 'CBG Plant',
    detailTable: 'cbg_plant_application_details',
    serviceDetails: {
      title: 'CBG plant details',
      description: 'This helps us estimate feasibility, capex and timelines.',
      fields: [
        {
          name: 'feedstock',
          label: 'Feedstock',
          type: 'select',
          required: true,
          placeholder: 'Select feedstock',
          options: ['Press mud', 'Cattle dung', 'Agri residue', 'MSW', 'Other'],
        },
        {
          name: 'capacity_tpd',
          label: 'Capacity (TPD)',
          type: 'text',
          required: true,
          placeholder: 'e.g. 100',
          inputMode: 'numeric',
          validation: 'integer',
        },
        {
          name: 'land_area_acres',
          label: 'Land area (acres)',
          type: 'text',
          required: true,
          placeholder: 'e.g. 3',
          inputMode: 'decimal',
          validation: 'decimal',
        },
        {
          name: 'offtake',
          label: 'Offtake',
          type: 'select',
          required: true,
          placeholder: 'Select offtake',
          options: ['OMC', 'Industrial', 'Both', 'Not sure'],
        },
      ],
    },
  },
  biodiesel: {
    key: 'biodiesel',
    slug: 'biodiesel',
    label: 'Biodiesel Plant',
    detailTable: 'biodiesel_application_details',
    serviceDetails: {
      title: 'Biodiesel plant details',
      description: 'A few details help us plan the right setup and compliance path.',
      fields: [
        {
          name: 'biodiesel_feedstock',
          label: 'Feedstock',
          type: 'select',
          required: true,
          placeholder: 'Select feedstock',
          options: ['UCO', 'Non-edible oil', 'Tallow', 'Other'],
        },
        {
          name: 'capacity_kld',
          label: 'Capacity (KLD)',
          type: 'text',
          required: true,
          placeholder: 'e.g. 10',
          inputMode: 'numeric',
          validation: 'integer',
        },
        {
          name: 'plant_model',
          label: 'Engagement type',
          type: 'select',
          required: true,
          placeholder: 'Select engagement type',
          options: ['Turnkey EPC', 'Consultancy', 'Not sure'],
        },
        {
          name: 'quality_standard',
          label: 'Quality standard',
          type: 'select',
          required: true,
          placeholder: 'Select standard',
          options: ['BIS/IS', 'ASTM', 'Not sure'],
        },
      ],
    },
  },
  ev_charging_station: {
    key: 'ev_charging_station',
    slug: 'ev-charging-station',
    label: 'EV Charging Station',
    detailTable: 'ev_charging_application_details',
    serviceDetails: {
      title: 'EV charging station details',
      description: 'This helps us estimate power, equipment and approvals.',
      fields: [
        {
          name: 'charger_type',
          label: 'Charger type',
          type: 'select',
          required: true,
          placeholder: 'Select charger type',
          options: ['AC', 'DC', 'Both', 'Not sure'],
        },
        {
          name: 'ports_count',
          label: 'Number of ports',
          type: 'text',
          required: true,
          placeholder: 'e.g. 4',
          inputMode: 'numeric',
          validation: 'integer',
        },
        {
          name: 'power_sanction_kw',
          label: 'Power sanction (kW)',
          type: 'text',
          required: true,
          placeholder: 'e.g. 120',
          inputMode: 'numeric',
          validation: 'integer',
        },
        {
          name: 'site_type',
          label: 'Site type',
          type: 'select',
          required: true,
          placeholder: 'Select site type',
          options: ['Commercial', 'Highway', 'Residential', 'Parking', 'Other'],
        },
      ],
    },
  },
}

export const SERVICE_DEFINITIONS = Object.values(APPLICATION_SERVICES).map(
  ({ key, slug, label }) => ({
    key,
    slug,
    label,
  }),
)

export function getServiceConfig(serviceKey) {
  return APPLICATION_SERVICES[serviceKey] ?? null
}

export function getServiceConfigFromSlug(slug) {
  return Object.values(APPLICATION_SERVICES).find((service) => service.slug === slug) ?? null
}

export function getServiceFromSlug(slug) {
  const service = getServiceConfigFromSlug(slug)
  if (!service) return null

  return {
    key: service.key,
    slug: service.slug,
    label: service.label,
  }
}

export function getDetailTableConfig(serviceKey) {
  const service = getServiceConfig(serviceKey)
  if (!service) return null

  const fields = service.serviceDetails?.fields || []
  return {
    table: service.detailTable,
    fields: fields.map((field) => field.name),
    numericFields: fields
      .filter((field) => ['integer', 'decimal', 'decimal_2'].includes(field.validation))
      .map((field) => field.name),
  }
}
