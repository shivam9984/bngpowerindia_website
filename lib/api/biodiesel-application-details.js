'use client'

import { createApplicationDetailApi } from './detail-table'

const api = createApplicationDetailApi('biodiesel_application_details')

export const listBiodieselApplicationDetailsByApplicationIds = api.listByApplicationIds
export const getBiodieselApplicationDetailsByApplicationId = api.getByApplicationId
export const createBiodieselApplicationDetails = api.createForApplication
export const updateBiodieselApplicationDetailsByApplicationId = api.updateByApplicationId
export const deleteBiodieselApplicationDetailsByApplicationId = api.deleteByApplicationId
