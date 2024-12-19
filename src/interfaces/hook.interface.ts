import { Curriculum, LocationType } from "@/interfaces/context.interface"
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query"

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
  fetchAllLocations: (path: LocationType) => UseQueryResult<unknown, Error>
  fetchLocationById: (path: LocationType, id: string) => UseQueryResult<unknown, Error>
  fetchLocationByQuery: (path: LocationType, query: object, populate?: string) => UseQueryResult<unknown, Error>
}