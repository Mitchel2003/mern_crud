import { useLocationMutation, useQueryLocation } from "@/hooks/useLocationQuery"
import { City, Country, State } from "@/interfaces/context.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

import {
  citySchema, CityFormProps,
  cityUpdateSchema, CityUpdateFormProps,

  stateSchema, StateFormProps,
  stateUpdateSchema, StateUpdateFormProps,

  countrySchema, CountryFormProps,
  countryUpdateSchema, CountryUpdateFormProps,
} from "@/schemas/location.schema"

const cityDefaultValues = { name: '', state: '' }
const stateDefaultValues = { name: '', country: '' }
const countryDefaultValues = { name: '' }

/*--------------------------------------------------use create form--------------------------------------------------*/

/** Hook personalizado para manejar el formulario de creación de ciudades */
export const useCreateCityForm = () => {// to City
  const { createLocation: createCity } = useLocationMutation("city")

  const methods = useForm<CityFormProps>({
    resolver: zodResolver(citySchema),
    defaultValues: cityDefaultValues,
    mode: "onSubmit",
  })

  const onSubmit = methods.handleSubmit(async (data: any) => {
    createCity(data)
    methods.reset()
  })

  return { methods, onSubmit }
}

/** Hook personalizado para manejar el formulario de creación de estados "departamentos" */
export const useCreateStateForm = () => {// to State
  const { createLocation: createState } = useLocationMutation("state")

  const methods = useForm<StateFormProps>({
    resolver: zodResolver(stateSchema),
    defaultValues: stateDefaultValues,
    mode: "onSubmit",
  })

  const onSubmit = methods.handleSubmit(async (data: any) => {
    createState(data)
    methods.reset()
  })

  return { methods, onSubmit }
}

/** Hook personalizado para manejar el formulario de creación de países */
export const useCreateCountryForm = () => {// to Country
  const { createLocation: createCountry } = useLocationMutation("country")

  const methods = useForm<CountryFormProps>({
    resolver: zodResolver(countrySchema),
    defaultValues: countryDefaultValues,
    mode: "onSubmit",
  })

  const onSubmit = methods.handleSubmit(async (data: any) => {
    createCountry(data)
    methods.reset()
  })

  return { methods, onSubmit }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------use update form--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de actualización de ciudades
 * @param city - Ciudad actual a actualizar
 */
export const useUpdateCityForm = (city: City) => {// to City
  const { updateLocation: updateCity } = useLocationMutation("city")

  const methods = useForm<CityUpdateFormProps>({
    resolver: zodResolver(cityUpdateSchema),
    defaultValues: cityDefaultValues,
    mode: "onSubmit"
  })

  // Cargar datos iniciales de la ciudad
  useEffect(() => {
    city && methods.reset({
      name: city.name,
      state: city.state._id
    })
  }, [city])

  const onSubmit = methods.handleSubmit(async (data: any) => {
    updateCity({ id: city?._id as string, data })
    methods.reset()
  })

  return { methods, onSubmit }
}

/**
 * Hook personalizado para manejar el formulario de actualización de estados "departamentos"
 * @param state - Estado actual a actualizar
 */
export const useUpdateStateForm = (state: State) => {// to State
  const { updateLocation: updateState } = useLocationMutation("state")

  const methods = useForm<StateUpdateFormProps>({
    resolver: zodResolver(stateUpdateSchema),
    defaultValues: stateDefaultValues,
    mode: "onSubmit"
  })

  // Cargar datos iniciales del estado "departamento"
  useEffect(() => {
    state && methods.reset({
      name: state.name,
      country: state.country._id
    })
  }, [state])

  const onSubmit = methods.handleSubmit(async (data: any) => {
    updateState({ id: state?._id as string, data })
    methods.reset()
  })

  return { methods, onSubmit }
}

/**
 * Hook personalizado para manejar el formulario de actualización de países
 * @param country - País actual a actualizar
 */
export const useUpdateCountryForm = (country: Country) => {// to Country
  const { updateLocation: updateCountry } = useLocationMutation("country")

  const methods = useForm<CountryUpdateFormProps>({
    resolver: zodResolver(countryUpdateSchema),
    defaultValues: countryDefaultValues,
    mode: "onSubmit"
  })

  // Cargar datos iniciales del país
  useEffect(() => {
    country && methods.reset({
      name: country.name
    })
  }, [country])

  const onSubmit = methods.handleSubmit(async (data: any) => {
    updateCountry({ id: country?._id as string, data })
    methods.reset()
  })

  return { methods, onSubmit }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de creación o actualización de ciudades
 * @param id - ID de la ciudad a actualizar
 */
export const useCityForm = (id?: string) => {// to City
  const { fetchLocationById } = useQueryLocation()
  const { data: city } = fetchLocationById<City>('city', id as string)

  const createForm = useCreateCityForm()
  const updateForm = useUpdateCityForm(city as City)
  return id ? updateForm : createForm
}

/**
 * Hook personalizado para manejar el formulario de creación o actualización de estados "departamentos"
 * @param id - ID del estado a actualizar
 */
export const useStateForm = (id?: string) => {// to State
  const { fetchLocationById } = useQueryLocation()
  const { data: state } = fetchLocationById<State>('state', id as string)

  const createForm = useCreateStateForm()
  const updateForm = useUpdateStateForm(state as State)
  return id ? updateForm : createForm
}

/**
 * Hook personalizado para manejar el formulario de creación o actualización de países
 * @param id - ID del país a actualizar
 */
export const useCountryForm = (id?: string) => {// to Country
  const { fetchLocationById } = useQueryLocation()
  const { data: country } = fetchLocationById<Country>('country', id as string)

  const createForm = useCreateCountryForm()
  const updateForm = useUpdateCountryForm(country as Country)
  return id ? updateForm : createForm
}
/*---------------------------------------------------------------------------------------------------------*/
