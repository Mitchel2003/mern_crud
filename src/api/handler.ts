import axios, { cachedAxios, invalidateCache } from "./axios"
import { EndpointParams } from "@/interfaces/props.interface"
import { toPlural } from "@/constants/format.constants"

/**
 * Realiza una solicitud GET con uso de cache (axios-cache-interceptor)
 * @param {string} endpoint - El endpoint a consultar, path de la request
 * @param {Record<string, any>} params - Los parámetros de la solicitud
 * @returns {Promise<any>} La respuesta de la solicitud
 */
export const getRequest = async (endpoint: string, params?: Record<string, any>): Promise<any> =>
  cachedAxios.get(endpoint, { params, paramsSerializer: { indexes: null } })

/**
 * Realiza una solicitud POST con invalidación de cache
 * @param {string} endpoint - El endpoint a consultar
 * @param {object | undefined} data - Los datos de la solicitud
 * @returns {Promise<any>} La respuesta de la solicitud
 */
export const postRequest = async (endpoint: string, data: object | undefined): Promise<any> =>
  axios.post(endpoint, data).then((e) => { invalidateCache(endpoint); return e })

/**
 * Realiza una solicitud PUT con invalidación de cache
 * @param {string} endpoint - El endpoint a consultar
 * @param {object} data - Los datos de la solicitud
 * @returns {Promise<any>} La respuesta de la solicitud
 */
export const putRequest = async (endpoint: string, data: object): Promise<any> =>
  axios.put(endpoint, data).then((e) => { invalidateCache(endpoint); return e })

/**
 * Realiza una solicitud DELETE con invalidación de cache
 * @param {string} endpoint - El endpoint a consultar
 * @param {object} params - Los parámetros de la solicitud
 * @returns {Promise<any>} La respuesta de la solicitud
 */
export const deleteRequest = async (endpoint: string, params?: object): Promise<any> =>
  axios.delete(endpoint, { params }).then((e) => { invalidateCache(endpoint); return e })
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Función que retorna las funciones CRUD para un tipo de dato
 * @param {string} type - El tipo contexto de la solicitud
 * @returns {object} Un objeto con las funciones CRUD
 */
export const useApi = (type: string): any => ({
  getAll: (data?: object) => getRequest(buildEndpoint({ type, action: 'many' }), data),
  getById: (id: string) => getRequest(buildEndpoint({ type, action: 'one', id })),
  getByQuery: (query: object) => getRequest(buildEndpoint({ type, action: 'many' }), query),
  create: (data: object) => postRequest(buildEndpoint({ type, action: 'void' }), data),
  update: (id: string, data: object) => putRequest(buildEndpoint({ type, action: 'one', id }), data),
  delete: (id: string) => deleteRequest(buildEndpoint({ type, action: 'one', id })),

  //essential functions
  get: (data?: object) => getRequest(buildEndpoint({ type, action: 'void' }), data),
  void: (data?: object) => postRequest(buildEndpoint({ type, action: 'void' }), data),
  remove: (data?: object) => deleteRequest(buildEndpoint({ type, action: 'void' }), data)
})

/**
 * Función helper para construir endpoints
 * @param {string} params.id - El ID del elemento en contexto (opcional).
 * @param {string} params.type - Corresponde al contexto de la solicitud.
 * @param {string} params.action - La acción a realizar, puede ser: one, many, void.
 * @returns {string} El endpoint construido.
 * @example
 * one => /base/type/123,
 * many => /base/types,
 * void => /base/type,
 */
const buildEndpoint = ({ id, type, action }: EndpointParams): string => {
  const base = getBase(type) ?? ''
  switch (action) {
    case 'void': return `${base}/${type}` // to create => /base/type (POST)
    case 'many': return `${base}/${toPlural(type)}` // to getAll => /base/types (GET)
    case 'one': return `${base}/${type}/${id}` // to getOne, update, delete => /base/type/123 (GET, PUT, DELETE)
  }
}

/**
 * Función helper para obtener la base de la solicitud
 * @param {string} type - Corresponde al contexto de la solicitud.
 * @returns {string} La base de la solicitud (o undefined si no corresponde).
 * @example headquarter: '/location' => backend = 'api/location/headquarter'
 */
const getBase = (type: string): string | undefined => {
  switch (type) {
    /*-------------------------authentication-------------------------*/
    case 'fcm':
    case 'notifications':
    case 'notifications/read':
    case 'notifications/create':
    case 'notifications/read/all':
    case 'notifications/unread/count': return '/auth'
    case 'user': return undefined
    /*-------------------------location-------------------------*/
    case 'country':
    case 'state':
    case 'city':
    case 'office':
    case 'signature':
    case 'headquarter': return '/location'
    /*-------------------------format-------------------------*/
    case 'cv':
    case 'solicit':
    case 'activity':
    case 'schedule':
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