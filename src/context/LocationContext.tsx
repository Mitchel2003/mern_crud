import { LocationContext, LocationType } from "@/interfaces/context.interface"
import { useNotification } from "@/hooks/ui/useNotification"
import { isAxiosResponse } from "@/interfaces/db.interface"
import { useLoadingScreen } from "@/hooks/ui/useLoading"
import { Props } from "@/interfaces/props.interface"
import { useApi } from "@/api/handler"

import { createContext, useContext, useState } from "react"

const Location = createContext<LocationContext>(undefined)

/**
 * Hook personalizado para acceder al contexto de ubicación.
 * @throws {Error} Si se intenta usar fuera del LocationProvider.
 */
export const useLocationContext = () => {
  const context = useContext(Location)
  if (!context) throw new Error('Error al intentar usar locationContext')
  return context
}

/**
 * Proveedor del contexto de ubicación.
 * Maneja el estado de las ubicaciones y proporciona funciones para interactuar con ellas.
 * @param {Props} props - Las propiedades del componente.
 * @returns {JSX.Element} Elemento JSX que envuelve a los hijos con el contexto de ubicación.
 */
export const LocationProvider = ({ children }: Props): JSX.Element => {
  const { show: showLoading, hide: hideLoading } = useLoadingScreen()
  const { notifySuccess, notifyError } = useNotification()
  const [loading, setLoading] = useState(false)

  /**
   * Obtiene todas las ubicaciones de un tipo específico
   * @param {string} type - El tipo de ubicación.
   * @returns {Promise<any[]>} Un array con los datos de todas las ubicaciones.
   */
  const getAll = async (type: LocationType): Promise<any[]> => {
    setLoadingStatus('Obteniendo lista...')
    try {
      const response = await useApi(type).getAll()
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message })
      return []
    } finally { setLoadingStatus() }
  }

  /**
   * Obtiene una ubicación específica por su ID
   * @param {string} type - El tipo de ubicación.
   * @param {string} id - El ID de la ubicación.
   * @returns {Promise<any>} Los datos de la ubicación.
   */
  const getById = async (type: LocationType, id: string): Promise<any | undefined> => {
    setLoadingStatus('Buscando por identificador...')
    try {
      const response = await useApi(type).getById(id)
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al obtener datos", message: e.response.data.message })
      return undefined
    } finally { setLoadingStatus() }
  }

  /**
   * Obtiene todas las ubicaciones de un tipo específico por una consulta
   * tenemos un opcional para poblar con el cual podemos ejercer relaciones
   * @param {string} type - El tipo de ubicación.
   * @param {object} query - La consulta.
   * @param {string} populate - El campo a poblar; corresponde a la relacion de la ubicacion (ej: 'city.state.country')
   * @returns {Promise<any[]>} Un array con los datos de todas las ubicaciones.
   */
  const getByQuery = async (type: LocationType, query: object, populate?: string): Promise<any[]> => {
    setLoadingStatus('Buscando por consulta...')
    try {
      const response = await useApi(type).getByQuery(query, populate)
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message })
      return []
    } finally { setLoadingStatus() }
  }

  /**
   * Crea una nueva ubicación
   * @param {string} type - El tipo de ubicación.
   * @param {object} data - Los datos de la ubicación.
   */
  const create = async (type: LocationType, data: object): Promise<void> => {
    setLoadingStatus('Creando...')
    try {
      await useApi(type).create(data)
      notifySuccess({ title: "Éxito", message: "Registro creado correctamente" })
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al crear", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }

  /**
   * Actualiza una ubicación existente
   * @param {string} type - El tipo de ubicación.
   * @param {string} id - El ID de la ubicación.
   * @param {object} data - Los datos de la ubicación.
   */
  const update = async (type: LocationType, id: string, data: object): Promise<void> => {
    setLoadingStatus('Actualizando...')
    try {
      await useApi(type).update(id, data)
      notifySuccess({ title: "Éxito", message: "Registro actualizado correctamente" })
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al actualizar", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }

  /**
   * Elimina una ubicación existente
   * @param {string} type - El tipo de ubicación.
   * @param {string} id - El ID de la ubicación.
   */
  const delete_ = async (type: LocationType, id: string): Promise<void> => {
    setLoadingStatus('Eliminando...')
    try {
      await useApi(type).delete(id)
      notifySuccess({ title: "Éxito", message: "Registro eliminado correctamente" })
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al eliminar", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------tools--------------------------------------------------*/
  /**
   * Actualiza el estado de carga basado en un parametro opcional
   * si valor del param es distinto a undefined, se muestra el loading
   * @param {string | undefined} status - El estado de carga.
   */
  const setLoadingStatus = (status?: string) => {
    setLoading(Boolean(status))
    status ? showLoading(status) : hideLoading()
  }
  /*---------------------------------------------------------------------------------------------------------*/

  return (
    <Location.Provider value={{
      loading,
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