import { uploadFiles as upload, deleteFile as remove, getFiles } from "@/controllers/storage.controller"
import { FileReference, isAxiosResponse, Result } from "@/interfaces/db.interface"
import { FormatContext, FormatType } from "@/interfaces/context.interface"
import { Props, QueryOptions } from "@/interfaces/props.interface"
import { useNotification } from "@/hooks/ui/useNotification"
import { useLoading } from "@/hooks/ui/useLoading"
import { useApi } from "@/api/handler"

import { createContext, useContext } from "react"
import ErrorAPI from "@/errors"

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
  const { notifySuccess, notifyError } = useNotification()
  const { handler } = useLoading()

  /**
   * Obtiene todos los formatos de un tipo específico
   * @param {FormatType} type - El tipo de formato.
   * @returns {Promise<any[]>} Un array con los datos o un array vacío.
   */
  const getAll = async (type: FormatType): Promise<any[]> => {
    try { return (await useApi(type).getAll()).data }
    catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message }); return [] }
  }
  /**
   * Obtiene un formato específico por su ID
   * @param {FormatType} type - El tipo de formato.
   * @param {string} id - El ID del formato.
   * @returns {Promise<any>} Los datos del formato o undefined.
   */
  const getById = async (type: FormatType, id: string): Promise<any> => {
    return handler('Buscando por identificador...', async () => {
      try { return (await useApi(type).getById(id)).data }
      catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al obtener datos", message: e.response.data.message }); return undefined }
    })
  }
  /**
   * Obtiene todos los formatos de un tipo específico por una consulta
   * @param {FormatType} type - El tipo de formato, se utiliza para construir el endpoint.
   * @param {QueryOptions} query - La consulta, corresponde a un criterio de busqueda.
   * @returns {Promise<any[]>} Un array con los datos o un array vacío.
   */
  const getByQuery = async (type: FormatType, query: QueryOptions): Promise<any[]> => {
    return handler('Buscando por consulta...', async () => {
      try {
        if ('enabled' in query && query.enabled === false) return []
        return (await useApi(type).getByQuery(query)).data
      } catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al obtener lista", message: e.response.data.message }); return [] }
    })
  }
  /**
   * Crea un nuevo formato
   * @param {FormatType} type - El tipo de formato.
   * @param {object} data - Los datos del formato.
   * @returns {Promise<any>} Los datos del formato creado o undefined.
   */
  const create = async (type: FormatType, data: object): Promise<any> => {
    return handler('Creando...', async () => {
      try {
        const response = await useApi(type).create(data)
        notifySuccess({ title: "Éxito", message: "Registro creado correctamente" })
        return response.data
      } catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al crear", message: e.response.data.message }); return undefined }
    })
  }
  /**
   * Actualiza un formato existente
   * @param {FormatType} type - El tipo de formato.
   * @param {string} id - El ID del formato.
   * @param {object} data - Los datos del formato.
   * @returns {Promise<any>} Los datos del formato actualizado o undefined.
   */
  const update = async (type: FormatType, id: string, data: object): Promise<any> => {
    return handler('Actualizando...', async () => {
      try {
        const response = await useApi(type).update(id, data)
        notifySuccess({ title: "Éxito", message: "Registro actualizado correctamente" })
        return response.data
      } catch (e) { isAxiosResponse(e) && notifyError({ title: "Error al actualizar", message: e.response.data.message }); return undefined }
    })
  }
  /**
   * Elimina un formato existente
   * @param {FormatType} type - El tipo de formato.
   * @param {string} id - El ID del formato.
   * @returns {Promise<any>} Los datos del formato eliminado o undefined.
   */
  const delete_ = async (type: FormatType, id: string): Promise<any> => {
    return handler('Eliminando...', async () => {
      try {
        const response = await useApi(type).delete(id)
        notifySuccess({ title: "Éxito", message: "Registro eliminado correctamente" })
        return response.data
      } catch (e: unknown) { isAxiosResponse(e) && notifyError({ title: "Error al eliminar", message: e.response.data.message }); return undefined }
    })
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------files--------------------------------------------------*/
  /**
   * Obtiene todos los archivos asociados a un formato
   * @param {FileReference} data - Los datos de la referencia del documento
   * @returns {Promise<any[]>} Array con los metadatos de los archivos o un array vacío.
   */
  const getAllFiles = async (data: FileReference): Promise<any[]> => {
    try {
      if ('enabled' in data && data.enabled === false) return []
      const result: Result<any[]> = await getFiles(data.path)
      if (!result.success) throw new ErrorAPI(result.error)
      return result.data
    } catch (e: unknown) { notifyError({ title: "Error al obtener archivos", message: (e as Error).message }); return [] }
  }
  /**
   * Sube archivos asociados a un formato
   * @param {FileReference} data - Los datos de la referencia del documento
   * @example const data = { path: 'files/123/preview/img', files: [file1, file2] }
   */
  const uploadFiles = async (data: FileReference): Promise<void> => {
    return handler('Subiendo archivos...', async () => {
      try {
        const result = await upload(data)
        if (!result.success) throw new ErrorAPI(result.error)
        notifySuccess({ title: "Éxito", message: "Archivos subidos correctamente" })
      } catch (e: unknown) { notifyError({ title: "Error al subir archivos", message: (e as Error).message }) }
    })
  }
  /**
   * Elimina un archivo específico
   * @param {FileReference} data - Los datos de la referencia del documento
   * @example const data = { path: 'files/123/preview/img' }
   */
  const deleteFile = async (data: FileReference): Promise<void> => {
    return handler('Eliminando archivo...', async () => {
      try {
        const result = await remove(data.path)
        if (!result.success) throw new ErrorAPI(result.error)
        notifySuccess({ title: "Éxito", message: "Archivo eliminado correctamente" })
      } catch (e: unknown) { notifyError({ title: "Error al eliminar archivo", message: (e as Error).message }) }
    })
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------Return context--------------------------------------------------*/
  return (
    <Format.Provider value={{
      getAll,
      getById,
      getByQuery,
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