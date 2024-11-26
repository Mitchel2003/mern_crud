import { UseMutationResult, UseQueryResult } from "@tanstack/react-query"
import { Country, Curriculum } from "@/interfaces/context.interface"
import { LucideIcon } from "lucide-react"

//items actions to dropdown (data-table)
export interface ItemActionProps {
  label: string
  icon: LucideIcon
  className?: string
  onClick: () => void | Promise<void>
}

/*-------------------------useQuery and useMutation-------------------------*/
//to curriculum
export type QueryReact_CV = {
  fetchCV: (id: string) => UseQueryResult<Curriculum, Error>
  fetchCVs: () => UseQueryResult<Curriculum[], Error>
}
export type CustomMutation_CV = {
  createOrUpdateCV: (id: string) => UseMutationResult<Curriculum, Error, object, unknown>
  deleteCV: () => UseMutationResult<Curriculum, Error, string, unknown>
}

//to country
export type QueryReact_Country = {
  fetchCountry: (id: string) => UseQueryResult<Country>
  fetchCountries: () => UseQueryResult<Country[]>
}
export type CustomMutation_Country = {
  createOrUpdateCountry: (id: string) => UseMutationResult<Country, Error, object>
  deleteCountry: () => UseMutationResult<Country, Error, string>
}