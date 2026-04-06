'use client'

import { createApplicationDetailApi } from './detail-table'

const api = createApplicationDetailApi('fuel_station_application_details')

export const listFuelStationApplicationDetailsByApplicationIds = api.listByApplicationIds
export const getFuelStationApplicationDetailsByApplicationId = api.getByApplicationId
export const createFuelStationApplicationDetails = api.createForApplication
export const updateFuelStationApplicationDetailsByApplicationId = api.updateByApplicationId
export const deleteFuelStationApplicationDetailsByApplicationId = api.deleteByApplicationId
