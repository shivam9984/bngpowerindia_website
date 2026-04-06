'use client'

import { createApplicationDetailApi } from './detail-table'

const api = createApplicationDetailApi('cbg_plant_application_details')

export const listCbgPlantApplicationDetailsByApplicationIds = api.listByApplicationIds
export const getCbgPlantApplicationDetailsByApplicationId = api.getByApplicationId
export const createCbgPlantApplicationDetails = api.createForApplication
export const updateCbgPlantApplicationDetailsByApplicationId = api.updateByApplicationId
export const deleteCbgPlantApplicationDetailsByApplicationId = api.deleteByApplicationId
