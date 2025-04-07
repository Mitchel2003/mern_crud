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
/** To convert context to spanish */
export const convertRole = (str: RoleProps) => {
  switch (str) {
    case "client": return "cliente"
    case "company": return "proveedor de servicios"
    case "engineer": return "ingeniero"
    case "admin": return "administrador"
    default: return str
  }
}
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
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------format pdf--------------------------------------------------*/
/* Función auxiliar para generar tags basados en el tipo de inspección */
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
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------format errors--------------------------------------------------*/

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
  if (e instanceof ErrorAPI) { //If have specific details, include them in the message
    if (e.details && typeof e.details === 'object' && 'message' in e.details) return `${e.message}: ${e.details.message}`
    return e.message || 'Error en la operación'
  }
  if (e instanceof Error) return e.message || 'Error desconocido' //standard error
  return typeof e === 'string' ? e : 'Error desconocido' //another case
}

/*--------------------------------------------------format alerts--------------------------------------------------*/
type Context =
  // AuthContext
  | 'login' | 'logout'
  | 'getAllUser' | 'getUserById' | 'getUserByQuery' | 'createUser' | 'updateUser' | 'deleteUser'
  | 'send-reset-pass' | 'forgot-password' | 'reset-password'
  // Messaging
  | 'send-notification' | 'update-token-messaging' | 'setup-messaging-listener'
  | 'expired-token'

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

    // Default case
    default: return { title: !e ? 'Acción completada' : 'Error en la acción', message: !e ? 'La acción se ha completado correctamente' : errorMessage }
  }
}