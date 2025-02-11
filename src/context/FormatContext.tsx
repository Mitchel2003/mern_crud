import { FileReferenceDB, isAxiosResponse, Paginate } from "@/interfaces/db.interface"
import { FormatContext, FormatType } from "@/interfaces/context.interface"
import { useNotification } from "@/hooks/ui/useNotification"
import { useLoadingScreen } from "@/hooks/ui/useLoading"
import { Props } from "@/interfaces/props.interface"
import { useApi } from "@/api/handler"

import { createContext, useContext, useState } from "react"

const Format = createContext<FormatContext>(undefined)

/**
 * Hook personalizado para acceder al contexto de formato.
 * @throws {Error} Si se intenta usar fuera del FormatProvider.
 */
export const useFormatContext = () => {
  const context = useContext(Format)
  if (!context) throw new Error('useFormat must be used within a FormatProvider')
  return context
}

/**
 * Proveedor del contexto de formato.
 * Maneja el estado de los formatos y proporciona funciones para interactuar con ellos.
 * @param {Props} props - Las propiedades del componente.
 * @returns {JSX.Element} Elemento JSX que envuelve a los hijos con el contexto de formato.
 */
export const FormatProvider = ({ children }: Props): JSX.Element => {
  const { show: showLoading, hide: hideLoading } = useLoadingScreen()
  const { notifySuccess, notifyError } = useNotification()
  const [loading, setLoading] = useState(false)

  /**
   * Obtiene todos los formatos de un tipo específico
   * @param {string} type - El tipo de formato.
   * @returns {Promise<any[]>} Un array con los datos de todos los formatos.
   */
  const getAll = async (type: FormatType): Promise<any[]> => {
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
   * Obtiene un formato específico por su ID
   * @param {string} type - El tipo de formato.
   * @param {string} id - El ID del formato.
   * @returns {Promise<any>} Los datos del formato.
   */
  const getById = async (type: FormatType, id: string): Promise<any | undefined> => {
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
   * Obtiene todos los formatos de un tipo específico por una consulta
   * @param {string} type - El tipo de formato, se utiliza para construir el endpoint.
   * @param {object} query - La consulta, corresponde a un criterio de busqueda.
   * @returns {Promise<any[]>} Un array con los datos de todos los formatos.
   */
  const getByQuery = async (type: FormatType, query: object): Promise<any[]> => {
    setLoadingStatus('Buscando por consulta...')
    try {
      const response = await useApi(type).getByQuery(query)
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message })
      return []
    } finally { setLoadingStatus() }
  }

  /**
   * Obtiene todos los formatos de un tipo específico por una consulta, aplicando paginación.
   * @param {string} type - El tipo de formato, se utiliza para construir el endpoint.
   * @param {object} query - La consulta, corresponde a un criterio de busqueda.
   * @returns {Promise<Paginate<any>>} Un array con los datos de todos los formatos.
   */
  const getByPaginate = async (type: FormatType, query: object): Promise<Paginate<any>> => {
    setLoadingStatus('Buscando por consulta...')
    try {
      const response = await useApi(type).getByQuery(query)
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message })
      return { data: [], totalCount: 0, pageCount: 0 }
    } finally { setLoadingStatus() }
  }

  /**
   * Crea un nuevo formato
   * @param {string} type - El tipo de formato.
   * @param {object} data - Los datos del formato.
   * @returns {Promise<any>} Los datos del formato creado.
   */
  const create = async (type: FormatType, data: object): Promise<any> => {
    setLoadingStatus('Creando...')
    try {
      const response = await useApi(type).create(data)
      notifySuccess({ title: "Éxito", message: "Registro creado correctamente" })
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al crear", message: e.response.data.message })
      return undefined
    } finally { setLoadingStatus() }
  }

  /**
   * Actualiza un formato existente
   * @param {string} type - El tipo de formato.
   * @param {string} id - El ID del formato.
   * @param {object} data - Los datos del formato.
   * @returns {Promise<any>} Los datos del formato actualizado.
   */
  const update = async (type: FormatType, id: string, data: object): Promise<any> => {
    setLoadingStatus('Actualizando...')
    try {
      const response = await useApi(type).update(id, data)
      notifySuccess({ title: "Éxito", message: "Registro actualizado correctamente" })
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al actualizar", message: e.response.data.message })
      return undefined
    } finally { setLoadingStatus() }
  }

  /**
   * Elimina un formato existente
   * @param {string} type - El tipo de formato.
   * @param {string} id - El ID del formato.
   * @returns {Promise<any>} Los datos del formato eliminado.
   */
  const delete_ = async (type: FormatType, id: string): Promise<any> => {
    setLoadingStatus('Eliminando...')
    try {
      const response = await useApi(type).delete(id)
      notifySuccess({ title: "Éxito", message: "Registro eliminado correctamente" })
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al eliminar", message: e.response.data.message })
      return undefined
    } finally { setLoadingStatus() }
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------files--------------------------------------------------*/
  /**
   * Obtiene todos los archivos asociados a un formato
   * @param {FormatType} type - El tipo de formato
   * @param {FileReferenceDB} data - Los datos de la referencia del documento
   * @example const data = { id: '456', ref: 'preview' }
   * @returns {Promise<any[]>} Array con los metadatos de los archivos
   */
  const getAllFiles = async (type: FormatType, data: FileReferenceDB): Promise<any[]> => {
    setLoadingStatus('Cargando archivos...')
    try {
      const response = await useApi(type).getAll(data)
      return response.data
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al obtener archivos", message: e.response.data.message })
      return []
    } finally { setLoadingStatus() }
  }

  /**
   * Sube archivos asociados a un formato
   * @param {FormatType} type - El tipo de formato
   * @param {FileReferenceDB} data - Los datos de la referencia del documento
   * @example const data = { id: '456', ref: 'preview', files: [file1, file2, file3] }
   */
  const uploadFiles = async (type: FormatType, data: FileReferenceDB): Promise<void> => {
    setLoadingStatus('Subiendo archivos...')
    try {
      await useApi(type).void(data)
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al subir archivos", message: e.response.data.message })
    } finally { setLoadingStatus() }
  }

  /**
   * Elimina un archivo específico
   * @param {FormatType} type - El tipo de formato
   * @param {FileReferenceDB} data - Los datos de la referencia del documento
   * @example const data = { id: '456', ref: 'preview', filename: 'example' }
   */
  const deleteFile = async (type: FormatType, data: FileReferenceDB): Promise<void> => {
    setLoadingStatus('Eliminando archivo...')
    try {
      await useApi(type).remove(data)
    } catch (e: unknown) {
      isAxiosResponse(e) && notifyError({ title: "Error al eliminar archivo", message: e.response.data.message })
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
    <Format.Provider value={{
      loading,
      getAll,
      getById,
      getByQuery,
      getByPaginate,
      create,
      update,
      delete: delete_,
      getAllFiles,
      uploadFiles,
      deleteFile,
    }}>
      {children}
    </Format.Provider>
  )
}