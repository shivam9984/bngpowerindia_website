'use client'

import { createApplicationDetailApi } from './detail-table'

const api = createApplicationDetailApi('ev_charging_application_details')

export const listEvChargingApplicationDetailsByApplicationIds = api.listByApplicationIds
export const getEvChargingApplicationDetailsByApplicationId = api.getByApplicationId
export const createEvChargingApplicationDetails = api.createForApplication
export const updateEvChargingApplicationDetailsByApplicationId = api.updateByApplicationId
export const deleteEvChargingApplicationDetailsByApplicationId = api.deleteByApplicationId
