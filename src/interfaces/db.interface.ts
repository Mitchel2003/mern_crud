import { User } from "@/interfaces/context.interface";

/*--------------------------------------------------results DB--------------------------------------------------*/
type IError = { message: string, code?: string, details?: unknown, statusCode?: number }
export interface Success<T> { success: true, data: T }
export interface Failure { success: false; error: IError }

export type Result<T> = Success<T> | Failure //Result either
export const success = <T>(data: T): Success<T> => ({ success: true, data })
export const failure = (error: IError): Failure => ({ success: false, error })

export interface AxiosResponse<T = IError> { response: { data: T } }

export function isAxiosResponse(e: unknown): e is AxiosResponse {
  return (typeof e === "object" && e !== null && "response" in e)
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Construye un objeto usuario basado en los datos "auth" de firebase.
 * @param {any} auth - Los datos del usuario, corresponde al User de firebase.
 * @returns {User | null} - El objeto de usuario construido o null si los datos no son válidos.
 */
export const buildAuth = (auth: any): User => (typeof auth === "object" ? { email: auth.email } : null)
/*---------------------------------------------------------------------------------------------------------*/