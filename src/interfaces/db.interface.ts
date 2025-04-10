import { Unsubscribe, User, UserCredential } from "firebase/auth"
import ErrorAPI from "@/errors";

/*--------------------------------------------------results DB--------------------------------------------------*/
interface IError extends ErrorAPI { }
export interface Success<T> { success: true, data: T }
export interface Failure { success: false; error: IError }

export type Result<T> = Success<T> | Failure //Result either
export const success = <T>(data: T): Success<T> => ({ success: true, data })
export const failure = (error: IError): Failure => ({ success: false, error })

export interface AxiosResponse<T = IError> { response: { data: T } }
export const isAxiosResponse = (e: unknown): e is AxiosResponse => (typeof e === "object" && e !== null && "response" in e)
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
  path: string
  file?: File
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------Firebase--------------------------------------------------*/
export interface AuthService {
  /*-----------------> authentication <-----------------*/
  logout(): Promise<Result<void>>
  login(email: string, password: string): Promise<Result<UserCredential>>
  /*-----------------> actions requests <-----------------*/
  sendEmailVerification(): Promise<Result<void>>
  sendEmailResetPassword(email: string): Promise<Result<void>>
  /*-----------------> handlers state <-----------------*/
  getCurrentUser(): User | null
  subscribeAuthChanges(listener: (user: User | null) => void): () => void
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
  getTokenCloudMessaging(): Promise<Result<string>>
}