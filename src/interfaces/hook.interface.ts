import { FileReferenceDB, Paginate, SearchParams } from "@/interfaces/db.interface"
import { FormatType, LocationType, UserType } from "@/interfaces/context.interface"
import { UseMutateAsyncFunction, UseQueryResult } from "@tanstack/react-query"

export interface FileMutationProps extends FileReferenceDB { }
export interface UpdateMutationProps { id: string; data: Partial<any> }
export interface DeleteMutationProps { id: string }

/*--------------------------------------------------to user--------------------------------------------------*/
/*useQuery and useMutation*/
export type QueryReact_User = {
  fetchAllUsers: <T>(path: UserType) => UseQueryResult<T[], Error>
  fetchUserById: <T>(path: UserType, id: string) => UseQueryResult<T | undefined, Error>
  fetchUserByQuery: <T>(path: UserType, query: object) => UseQueryResult<T[], Error>
}
export type CustomMutation_User = {
  createUser: UseMutateAsyncFunction<any, Error, object, unknown>
  updateUser: UseMutateAsyncFunction<any, Error, UpdateMutationProps, unknown>
  deleteUser: UseMutateAsyncFunction<any, Error, DeleteMutationProps, unknown>
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
  fetchFormatByPaginate: <T>(path: FormatType, search: SearchParams, filters: any[]) => UseQueryResult<Paginate<T>, Error>
  fetchAllFiles: <T>(path: FormatType, data: FileReferenceDB) => UseQueryResult<T[], Error>
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