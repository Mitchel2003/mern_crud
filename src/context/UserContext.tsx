import { UserContext, UserType } from "@/interfaces/context.interface"
import { Props, QueryOptions } from "@/interfaces/props.interface"
import { useNotification } from "@/hooks/ui/useNotification"
import { isAxiosResponse } from "@/interfaces/db.interface"
import { useLoading } from "@/hooks/ui/useLoading"
import { useApi } from "@/api/handler"

import { createContext, useContext } from "react"

const User = createContext<UserContext>(undefined)

/**
 * Hook personalizado para acceder al contexto de usuario.
 * @throws {Error} Si se intenta usar fuera del UserProvider.
 */
export const useUserContext = () => {
  const context = useContext(User)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}

/**
 * Proveedor del contexto de usuario.
 * Maneja el estado de los usuarios y proporciona funciones para interactuar con ellos.
 * @param {Props} props - Las propiedades del componente.
 * @returns {JSX.Element} Elemento JSX que envuelve a los hijos con el contexto de usuario.
 */
export const UserProvider = ({ children }: Props): JSX.Element => {
  const { notifySuccess, notifyError } = useNotification()
  const { handler } = useLoading()

  /**
   * Obtiene todas los usuarios de un tipo específico
   * @param {string} type - El tipo de usuario.
   * @returns {Promise<any[]>} Un array con los datos de todos los usuarios.
   */
  const getAll = async (type: UserType): Promise<any[]> => {
    try { return (await useApi(type).getAll()).data }
    catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message })
      return []
    }
  }

  /**
   * Obtiene un usuario específico por su ID
   * @param {string} type - El tipo de usuario.
   * @param {string} id - El ID del usuario.
   * @returns {Promise<any>} Los datos del usuario.
   */
  const getById = async (type: UserType, id: string): Promise<any | undefined> => {
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
   * Obtiene todos los usuarios de un tipo específico por una consulta
   * @param {string} type - El tipo de usuario, se utiliza para construir el endpoint.
   * @param {QueryOptions} query - Corresponde a la consulta, alucivo a un criterio de busqueda.
   * @returns {Promise<any[]>} Un array con los datos de todos los usuarios.
   */
  const getByQuery = async (type: UserType, query: QueryOptions): Promise<any[]> => {
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
   * Crea un nuevo usuario de un tipo específico
   * @param {string} type - El tipo de usuario.
   * @param {object} data - Los datos del usuario.
   * @returns {Promise<any>} Los datos del usuario creado.
   */
  const create = async (type: UserType, data: object): Promise<any> => {
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
   * Actualiza un usuario existente
   * @param {string} type - El tipo de usuario.
   * @param {string} id - El ID del usuario.
   * @param {object} data - Los datos del usuario.
   * @returns {Promise<any>} Los datos del usuario actualizado.
   */
  const update = async (type: UserType, id: string, data: object): Promise<any> => {
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
   * Elimina un usuario existente
   * @param {string} type - El tipo de usuario.
   * @param {string} id - El ID del usuario.
   * @returns {Promise<any>} Los datos del usuario eliminado.
   */
  const delete_ = async (type: UserType, id: string): Promise<any> => {
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
    <User.Provider value={{
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