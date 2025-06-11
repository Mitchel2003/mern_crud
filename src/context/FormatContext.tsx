import { uploadFile as upload, deleteFile as removeFile, deleteFolder as removeFolder, getFiles } from "@/controllers/storage.controller"
import { FormatContext, FormatType } from "@/interfaces/context.interface"
import { useNotification } from "@/hooks/ui/useNotification"
import { QueryOptions } from "@/interfaces/hook.interface"
import { FileReference } from "@/interfaces/db.interface"
import { Props } from "@/interfaces/props.interface"
import { useLoading } from "@/hooks/ui/useLoading"
import { txt } from "@/constants/format.constants"
import { useApi } from "@/api/handler"

import { createContext, useContext } from "react"

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
    catch (e) { notifyError(txt('getAllFormat', e)); return [] }
  }
  /**
   * Obtiene un formato específico por su ID
   * @param {FormatType} type - El tipo de formato.
   * @param {string} id - El ID del formato.
   * @returns {Promise<any>} Los datos del formato o undefined.
   */
  const getById = async (type: FormatType, id: string): Promise<any | undefined> => {
    try { return (await useApi(type).getById(id)).data }
    catch (e) { notifyError(txt('getFormatById', e)); return undefined }
  }
  /**
   * Obtiene todos los formatos de un tipo específico por una consulta
   * @param {FormatType} type - El tipo de formato, se utiliza para construir el endpoint.
   * @param {QueryOptions} query - La consulta, corresponde a un criterio de busqueda.
   * @returns {Promise<any[]>} Un array con los datos o un array vacío.
   */
  const getByQuery = async (type: FormatType, query: QueryOptions): Promise<any[]> => {
    try { return (await useApi(type).getByQuery(query)).data }
    catch (e) { notifyError(txt('getFormatByQuery', e)); return [] }
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
        notifySuccess(txt('createFormat'))
        return response.data
      } catch (e) { notifyError(txt('createFormat', e)) }
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
        notifySuccess(txt('updateFormat'))
        return response.data
      } catch (e) { notifyError(txt('updateFormat', e)) }
    })
  }
  /**
   * Elimina un formato existente
   * @param {FormatType} type - El tipo de formato.
   * @param {string} id - El ID del formato a eliminar.
   * @returns {Promise<any>} Los datos del formato eliminado o undefined.
   */
  const delete_ = async (type: FormatType, id: string): Promise<any> => {
    return handler('Eliminando...', async () => {
      try {
        const response = await useApi(type).delete(id)
        notifySuccess(txt('deleteFormat'))
        return response.data
      } catch (e) { notifyError(txt('deleteFormat', e)) }
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
      return await getFiles(data.path) //get files from this path
    } catch (e) { notifyError(txt('getAllFiles', e)); return [] }
  }
  /**
   * Sube archivos asociados a un formato
   * @param {FileReference} data - Los datos de la referencia del documento
   * @example const data = { path: 'files/123/preview/img', files: [file1, file2] }
   * @returns {Promise<any>} Los metadatos del archivo subido o undefined.
   */
  const uploadFile = async (data: FileReference): Promise<any> => {
    try { return await upload(data).then((e) => { notifySuccess(txt('upload-files')); return e }) }
    catch (e) { notifyError(txt('upload-files', e)); return undefined }
  }
  /**
   * Elimina un archivo específico
   * @param {FileReference} data - Los datos de la referencia del documento
   * @example const data = { path: 'files/123/preview/img' } corresponde al path
   * @returns {Promise<any>} Los metadatos del archivo eliminado o undefined.
   */
  const deleteFile = async (data: FileReference): Promise<any> => {
    try { return await removeFile(data.path).then((e) => { notifySuccess(txt('delete-file')); return e }) }
    catch (e) { notifyError(txt('delete-file', e)); return undefined }
  }
  /**
   * Elimina una carpeta y todo su contenido recursivamente
   * @param {FileReference} data - Los datos de la referencia del documento
   * @example const data = { path: 'files/123/folder' } corresponde al path
   * @returns {Promise<any>} Los metadatos del archivo eliminado o undefined.
   */
  const deleteFolder = async (data: FileReference): Promise<any> => {
    try { return await removeFolder(data.path).then((e) => { notifySuccess(txt('delete-folder')); return e }) }
    catch (e) { notifyError(txt('delete-folder', e)); return undefined }
  }
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------returns--------------------------------------------------*/
  return (
    <Format.Provider value={{
      getAll,
      getById,
      getByQuery,
      create,
      update,
      delete: delete_,
      getAllFiles,
      uploadFile,
      deleteFile,
      deleteFolder,
    }}>
      {children}
    </Format.Provider>
  )
}