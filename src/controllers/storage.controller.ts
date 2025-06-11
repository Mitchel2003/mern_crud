/** Este módulo proporciona funciones para la gestión de archivos con Firebase Cloud Storage */
import { storageService } from "@/services/firebase/storage.service"
import { FileReference, Metadata } from "@/interfaces/db.interface"
import { normalizeError } from "@/errors/handler"
import ErrorAPI, { NotFound } from "@/errors"

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
 * Sube archivos de diferentes tipos (imagen, pdf, etc.)
 * @param {FileReference} data - Datos del archivo a subir
 * @returns {string} URL de la imagen subida en firebase storage
 * @example const data = { path: 'files/123/preview/img', file: file1 }
 */
export const uploadFile = async (data: FileReference): Promise<string> => {
  try {
    if (!data.file) throw new NotFound({ message: 'Archivo valido' })
    const result = await storageService.uploadFile(data.file, data.path)
    if (!result.success) throw result.error //is ErrorAPI
    return result.data //url reference of uploaded file
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

/**
 * Elimina una carpeta y todo su contenido (archivos y subcarpetas) recursivamente
 * @param path: corresponde a la ruta de la carpeta a eliminar
 * @example path = "files/uid/cv" donde cv es una carpeta que puede contener archivos y subcarpetas
 */
export const deleteFolder = async (path: string): Promise<void> => {
  try {
    const result = await storageService.deleteFolder(path)
    if (!result.success) throw result.error //is ErrorAPI
  } catch (e) { throw e instanceof ErrorAPI ? e : new ErrorAPI(normalizeError(e, 'eliminar carpeta')) }
}