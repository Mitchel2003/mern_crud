import { useLocationMutation, useQueryLocation } from "@/hooks/useLocationQuery"
import { Country, State } from "@/interfaces/context.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

import {
  countrySchema, CountryFormProps,
  countryUpdateSchema, CountryUpdateFormProps,

  stateSchema, StateFormProps,
  stateUpdateSchema, StateUpdateFormProps,
} from "@/schemas/location.schema"

const countryDefaultValues = { name: '' }
const stateDefaultValues = { name: '', country: '' }

/*--------------------------------------------------use create form--------------------------------------------------*/
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
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------use update form--------------------------------------------------*/
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

  // Cargar datos iniciales del país
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
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
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
/*---------------------------------------------------------------------------------------------------------*/
