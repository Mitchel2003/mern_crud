import { FormatType, LocationType, UserType } from "@/interfaces/context.interface"
import { UseMutateAsyncFunction, UseMutateFunction, UseQueryResult } from "@tanstack/react-query"
import { FileDB } from "@/interfaces/db.interface"

export interface FileMutationProps extends FileDB { }
export interface UpdateMutationProps { id: string; data: Partial<any> }
export interface DeleteMutationProps { id: string }

/*--------------------------------------------------to user--------------------------------------------------*/
/*useQuery and useMutation*/
export type QueryReact_User = {
  fetchAllUsers: <T>(path: UserType) => UseQueryResult<T[], Error>
  fetchUserById: <T>(path: UserType, id: string) => UseQueryResult<T | undefined, Error>
  fetchUserByQuery: <T>(path: UserType, query: string) => UseQueryResult<T[], Error>
}
export type CustomMutation_User = {
  createUser: UseMutateFunction<void, Error, object, unknown>
  updateUser: UseMutateFunction<void, Error, UpdateMutationProps, unknown>
  deleteUser: UseMutateFunction<void, Error, DeleteMutationProps, unknown>
  isLoading: boolean
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------to location--------------------------------------------------*/
/*useQuery and useMutation*/
export type QueryReact_Location = {
  fetchAllLocations: <T>(path: LocationType) => UseQueryResult<T[], Error>
  fetchLocationById: <T>(path: LocationType, id: string) => UseQueryResult<T | undefined, Error>
  fetchLocationByQuery: <T>(path: LocationType, query: string) => UseQueryResult<T[], Error>
}
export type CustomMutation_Location = {
  createLocation: UseMutateFunction<void, Error, object, unknown>
  updateLocation: UseMutateFunction<void, Error, UpdateMutationProps, unknown>
  deleteLocation: UseMutateFunction<void, Error, DeleteMutationProps, unknown>
  isLoading: boolean
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------to format--------------------------------------------------*/
/*useQuery and useMutation*/
export type QueryReact_Format = {
  fetchAllFormats: <T>(path: FormatType) => UseQueryResult<T[], Error>
  fetchFormatById: <T>(path: FormatType, id: string) => UseQueryResult<T | undefined, Error>
  fetchFormatByQuery: <T>(path: FormatType, query: string) => UseQueryResult<T[], Error>
  fetchAllFiles: <T>(path: FormatType, data: FileDB) => UseQueryResult<T[], Error>
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