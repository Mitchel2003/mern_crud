import { UseMutateFunction, UseMutationResult, UseQueryResult } from "@tanstack/react-query"
import { Curriculum, LocationType } from "@/interfaces/context.interface"

/*-------------------------useQuery and useMutation-------------------------*/
export type QueryReact_CV = {//to curriculum
  fetchCV: (id: string) => UseQueryResult<Curriculum, Error>
  fetchCVs: () => UseQueryResult<Curriculum[], Error>
}
export type CustomMutation_CV = {
  createOrUpdateCV: (id: string) => UseMutationResult<Curriculum, Error, object, unknown>
  deleteCV: () => UseMutationResult<Curriculum, Error, string, unknown>
}

export type QueryReact_Location = {//to location
  fetchAllLocations: <T>(path: LocationType) => UseQueryResult<T[], Error>
  fetchLocationById: <T>(path: LocationType, id: string) => UseQueryResult<T | undefined, Error>
  fetchLocationByQuery: <T>(path: LocationType, query: object, populate?: string) => UseQueryResult<T[], Error>
}
export type CustomMutation_Location = {
  createLocation: UseMutateFunction<void, Error, object, unknown>
  updateLocation: UseMutateFunction<void, Error, object, unknown>
  deleteLocation: UseMutateFunction<void, Error, string, unknown>
  isLoading: boolean
}