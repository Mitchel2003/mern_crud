import axios from "./axios"

export const getRequest = async (endpoint: string, params?: Record<string, any>) => axios.get(endpoint, { params, paramsSerializer: { indexes: null /* serializar correctamente los arrays */ } })
export const postRequest = async (endpoint: string, data: object | undefined) => axios.post(endpoint, data)
export const putRequest = async (endpoint: string, data: object) => axios.put(endpoint, data)
export const deleteRequest = async (endpoint: string, params?: object) => axios.delete(endpoint, { params })

export const useApi = (type: string) => ({
  // crud functions
  getAll: (data?: object) => getRequest(buildEndpoint({ type, action: 'many' }), data),
  getById: (id: string) => getRequest(buildEndpoint({ type, action: 'one', id })),
  getByQuery: (query: object) => getRequest(buildEndpoint({ type, action: 'many' }), query),
  create: (data: object) => postRequest(buildEndpoint({ type, action: 'void' }), data),
  update: (id: string, data: object) => putRequest(buildEndpoint({ type, action: 'one', id }), data),
  delete: (id: string) => deleteRequest(buildEndpoint({ type, action: 'one', id })),

  // essential functions
  get: (data?: object) => getRequest(buildEndpoint({ type, action: 'void' }), data),
  void: (data?: object) => postRequest(buildEndpoint({ type, action: 'void' }), data),
  remove: (data?: object) => deleteRequest(buildEndpoint({ type, action: 'void' }), data)
})

/**
 * Función helper para construir endpoints
 * @param {string} id - El ID del elemento en contexto (opcional).
 * @param {string} type - Corresponde al contexto de la solicitud.
 * @param {string} action - La acción a realizar, puede ser: one, many, void.
 * @returns {string} El endpoint construido.
 * @example
 * one => /base/type/123,
 * many => /base/types,
 * void => /base/type,
 */
interface BuildEndpointParams {
  action: 'one' | 'many' | 'void',
  type: string,
  id?: string
}
const buildEndpoint = ({ id, type, action }: BuildEndpointParams) => {
  const formatPlural = type.slice(-1) === 'y' ? type.slice(0, -1) + 'ies' : type + 's'
  const base = getBase(type) ?? ''

  switch (action) {
    case 'void': return `${base}/${type}` // to create => /base/type (POST)
    case 'many': return `${base}/${formatPlural}` // to getAll => /base/types (GET)
    case 'one': return `${base}/${type}/${id}` // to getOne, update, delete => /base/type/123 (GET, PUT, DELETE)
  }
}

/**
 * Función helper para obtener la base de la solicitud
 * @param {string} type - Corresponde al contexto de la solicitud.
 * @returns {string} La base de la solicitud.
 * @example headquarter: '/location' => backend = 'api/location/headquarter'
 */
const getBase = (type: string): string | undefined => {
  switch (type) {
    /*-------------------------authentication-------------------------*/
    case 'fcm': return '/auth'
    case 'user': return undefined
    /*-------------------------location-------------------------*/
    case 'country':
    case 'state':
    case 'city':
    case 'office':
    case 'headquarter': return '/location'
    /*-------------------------format-------------------------*/
    case 'cv':
    case 'solicit':
    case 'maintenance': return '/form'
    case 'inspection':
    case 'accessory': return '/form/cv/sub'
    case 'supplier':
    case 'manufacturer':
    case 'representative':
    case 'supplierHeadquarter':
    case 'manufacturerHeadquarter':
    case 'representativeHeadquarter': return '/form/cv/stakeholder'
  }
  return undefined
}