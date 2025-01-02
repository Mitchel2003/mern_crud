import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useFormSubmit } from "@/hooks/auth/useFormSubmit"
import { Country } from "@/interfaces/context.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

import {
  countrySchema, CountryFormProps,
} from "@/schemas/location.schema"

const countryDefaultValues = { name: '' }

/**
 * Hook personalizado para manejar el formulario de creación o actualización de países
 * @param id - ID del país a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useCountryForm = (id?: string, onSuccess?: () => void) => {
  const { fetchLocationById } = useQueryLocation()
  const { data: country } = fetchLocationById<Country>('country', id as string)
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

  return { methods, isLoading, ...handleSubmit }
}
/*---------------------------------------------------------------------------------------------------------*/