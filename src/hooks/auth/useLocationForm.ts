import { useLocationMutation, useQueryLocation } from "@/hooks/useLocationQuery"
import { Country } from "@/interfaces/context.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

import {
  countrySchema, CountryFormProps,
  countryUpdateSchema, CountryUpdateFormProps,
} from "@/schemas/location.schema"

const countryDefaultValues = { name: '' }

/*--------------------------------------------------useCreateForm--------------------------------------------------*/
/** Hook personalizado para manejar el formulario de creación de clientes */
export const useCreateCountryForm = () => {
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

/*--------------------------------------------------useUpdateForm--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de actualización de países
 * @param country - País actual a actualizar
 */

export const useUpdateCountryForm = (country: Country) => {
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
export const useCountryForm = (id?: string) => {// to Country
  const { fetchLocationById } = useQueryLocation()
  const { data: country } = fetchLocationById<Country>('country', id as string)

  const createForm = useCreateCountryForm()
  const updateForm = useUpdateCountryForm(country as Country)
  return id ? updateForm : createForm
}
/*---------------------------------------------------------------------------------------------------------*/
