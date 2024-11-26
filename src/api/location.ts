import { LocationType } from "@/interfaces/context.interface"
import axios from "./axios"

// Métodos genéricos
const getRequest = async (endpoint: string) => axios.get(endpoint)
const postRequest = async (endpoint: string, data: object) => axios.post(endpoint, data)
const putRequest = async (endpoint: string, data: object) => axios.put(endpoint, data)
const deleteRequest = async (endpoint: string) => axios.delete(endpoint)

// Métodos específicos tipados
export const locationApi = {
  getOne: (type: LocationType, id: string) =>
    getRequest(buildEndpoint({ type, action: 'one', id })),

  getAll: (type: LocationType) =>
    getRequest(buildEndpoint({ type, action: 'many' })),

  create: (type: LocationType, data: object) =>
    postRequest(buildEndpoint({ type, action: 'void' }), data),

  update: (type: LocationType, id: string, data: object) =>
    putRequest(buildEndpoint({ type, action: 'one', id }), data),

  delete: (type: LocationType, id: string) =>
    deleteRequest(buildEndpoint({ type, action: 'one', id })),
}

/**
 * Función helper para construir endpoints
 * @example
 * one => /location/country/123,
 * many => /location/countries,
 * void => /location/country
 */
interface BuildEndpointParams { id?: string, type: LocationType, action: 'one' | 'many' | 'void' }
const buildEndpoint = ({ id, type, action }: BuildEndpointParams) => {
  const formatPlural = type.slice(-1) === 'y' ? type.slice(0, -1) + 'ies' : type + 's'
  const base = '/location'

  switch (action) {
    case 'void': return `${base}/${type}` // Para create => /location/country (POST)
    case 'many': return `${base}/${formatPlural}` // Para getAll => /location/countries (GET)
    case 'one': return `${base}/${type}/${id}` // Para getOne, update, delete => /location/country/123 (GET, PUT, DELETE)
  }
}