import { LocationContext, LocationType, BaseLocation, Headquarter, State, City } from "@/interfaces/context.interface"
import { useNotification } from "@/hooks/ui/useNotification"
import { isAxiosResponse } from "@/interfaces/db.interface"
import { useLoadingScreen } from "@/hooks/ui/useLoading"
import { Props } from "@/interfaces/props.interface"
import { locationApi } from "@/api/location"

import { createContext, useContext, useState } from "react"

const Location = createContext<LocationContext | undefined>(undefined)

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
   * Obtiene una ubicación específica por su ID
   * @param {string} type - El tipo de ubicación.
   * @param {string} id - El ID de la ubicación.
   * @returns {Promise<T>} Los datos de la ubicación.
   */
  const getOne = async <T extends BaseLocation>(type: LocationType, id: string): Promise<T> => {
    setLoadingStatus('Obteniendo datos...')
    try {
      const response = await locationApi.getOne(type, id)
      notifySuccess({ title: "Éxito", message: "Datos obtenidos correctamente" })
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al obtener datos", message: e.response.data.message })
      throw e
    } finally { setLoadingStatus() }
  }

  /**
   * Obtiene todas las ubicaciones de un tipo específico
   * @param {string} type - El tipo de ubicación.
   * @returns {Promise<T[]>} Un array con los datos de todas las ubicaciones.
   */
  const getAll = async <T extends BaseLocation>(type: LocationType): Promise<T[]> => {
    setLoadingStatus('Cargando lista...')
    try {
      const response = await locationApi.getAll(type)
      notifySuccess({ title: "Éxito", message: "Lista obtenida correctamente" })
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message })
      return []
    } finally { setLoadingStatus() }
  }

  /**
   * Crea una nueva ubicación
   * @param {string} type - El tipo de ubicación.
   * @param {Partial<T>} data - Los datos de la ubicación.
   * @returns {Promise<T>} Los datos de la ubicación creada.
   */
  const create = async <T extends BaseLocation>(type: LocationType, data: Partial<T>): Promise<T> => {
    setLoadingStatus('Creando registro...')
    try {
      const response = await locationApi.create(type, data)
      notifySuccess({ title: "Éxito", message: "Registro creado correctamente" })
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al crear", message: e.response.data.message })
      throw e
    } finally { setLoadingStatus() }
  }

  /**
   * Actualiza una ubicación existente
   * @param {string} type - El tipo de ubicación.
   * @param {string} id - El ID de la ubicación.
   * @param {Partial<T>} data - Los datos de la ubicación.
   * @returns {Promise<T>} Los datos de la ubicación actualizada.
   */
  const update = async <T extends BaseLocation>(type: LocationType, id: string, data: Partial<T>): Promise<T> => {
    setLoadingStatus('Actualizando registro...')
    try {
      const response = await locationApi.update(type, id, data)
      notifySuccess({ title: "Éxito", message: "Registro actualizado correctamente" })
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al actualizar", message: e.response.data.message })
      throw e
    } finally { setLoadingStatus() }
  }

  /**
   * Elimina una ubicación existente
   * @param {string} type - El tipo de ubicación.
   * @param {string} id - El ID de la ubicación.
   * @returns {Promise<T>} Los datos de la ubicación eliminada.
   */
  const delete_ = async <T extends BaseLocation>(type: LocationType, id: string): Promise<T> => {
    setLoadingStatus('Eliminando registro...')
    try {
      const response = await locationApi.delete(type, id)
      notifySuccess({ title: "Éxito", message: "Registro eliminado correctamente" })
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al eliminar", message: e.response.data.message })
      throw e
    } finally { setLoadingStatus() }
  }

  /*--------------------------------------------------relations--------------------------------------------------*/
  /**
   * Obtiene todas las sedes de una ciudad
   * @param {string} cityId - El ID de la ciudad.
   * @returns {Promise<Headquarter[]>} Un array con los datos de todas las sedes.
   */
  const getHeadquartersByCity = (cityId: string) =>
    getAll<Headquarter>('headquarter').then(headquarters =>
      headquarters.filter(hq => hq.city === cityId)
    )

  /**
   * Obtiene todas las ciudades de un estado
   * @param {string} stateId - El ID del estado.
   * @returns {Promise<City[]>} Un array con los datos de todas las ciudades.
   */
  const getCitiesByState = (stateId: string) =>
    getAll<City>('city').then(cities =>
      cities.filter(city => city.state === stateId)
    )

  /**
   * Obtiene todos los estados de un país
   * @param {string} countryId - El ID del país.
   * @returns {Promise<State[]>} Un array con los datos de todos los estados.
   */
  const getStatesByCountry = (countryId: string) =>
    getAll<State>('state').then(states =>
      states.filter(state => state.country === countryId)
    )
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
      getOne,
      getAll,
      create,
      update,
      delete: delete_,
      getCitiesByState,
      getStatesByCountry,
      getHeadquartersByCity
    }}>
      {children}
    </Location.Provider>
  )
}