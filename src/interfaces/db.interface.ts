import { Unsubscribe, User, UserCredential } from "firebase/auth"
import { RoleProps } from "@/interfaces/context.interface"

/*--------------------------------------------------results DB--------------------------------------------------*/
type IError = { message: string, code?: string, details?: any, statusCode?: number }
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
export type BaseMDB = {
  createdAt: Date
  updatedAt: Date
  _id: string
}
export interface Metadata {
  name: string
  url: string
}
export interface FileReference {
  enabled?: boolean
  unique?: boolean
  files?: File[]
  path: string
}
export interface AccountProps {
  password: string;
  email: string;
  phone: string;
  username: string;
  nit?: string; //to client and company
  invima?: string; //to company
  profesionalLicense?: string; //to company

  role: RoleProps;
  permissions?: string[];//to engineer and admin
  //if engineer, permissions are limited to their own clients (clientIds)
  //if admin, permissions are limited to their own companies (companyIds)
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------Firebase--------------------------------------------------*/
export interface AuthService {
  /*-----------------> authentication <-----------------*/
  logout(): Promise<Result<void>>
  login(email: string, password: string): Promise<Result<UserCredential>>
  registerAccount(credentials: AccountProps): Promise<Result<User>>
  /*-----------------> actions requests <-----------------*/
  sendEmailVerification(): Promise<Result<void>>
  sendEmailResetPassword(email: string): Promise<Result<void>>
  /*-----------------> handlers state <-----------------*/
  getCurrentUser(): User | null
  subscribeAuthChanges(listener: (user: User | null) => void): () => void
  cleanup(): void
}

export interface StorageService {
  /*-----------------> get <-----------------*/
  getFile(path: string): Promise<Result<string>>
  getFiles(path: string): Promise<Result<string[]>>
  getFilesWithMetadata(path: string): Promise<Result<Metadata[]>>
  /*-----------------> upload <-----------------*/
  uploadFile(file: File, path: string): Promise<Result<string>>
  uploadFiles(files: File[], path: string): Promise<Result<string[]>>
  /*-----------------> update <-----------------*/
  updateFile(file: File, path: string): Promise<Result<string>>
  deleteFile(path: string): Promise<Result<void>>
}

export interface MessagingService {
  /*-----------------> helpers <-----------------*/
  isSupported(): Promise<Result<boolean>>
  setupMessageListener(callback: (payload: any) => void): Promise<Result<Unsubscribe>>
  /*-----------------> actions requests <-----------------*/
  getTokenCloudMessaging(registration: ServiceWorkerRegistration): Promise<Result<string>>
}