import { UseMutateAsyncFunction, UseQueryResult } from "@tanstack/react-query"
import { FormatType, LocationType } from "@/interfaces/context.interface"
import { UserFormProps } from "@/schemas/auth/auth.schema"
import { FileReference } from "@/interfaces/db.interface"

export interface FileMutationProps extends FileReference { }
export interface UpdateMutationProps { id: string; data: Partial<any> }
export interface DeleteMutationProps { id: string }

export interface QueryConfig { enabled?: boolean }
export interface QueryOptions extends QueryConfig {
  [key: string]: any
}
/*--------------------------------------------------to user--------------------------------------------------*/
/*useQuery and useMutation*/
export type QueryReact_User = {
  fetchAllUsers: <T>(config?: QueryConfig) => UseQueryResult<T[], Error>
  fetchUserById: <T>(id: string, config?: QueryConfig) => UseQueryResult<T | undefined, Error>
  fetchUserByQuery: <T>(query: QueryOptions) => UseQueryResult<T[], Error>
}
export type CustomMutation_User = {
  createUser: UseMutateAsyncFunction<any, Error, UserFormProps, unknown>
  updateUser: UseMutateAsyncFunction<any, Error, UpdateMutationProps, unknown>
  deleteUser: UseMutateAsyncFunction<any, Error, DeleteMutationProps, unknown>
  isLoading: boolean
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------to location--------------------------------------------------*/
/*useQuery and useMutation*/
export type QueryReact_Location = {
  fetchAllLocations: <T>(path: LocationType, config?: QueryConfig) => UseQueryResult<T[], Error>
  fetchLocationById: <T>(path: LocationType, id: string, config?: QueryConfig) => UseQueryResult<T | undefined, Error>
  fetchLocationByQuery: <T>(path: LocationType, query: QueryOptions) => UseQueryResult<T[], Error>
}
export type CustomMutation_Location = {
  createLocation: UseMutateAsyncFunction<any, Error, object, unknown>
  updateLocation: UseMutateAsyncFunction<any, Error, UpdateMutationProps, unknown>
  deleteLocation: UseMutateAsyncFunction<any, Error, DeleteMutationProps, unknown>
  isLoading: boolean
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------to format--------------------------------------------------*/
/*useQuery and useMutation*/
export type QueryReact_Format = {
  fetchAllFormats: <T>(path: FormatType, config?: QueryConfig) => UseQueryResult<T[], Error>
  fetchFormatById: <T>(path: FormatType, id: string, config?: QueryConfig) => UseQueryResult<T | undefined, Error>
  fetchFormatByQuery: <T>(path: FormatType, query: QueryOptions) => UseQueryResult<T[], Error>
  fetchAllFiles: <T>(data: FileReference) => UseQueryResult<T[], Error>
  fetchQueriesCV: <T>(data: any[]) => {
    data?: { type: string; id: string; data: T[]; error: any }
    isFetching: boolean
    isLoading: boolean
    isError: boolean
    error: any
  }[]
}
export type CustomMutation_Format = {
  createFormat: UseMutateAsyncFunction<any, Error, object, unknown>
  updateFormat: UseMutateAsyncFunction<any, Error, UpdateMutationProps, unknown>
  deleteFormat: UseMutateAsyncFunction<any, Error, DeleteMutationProps, unknown>
  createFile: UseMutateAsyncFunction<any, Error, FileMutationProps, unknown>
  deleteFile: UseMutateAsyncFunction<any, Error, FileMutationProps, unknown>
  deleteFolder: UseMutateAsyncFunction<any, Error, FileMutationProps, unknown>
  isLoading: boolean
}
/*---------------------------------------------------------------------------------------------------------*/