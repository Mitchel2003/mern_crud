import { Fragment, ReactElement, cloneElement } from "react"
import { isAxiosResponse } from "@/interfaces/db.interface"
import { RoleProps } from "@/interfaces/context.interface"
import { useThemeContext } from "@/context/ThemeContext"

import { Separator } from "#/ui/separator"
import ErrorAPI from "@/errors"

/*--------------------------------------------------standard formats--------------------------------------------------*/
/** returns date in format dd/mm/yyyy or with custom separator
 * @param date - Date to format
 * @param separator - Character to use as separator (default: '/')
 */
export const formatDateTime = (date: Date | string | undefined, separator: string = '/'): string => date ? new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/[\.\/]/g, separator) : 'N/A'
/** returns date in format "dd de month yyyy" */
export const formatDate = (date: Date | string | undefined): string => date ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date)) : 'N/A'
/** To convert on plural */
export const toPlural = (str: string) => str.slice(-1) === 'y' ? str.slice(0, -1) + 'ies' : str + 's'
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------document formats--------------------------------------------------*/
/**
 * Determina el tipo de archivo basado en su extensión
 * @param {string} fileName - Nombre del archivo
 * @returns {string} Tipo de archivo en formato legible
 */
export const getFileType = (fileName: string): string => {
  if (!fileName) return 'Documento'
  const extension = fileName.split('.').pop()?.toLowerCase()
  const fileTypes: Record<string, string> = { pdf: 'Documento PDF', doc: 'Documento Word', docx: 'Documento Word', xls: 'Hoja de cálculo Excel', xlsx: 'Hoja de cálculo Excel' }
  return extension ? (fileTypes[extension] || `Archivo ${extension.toUpperCase()}`) : 'Documento'
}
/**
 * Extracts the metadata from a Firebase Storage URL
 * @param {string[]} urls - The full Firebase Storage file URL (metadata)
 * @returns {string[]} The extracted metadata, representing the file name
 * @example ["document.pdf", "document.docx"]
 */
export function extractMetadataUrl(urls: string[]): string[] | null {
  if (!urls || urls.length === 0) return null
  return urls.map((url) => {
    const decodedUrl = decodeURIComponent(url)
    const match = decodedUrl.match(/\/o\/(.+?)\?/)
    if (!match || !match[1]) return null
    //extract metadata (last segment of url)
    const fullPath = match[1] //select metadata
    const segments = fullPath.split('/')
    return segments[segments.length - 1]
  }).filter(Boolean) as string[]
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------alerts format--------------------------------------------------*/
type Context =
  // AuthContext
  | 'login' | 'logout'
  | 'send-reset-pass' | 'forgot-password' | 'reset-password'
  | 'getAllUser' | 'getUserById' | 'getUserByQuery' | 'createUser' | 'updateUser' | 'deleteUser'
  | 'send-notification' | 'update-token-messaging' | 'setup-messaging-listener' | 'expired-token' //Messaging
  // FormatContext
  | 'getAllFiles' | 'upload-files' | 'delete-file' | 'delete-folder'
  | 'getAllFormat' | 'getFormatById' | 'getFormatByQuery' | 'createFormat' | 'updateFormat' | 'deleteFormat'
  // LocationContext
  | 'getAllLocation' | 'getLocationById' | 'getLocationByQuery' | 'createLocation' | 'updateLocation' | 'deleteLocation'

interface AlertContext { title: string; message: string }

/**
 * Función centralizada para generar mensajes de notificación según el contexto
 * @param context - Contexto de la notificación
 * @param e - Error opcional para mensajes de error
 * @returns Objeto con título y mensaje para la notificación
 */
export const txt = (context: Context, e?: any): AlertContext => {
  const errorMessage = e ? formatError(e) : ''
  switch (context) {
    /*--------------------------------------------------authContext--------------------------------------------------*/
    // Authentication
    case 'login': return { title: !e ? '¡Bienvenido!' : 'Error al iniciar sesión', message: !e ? 'Has iniciado sesión correctamente' : errorMessage }
    case 'logout': return { title: !e ? 'Sesión cerrada' : 'Error al cerrar sesión', message: !e ? 'Has cerrado sesión correctamente' : errorMessage }

    // User management
    case 'getAllUser': return { title: !e ? 'Usuarios obtenidos' : 'Error al obtener usuarios', message: !e ? 'Lista de usuarios cargada correctamente' : errorMessage }
    case 'getUserById': return { title: !e ? 'Usuario obtenido' : 'Error al obtener usuario', message: !e ? 'Datos de usuario cargados correctamente' : errorMessage }
    case 'getUserByQuery': return { title: !e ? 'Usuarios obtenidos' : 'Error al obtener usuarios', message: !e ? 'Lista de usuarios cargada correctamente' : errorMessage }
    case 'createUser': return { title: !e ? 'Registro exitoso' : 'Error en el registro', message: !e ? 'La cuenta ha sido creada correctamente' : errorMessage }
    case 'updateUser': return { title: !e ? 'Actualización exitosa' : 'Error al actualizar', message: !e ? 'Las credenciales han sido actualizadas correctamente' : errorMessage }
    case 'deleteUser': return { title: !e ? 'Eliminación exitosa' : 'Error al eliminar cuenta', message: !e ? 'La cuenta ha sido eliminada permanentemente' : errorMessage }

    // Password management
    case 'send-reset-pass': return { title: !e ? "Éxito al enviar solicitud" : "Error en la solicitud", message: !e ? "Se ha enviado un correo para restablecer tu contraseña" : errorMessage }
    case 'forgot-password': return { title: !e ? 'Correo enviado' : 'Error al enviar correo', message: !e ? 'Se ha enviado un correo para restablecer tu contraseña' : errorMessage }
    case 'reset-password': return { title: !e ? 'Contraseña restablecida' : 'Error al restablecer contraseña', message: !e ? 'Tu contraseña ha sido restablecida correctamente' : errorMessage }

    // Notifications and messaging
    case 'send-notification': return { title: !e ? 'Notificación enviada' : 'Error al enviar notificación', message: !e ? 'La notificación se ha enviado correctamente' : errorMessage }
    case 'update-token-messaging': return { title: !e ? 'Token actualizado' : 'Error al actualizar token', message: !e ? 'El token de mensajería ha sido actualizado' : errorMessage }
    case 'setup-messaging-listener': return { title: !e ? 'Nueva notificación' : 'Error al configurar listener de mensajería', message: !e ? 'Revisa la bandeja de entrada' : errorMessage }
    case 'expired-token': return { title: !e ? 'Token expirado, por favor, inicie sesión nuevamente' : 'Error al renovar token', message: !e ? 'El token de mensajería ha expirado' : errorMessage }
    /*---------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------formatContext--------------------------------------------------*/
    case 'getAllFormat': return { title: !e ? 'Formatos obtenidos' : 'Error al obtener formatos', message: !e ? 'Los formatos han sido obtenidos correctamente' : errorMessage }
    case 'getFormatById': return { title: !e ? 'Formato obtenido' : 'Error al obtener formato', message: !e ? 'El formato ha sido obtenido correctamente' : errorMessage }
    case 'getFormatByQuery': return { title: !e ? 'Formatos obtenidos' : 'Error al obtener formatos', message: !e ? 'Los formatos han sido obtenidos correctamente' : errorMessage }
    case 'createFormat': return { title: !e ? 'Formato creado' : 'Error al crear formato', message: !e ? 'El formato ha sido creado correctamente' : errorMessage }
    case 'updateFormat': return { title: !e ? 'Formato actualizado' : 'Error al actualizar formato', message: !e ? 'El formato ha sido actualizado correctamente' : errorMessage }
    case 'deleteFormat': return { title: !e ? 'Formato eliminado' : 'Error al eliminar formato', message: !e ? 'El formato ha sido eliminado correctamente' : errorMessage }
    case 'getAllFiles': return { title: !e ? 'Archivos obtenidos' : 'Error al obtener archivos', message: !e ? 'Los archivos han sido obtenidos correctamente' : errorMessage }
    case 'upload-files': return { title: !e ? 'Archivos subidos' : 'Error al subir archivos', message: !e ? 'Los archivos han sido subidos correctamente' : errorMessage }
    case 'delete-file': return { title: !e ? 'Archivo eliminado' : 'Error al eliminar archivo', message: !e ? 'El archivo ha sido eliminado correctamente' : errorMessage }
    case 'delete-folder': return { title: !e ? 'Carpeta eliminada' : 'Error al eliminar carpeta', message: !e ? 'La carpeta ha sido eliminada correctamente' : errorMessage }
    /*---------------------------------------------------------------------------------------------------------*/

    /*--------------------------------------------------locationContext--------------------------------------------------*/
    case 'getAllLocation': return { title: !e ? 'Ubicaciones obtenidas' : 'Error al obtener ubicaciones', message: !e ? 'La lista de ubicaciones ha sido obtenida correctamente' : errorMessage }
    case 'getLocationById': return { title: !e ? 'Ubicación obtenida' : 'Error al obtener ubicación', message: !e ? 'La ubicación ha sido obtenida correctamente' : errorMessage }
    case 'getLocationByQuery': return { title: !e ? 'Ubicaciones obtenidas' : 'Error al obtener ubicaciones', message: !e ? 'La lista de ubicaciones ha sido obtenida correctamente' : errorMessage }
    case 'createLocation': return { title: !e ? 'Ubicación creada' : 'Error al crear ubicación', message: !e ? 'La ubicación ha sido creada correctamente' : errorMessage }
    case 'updateLocation': return { title: !e ? 'Ubicación actualizada' : 'Error al actualizar ubicación', message: !e ? 'La ubicación ha sido actualizada correctamente' : errorMessage }
    case 'deleteLocation': return { title: !e ? 'Ubicación eliminada' : 'Error al eliminar ubicación', message: !e ? 'La ubicación ha sido eliminada correctamente' : errorMessage }

    /*--------------------------------------------------default--------------------------------------------------*/
    default: return { title: !e ? 'Acción completada' : 'Error en la acción', message: !e ? 'La acción se ha completado correctamente' : errorMessage }
  }
}
/**
 * Formatea un error para obtener un mensaje legible para el usuario
 * Maneja diferentes tipos de errores: Axios, ErrorAPI (incluyendo Firebase normalizado), Error estándar, etc.
 * @param e - El error a formatear (puede ser cualquier tipo)
 * @returns Un mensaje de error formateado
 */
export const formatError = (e: unknown): string => {
  if (isAxiosResponse(e)) {
    const res = e.response?.data //axios response data
    if (res && typeof res === 'object' && 'details' in res) return `${res.message}: ${res.details.message}`
    return res.message || 'Error en la respuesta del servidor'
  }
  if (e instanceof ErrorAPI) { //include details in the message
    if (e.details && typeof e.details === 'object') {
      const details = e.details as Record<string, any>
      if ('message' in details && details.message) {
        if ('code' in details && details.message.includes(details.code)) return e.message
        else return `${e.message}: ${String(details.message)}`
      }
      if ('code' in details && details.code) return `${e.message} (${String(details.code)})`
    }
    return e.message || 'Error en la operación'
  }
  if (e instanceof Error) return e.message || 'Error desconocido'
  return typeof e === 'string' ? e : 'Error desconocido'
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------helpers format--------------------------------------------------*/
/** To render format components dynamically */
export const RenderFormat = ({ format }: { format: ReactElement[] }) => {
  const { theme } = useThemeContext()
  return format.map((e, i) => (
    <Fragment key={i}>
      {cloneElement(e)}
      <Separator className={`my-8 ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-300'}`} />
    </Fragment>
  ))
}
/** To generate tags based on the type of inspection (pdf) */
export const getInspectionTags = (inspection: string) => {
  const tags = []
  if (inspection.toLowerCase().includes('físic')) tags.push('Física')
  if (inspection.toLowerCase().includes('mecánic')) tags.push('Mecánica')
  if (inspection.toLowerCase().includes('eléctric')) tags.push('Eléctrica')
  if (inspection.toLowerCase().includes('seguridad')) tags.push('Seguridad')
  if (inspection.toLowerCase().includes('prueba')) tags.push('Prueba')
  if (tags.length === 0) tags.push('General')
  return tags
}
/** To convert context to spanish */
export const convertRole = (str: RoleProps) => {
  switch (str) {
    case "client": return "cliente"
    case "company": return "prestador de servicio"
    case "collaborator": return "colaborador"
    case "admin": return "administrador"
    default: return str
  }
}
/** To convert technical specification to spanish */
export const toLabel_technicalSpecification = (key: string) => {
  switch (key) {
    case 'voltage':
      return 'VOLTAJE (V)'
    case 'amperage':
      return 'CORRIENTE (A)'
    case 'power':
      return 'POTENCIA'
    case 'frequency':
      return 'FRECUENCIA (Hz)'
    case 'capacity':
      return 'CAPACIDAD'
    case 'pressure':
      return 'PRESION (PSI)'
    case 'speed':
      return 'VELOCIDAD (RPM)'
    case 'humidity':
      return 'HUMEDAD (%)'
    case 'temperature':
      return 'TEMPERATURA (°C)'
    case 'weight':
      return 'PESO (Kg)'
    default:
      return key.toUpperCase()
  }
}