import { UseMutateFunction, UseQueryResult } from "@tanstack/react-query"
import { LocationType, UserType } from "@/interfaces/context.interface"

export interface UpdateMutationProps { id: string; data: Partial<any> }
export interface DeleteMutationProps { id: string }

/*--------------------------------------------------To product--------------------------------------------------*/
/*useQuery and useMutation*/
export type QueryReact_Location = {
  fetchAllLocations: <T>(path: LocationType) => UseQueryResult<T[], Error>
  fetchLocationById: <T>(path: LocationType, id: string) => UseQueryResult<T | undefined, Error>
  fetchLocationByQuery: <T>(path: LocationType, query: object, populate?: string) => UseQueryResult<T[], Error>
}
export type CustomMutation_Location = {
  createLocation: UseMutateFunction<void, Error, object, unknown>
  updateLocation: UseMutateFunction<void, Error, UpdateMutationProps, unknown>
  deleteLocation: UseMutateFunction<void, Error, DeleteMutationProps, unknown>
  isLoading: boolean
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------To user--------------------------------------------------*/
/*useQuery and useMutation*/
export type QueryReact_User = {
  fetchAllUsers: <T>(path: UserType) => UseQueryResult<T[], Error>
  fetchUserById: <T>(path: UserType, id: string) => UseQueryResult<T | undefined, Error>
  fetchUserByQuery: <T>(path: UserType, query: object, populate?: string) => UseQueryResult<T[], Error>
}
export type CustomMutation_User = {
  createUser: UseMutateFunction<void, Error, object, unknown>
  updateUser: UseMutateFunction<void, Error, UpdateMutationProps, unknown>
  deleteUser: UseMutateFunction<void, Error, DeleteMutationProps, unknown>
  isLoading: boolean
}
/*---------------------------------------------------------------------------------------------------------*/

