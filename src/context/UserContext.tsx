import { UserContext, UserType } from "@/interfaces/context.interface"
import { useNotification } from "@/hooks/ui/useNotification"
import { isAxiosResponse } from "@/interfaces/db.interface"
import { useLoadingScreen } from "@/hooks/ui/useLoading"
import { Props } from "@/interfaces/props.interface"
import { useApi } from "@/api/handler"

import { createContext, useContext, useState } from "react"

const User = createContext<UserContext>(undefined)

/**
 * Hook personalizado para acceder al contexto de usuario.
 * @throws {Error} Si se intenta usar fuera del UserProvider.
 */
export const useUserContext = () => {
  const context = useContext(User)
  if (!context) throw new Error('Error al intentar usar userContext')
  return context
}

/**
 * Proveedor del contexto de usuario.
 * Maneja el estado de los usuarios y proporciona funciones para interactuar con ellos.
 * @param {Props} props - Las propiedades del componente.
 * @returns {JSX.Element} Elemento JSX que envuelve a los hijos con el contexto de usuario.
 */
export const UserProvider = ({ children }: Props): JSX.Element => {
  const { show: showLoading, hide: hideLoading } = useLoadingScreen()
  const { notifySuccess, notifyError } = useNotification()
  const [loading, setLoading] = useState(false)

  /**
   * Obtiene todas los usuarios de un tipo específico
   * @param {string} type - El tipo de usuario.
   * @returns {Promise<any[]>} Un array con los datos de todos los usuarios.
   */
  const getAll = async (type: UserType): Promise<any[]> => {
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
   * Obtiene un usuario específico por su ID
   * @param {string} type - El tipo de usuario.
   * @param {string} id - El ID del usuario.
   * @returns {Promise<any>} Los datos del usuario.
   */
  const getById = async (type: UserType, id: string): Promise<any | undefined> => {
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
   * Obtiene todos los usuarios de un tipo específico por una consulta
   * tenemos un opcional para poblar con el cual podemos ejercer relaciones
   * @param {string} type - El tipo de usuario.
   * @param {object} query - La consulta.
   * @param {string} populate - El campo a poblar; corresponde a la relacion del usuario (ej: 'user.headquarter')
   * @returns {Promise<any[]>} Un array con los datos de todos los usuarios.
   */
  const getByQuery = async (type: UserType, query: object, populate?: string): Promise<any[]> => {
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
   * Crea un nuevo usuario de un tipo específico
   * @param {string} type - El tipo de usuario.
   * @param {object} data - Los datos del usuario.
   */
  const create = async (type: UserType, data: object): Promise<void> => {
    setLoadingStatus('Creando...')
    try {
      await useApi(type).create(data)
      notifySuccess({ title: "Éxito", message: "Registro creado correctamente" })
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al crear", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }

  /**
   * Actualiza un usuario existente de un tipo específico
   * @param {string} type - El tipo de usuario.
   * @param {string} id - El ID del usuario.
   * @param {object} data - Los datos del usuario.
   */
  const update = async (type: UserType, id: string, data: object): Promise<void> => {
    setLoadingStatus('Actualizando...')
    try {
      await useApi(type).update(id, data)
      notifySuccess({ title: "Éxito", message: "Registro actualizado correctamente" })
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al actualizar", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }

  /**
   * Elimina un usuario existente de un tipo específico
   * @param {string} type - El tipo de usuario.
   * @param {string} id - El ID del usuario.
   */
  const delete_ = async (type: UserType, id: string): Promise<void> => {
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
    <User.Provider value={{
      loading,
      getAll,
      getById,
      getByQuery,
      create,
      update,
      delete: delete_,
    }}>
      {children}
    </User.Provider>
  )
}