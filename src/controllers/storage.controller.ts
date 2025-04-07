/** Este módulo proporciona funciones para la gestión de archivos con Firebase Cloud Storage */
import { success, failure, FileReference, Result, Metadata } from "@/interfaces/db.interface"
import { storageService } from "@/services/firebase/storage.service"
import { normalizeError } from "@/errors/handler"
import ErrorAPI from "@/errors"

/**
 * Obtiene los metadatos de los archivos en una ruta específica
 * @param path: corresponde a la ruta de los archivos
 * @example path = "files/uid/preview" as folder
 */
export const getFiles = async (path: string): Promise<Result<Metadata[]>> => {
  try {
    const result = await storageService.getFilesWithMetadata(path)
    if (!result.success) throw new ErrorAPI(result.error)
    return success(result.data)
  } catch (e) { return failure(new ErrorAPI(normalizeError(e, 'obtener archivos'))) }
}

/**
 * Sube múltiples archivos
 * @param data: { path: string, files: File[], unique?: boolean }
 * @example data: { path: string, files: File[], unique?: boolean }
 */
export const uploadFiles = async (data: FileReference): Promise<Result<void>> => {
  try {
    if (!data.files) throw new Error('No se proporcionaron archivos válidos');
    const result = data.unique
      ? await storageService.uploadFile(data.files[0], data.path)
      : await storageService.uploadFiles(data.files, data.path)
    if (!result.success) throw new ErrorAPI(result.error)
    return success(undefined)
  } catch (e) { return failure(new ErrorAPI(normalizeError(e, 'subir archivos'))) }
}

/**
 * Elimina un archivo específico
 * @param path: corresponde a la ruta del archivo
 * @example path = "files/uid/preview" as file
 */
export const deleteFile = async (path: string): Promise<Result<void>> => {
  try {
    const folderPath = path.split('/').slice(0, -1).join('/')
    const files = await storageService.getFiles(folderPath)
    if (!files.success) throw new ErrorAPI(files.error)
    if (files.data.length === 0) return success(undefined)
    const result = await storageService.deleteFile(path)
    if (!result.success) throw new ErrorAPI(result.error)
    return success(undefined)
  } catch (e) { return failure(new ErrorAPI(normalizeError(e, 'eliminar archivo'))) }
}