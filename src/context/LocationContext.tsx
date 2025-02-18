import { LocationContext, LocationType } from "@/interfaces/context.interface"
import { Props, QueryOptions } from "@/interfaces/props.interface"
import { useNotification } from "@/hooks/ui/useNotification"
import { isAxiosResponse } from "@/interfaces/db.interface"
import { useLoading } from "@/hooks/ui/useLoading"
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
   * Obtiene todas las ubicaciones de un tipo específico
   * @param {string} type - El tipo de ubicación.
   * @returns {Promise<any[]>} Un array con los datos de todas las ubicaciones.
   */
  const getAll = async (type: LocationType): Promise<any[]> => {
    return handler('Obteniendo lista...', async () => {
      try {
        return (await useApi(type).getAll()).data
      } catch (e: unknown) {
        isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message })
        return []
      }
    })
  }

  /**
   * Obtiene una ubicación específica por su ID
   * @param {string} type - El tipo de ubicación.
   * @param {string} id - El ID de la ubicación.
   * @returns {Promise<any>} Los datos de la ubicación.
   */
  const getById = async (type: LocationType, id: string): Promise<any | undefined> => {
    return handler('Buscando por identificador...', async () => {
      try {
        return (await useApi(type).getById(id)).data
      } catch (e: unknown) {
        isAxiosResponse(e) && notifyError({ title: "Error al obtener datos", message: e.response.data.message })
        return undefined
      }
    })
  }

  /**
   * Obtiene todas las ubicaciones de un tipo específico por una consulta
   * @param {string} type - El tipo de ubicación, se utiliza para construir el endpoint.
   * @param {QueryOptions} query - La consulta, corresponde a un criterio de busqueda.
   * @returns {Promise<any[]>} Un array con los datos de todas las ubicaciones.
   */
  const getByQuery = async (type: LocationType, query: QueryOptions): Promise<any[]> => {
    return handler('Buscando por consulta...', async () => {
      try {
        if ('enabled' in query && query.enabled === false) return []
        return (await useApi(type).getByQuery(query)).data
      } catch (e: unknown) {
        isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message })
        return []
      }
    })
  }

  /**
   * Crea una nueva ubicación
   * @param {string} type - El tipo de ubicación.
   * @param {object} data - Los datos de la ubicación.
   * @returns {Promise<any>} Los datos de la ubicación creada.
   */
  const create = async (type: LocationType, data: object): Promise<any> => {
    return handler('Creando...', async () => {
      try {
        const response = await useApi(type).create(data)
        notifySuccess({ title: "Éxito", message: "Registro creado correctamente" })
        return response.data
      } catch (e: unknown) {
        isAxiosResponse(e) && notifyError({ title: "Error al crear", message: e.response.data.message })
        return undefined
      }
    })
  }

  /**
   * Actualiza una ubicación existente
   * @param {string} type - El tipo de ubicación.
   * @param {string} id - El ID de la ubicación.
   * @param {object} data - Los datos de la ubicación.
   * @returns {Promise<any>} Los datos de la ubicación actualizada.
   */
  const update = async (type: LocationType, id: string, data: object): Promise<any> => {
    return handler('Actualizando...', async () => {
      try {
        const response = await useApi(type).update(id, data)
        notifySuccess({ title: "Éxito", message: "Registro actualizado correctamente" })
        return response.data
      } catch (e: unknown) {
        isAxiosResponse(e) && notifyError({ title: "Error al actualizar", message: e.response.data.message })
        return undefined
      }
    })
  }

  /**
   * Elimina una ubicación existente
   * @param {string} type - El tipo de ubicación.
   * @param {string} id - El ID de la ubicación.
   * @returns {Promise<any>} Los datos de la ubicación eliminada.
   */
  const delete_ = async (type: LocationType, id: string): Promise<any> => {
    return handler('Eliminando...', async () => {
      try {
        const response = await useApi(type).delete(id)
        notifySuccess({ title: "Éxito", message: "Registro eliminado correctamente" })
        return response.data
      } catch (e: unknown) {
        isAxiosResponse(e) && notifyError({ title: "Error al eliminar", message: e.response.data.message })
        return undefined
      }
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