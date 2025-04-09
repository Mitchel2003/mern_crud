/** Este módulo proporciona funciones para la gestión de archivos con Firebase Cloud Storage */
import { storageService } from "@/services/firebase/storage.service"
import { FileReference, Metadata } from "@/interfaces/db.interface"
import { normalizeError } from "@/errors/handler"
import ErrorAPI from "@/errors"

/**
 * Obtiene los metadatos de los archivos en una ruta específica
 * @param path: corresponde a la ruta de los archivos
 * @example path = "files/uid/preview" as folder
 */
export const getFiles = async (path: string): Promise<Metadata[]> => {
  try {
    const result = await storageService.getFilesWithMetadata(path)
    if (!result.success) throw result.error //is ErrorAPI
    return result.data //array of metadata with references
  } catch (e) { throw e instanceof ErrorAPI ? e : new ErrorAPI(normalizeError(e, 'obtener archivos')) }
}

/**
 * Sube múltiples archivos
 * @param data: { path: string, files: File[], unique?: boolean }
 * @example data: { path: string, files: File[], unique?: boolean }
 */
export const uploadFiles = async (data: FileReference): Promise<void> => {
  try {
    if (!data.files) throw new Error('No se proporcionaron archivos válidos');
    const result = data.unique
      ? await storageService.uploadFile(data.files[0], data.path)
      : await storageService.uploadFiles(data.files, data.path)
    if (!result.success) throw result.error //is ErrorAPI
  } catch (e) { throw e instanceof ErrorAPI ? e : new ErrorAPI(normalizeError(e, 'subir archivos')) }
}
/**
 * Elimina un archivo específico
 * @param path: corresponde a la ruta del archivo
 * @example path = "files/uid/preview" as file
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const folderPath = path.split('/').slice(0, -1).join('/')
    const files = await storageService.getFiles(folderPath)
    if (!files.success) throw files.error //is ErrorAPI
    if (files.data.length === 0) return //without files
    const result = await storageService.deleteFile(path)
    if (!result.success) throw result.error //is ErrorAPI
  } catch (e) { throw e instanceof ErrorAPI ? e : new ErrorAPI(normalizeError(e, 'eliminar archivo')) }
}