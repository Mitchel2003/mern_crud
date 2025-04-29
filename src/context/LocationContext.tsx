import { LocationContext, LocationType } from "@/interfaces/context.interface"
import { useNotification } from "@/hooks/ui/useNotification"
import { QueryOptions } from "@/interfaces/hook.interface"
import { Props } from "@/interfaces/props.interface"
import { useLoading } from "@/hooks/ui/useLoading"
import { txt } from "@/constants/format.constants"
import { useApi } from "@/api/handler"

import { createContext, useContext } from "react"

const Location = createContext<LocationContext>(undefined)

/**
 * Hook personalizado para acceder al contexto de ubicación.
 * @throws {Error} Si se intenta usar fuera del LocationProvider.
 */
export const useLocationContext = () => {
  const context = useContext(Location)
  if (!context) throw new Error('useLocation must be used within a LocationProvider')
  return context
}

/**
 * Proveedor del contexto de ubicación.
 * Maneja el estado de las ubicaciones y proporciona funciones para interactuar con ellas.
 * @param {Props} props - Las propiedades del componente.
 * @returns {JSX.Element} Elemento JSX que envuelve a los hijos con el contexto de ubicación.
 */
export const LocationProvider = ({ children }: Props): JSX.Element => {
  const { notifySuccess, notifyError } = useNotification()
  const { handler } = useLoading()

  /**
   * Obtiene todas las ubicaciones de un tipo específico.
   * @param {LocationType} type - El tipo de ubicación.
   * @returns {Promise<any[]>} Un array con los datos de todas las ubicaciones o un array vacío.
   */
  const getAll = async (type: LocationType): Promise<any[]> => {
    try { return (await useApi(type).getAll()).data }
    catch (e) { notifyError(txt('getAllLocation', e)); return [] }
  }
  /**
   * Obtiene una ubicación específica por su ID.
   * @param {LocationType} type - El tipo de ubicación.
   * @param {string} id - El ID de la ubicación.
   * @returns {Promise<any>} Los datos de la ubicación o undefined.
   */
  const getById = async (type: LocationType, id: string): Promise<any | undefined> => {
    try { return (await useApi(type).getById(id)).data }
    catch (e) { notifyError(txt('getLocationById', e)); return undefined }
  }
  /**
   * Obtiene todas las ubicaciones de un tipo específico por una consulta
   * @param {LocationType} type - El tipo de ubicación, se utiliza para construir el endpoint.
   * @param {QueryOptions} query - La consulta, corresponde a un criterio de busqueda.
   * @returns {Promise<any[]>} Un array con los datos de todas las ubicaciones o un array vacío.
   */
  const getByQuery = async (type: LocationType, query: QueryOptions): Promise<any[]> => {
    try { return (await useApi(type).getByQuery(query)).data }
    catch (e) { notifyError(txt('getLocationByQuery', e)); return [] }
  }
  /**
   * Crea una nueva ubicación
   * @param {LocationType} type - El tipo de ubicación.
   * @param {object} data - Los datos de la ubicación.
   * @returns {Promise<any>} Los datos de la ubicación creada o undefined.
   */
  const create = async (type: LocationType, data: object): Promise<any> => {
    return handler('Creando...', async () => {
      try {
        const response = await useApi(type).create(data)
        notifySuccess(txt('createLocation'))
        return response.data
      } catch (e) { notifyError(txt('createLocation', e)) }
    })
  }
  /**
   * Actualiza una ubicación existente
   * @param {LocationType} type - El tipo de ubicación.
   * @param {string} id - El ID de la ubicación.
   * @param {object} data - Los datos de la ubicación.
   * @returns {Promise<any>} Los datos de la ubicación actualizada o undefined.
   */
  const update = async (type: LocationType, id: string, data: object): Promise<any> => {
    return handler('Actualizando...', async () => {
      try {
        const response = await useApi(type).update(id, data)
        notifySuccess(txt('updateLocation'))
        return response.data
      } catch (e) { notifyError(txt('updateLocation', e)) }
    })
  }
  /**
   * Elimina una ubicación existente
   * @param {LocationType} type - El tipo de ubicación.
   * @param {string} id - El ID de la ubicación a eliminar.
   * @returns {Promise<any>} Los datos de la ubicación eliminada o undefined.
   */
  const delete_ = async (type: LocationType, id: string): Promise<any> => {
    return handler('Eliminando...', async () => {
      try {
        const response = await useApi(type).delete(id)
        notifySuccess(txt('deleteLocation'))
        return response.data
      } catch (e) { notifyError(txt('deleteLocation', e)) }
    })
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------returns--------------------------------------------------*/
  return (
    <Location.Provider value={{
      getAll,
      getById,
      getByQuery,
      create,
      update,
      delete: delete_,
    }}>
      {children}
    </Location.Provider>
  )
}