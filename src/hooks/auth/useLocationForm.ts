import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { City, Country, State } from "@/interfaces/context.interface"
import { useFormSubmit } from "@/hooks/auth/useFormSubmit"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

import {
  citySchema, CityFormProps,
  stateSchema, StateFormProps,
  countrySchema, CountryFormProps,
} from "@/schemas/location.schema"

const cityDefaultValues = { name: '', state: '' }
const stateDefaultValues = { name: '', country: '' }
const countryDefaultValues = { name: '' }

/**
 * Hook personalizado para manejar el formulario de creación o actualización de ciudades
 * @param id - ID de la ciudad a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useCityForm = (id?: string, onSuccess?: () => void) => {
  const { fetchAllLocations, fetchLocationById } = useQueryLocation()
  const { data: states } = fetchAllLocations<State>('state')
  const { data: city } = fetchLocationById<City>('city', id as string)
  const { createLocation, updateLocation, isLoading } = useLocationMutation('city')

  const methods = useForm<CityFormProps>({
    resolver: zodResolver(citySchema),
    defaultValues: cityDefaultValues,
    mode: "onSubmit",
  })

  useEffect(() => {
    city && methods.reset({ name: city.name, state: city.state._id })
  }, [city])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: any) => { id ? updateLocation({ id, data }) : createLocation(data); methods.reset() },
    onSuccess
  }, methods)

  return {
    methods,
    isLoading,
    ...handleSubmit,
    options: states?.map((e) => ({ label: e.name, value: e._id })) || []
  }
}

/**
 * Hook personalizado para manejar el formulario de creación o actualización de departamentos
 * @param id - ID del departamento a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useStateForm = (id?: string, onSuccess?: () => void) => {
  const { fetchAllLocations, fetchLocationById } = useQueryLocation()
  const { data: countries } = fetchAllLocations<Country>('country')
  const { data: state } = fetchLocationById<State>('state', id as string)
  const { createLocation, updateLocation, isLoading } = useLocationMutation('state')

  const methods = useForm<StateFormProps>({
    resolver: zodResolver(stateSchema),
    defaultValues: stateDefaultValues,
    mode: "onSubmit",
  })

  useEffect(() => {
    state && methods.reset({ name: state.name, country: state.country._id })
  }, [state])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: any) => { id ? updateLocation({ id, data }) : createLocation(data); methods.reset() },
    onSuccess
  }, methods)

  return {
    methods,
    isLoading,
    ...handleSubmit,
    options: countries?.map((e) => ({ label: e.name, value: e._id })) || []
  }
}

/**
 * Hook personalizado para manejar el formulario de creación o actualización de países
 * @param id - ID del país a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useCountryForm = (id?: string, onSuccess?: () => void) => {
  const { data: country } = useQueryLocation().fetchLocationById<Country>('country', id as string)
  const { createLocation, updateLocation, isLoading } = useLocationMutation('country')

  const methods = useForm<CountryFormProps>({
    resolver: zodResolver(countrySchema),
    defaultValues: countryDefaultValues,
    mode: "onSubmit",
  })

  useEffect(() => {
    country && methods.reset({ name: country.name })
  }, [country])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: any) => { id ? updateLocation({ id, data }) : createLocation(data); methods.reset() },
    onSuccess
  }, methods)

  return {
    methods,
    isLoading,
    ...handleSubmit
  }
}