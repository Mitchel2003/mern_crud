import { UseMutateAsyncFunction, UseQueryResult } from "@tanstack/react-query"
import { FormatType, LocationType } from "@/interfaces/context.interface"
import { FileReference } from "@/interfaces/db.interface"

export interface FileMutationProps extends FileReference { }
export interface UpdateMutationProps { id: string; data: Partial<any> }
export interface DeleteMutationProps { id: string }

/*--------------------------------------------------to user--------------------------------------------------*/
/*useQuery and useMutation*/
export type QueryReact_User = {
  fetchAllUsers: <T>() => UseQueryResult<T[], Error>
  fetchUserById: <T>(id: string) => UseQueryResult<T | undefined, Error>
  fetchUserByQuery: <T>(query: object) => UseQueryResult<T[], Error>
}
export type CustomMutation_User = {
  updateUser: UseMutateAsyncFunction<any, Error, UpdateMutationProps, unknown>
  isLoading: boolean
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------to location--------------------------------------------------*/
/*useQuery and useMutation*/
export type QueryReact_Location = {
  fetchAllLocations: <T>(path: LocationType) => UseQueryResult<T[], Error>
  fetchLocationById: <T>(path: LocationType, id: string) => UseQueryResult<T | undefined, Error>
  fetchLocationByQuery: <T>(path: LocationType, query: object) => UseQueryResult<T[], Error>
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
  fetchAllFormats: <T>(path: FormatType) => UseQueryResult<T[], Error>
  fetchFormatById: <T>(path: FormatType, id: string) => UseQueryResult<T | undefined, Error>
  fetchFormatByQuery: <T>(path: FormatType, query: object) => UseQueryResult<T[], Error>
  fetchAllFiles: <T>(data: FileReference) => UseQueryResult<T[], Error>
  fetchAllQueries: <T>(data: any[]) => {
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
  createFile: UseMutateAsyncFunction<void, Error, FileMutationProps, unknown>
  deleteFile: UseMutateAsyncFunction<void, Error, FileMutationProps, unknown>
  isLoading: boolean
}
/*---------------------------------------------------------------------------------------------------------*/