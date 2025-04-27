import { cityDefaultValues, countryDefaultValues, headquarterDefaultValues, officeDefaultValues, stateDefaultValues } from "@/constants/values.constants"
import { City, Country, State, Headquarter, Office, User } from "@/interfaces/context.interface"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useFormSubmit } from "@/hooks/core/useFormSubmit"
import { useQueryUser } from "@/hooks/query/useAuthQuery"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import {
  citySchema, CityFormProps,
  stateSchema, StateFormProps,
  officeSchema, OfficeFormProps,
  countrySchema, CountryFormProps,
  headquarterSchema, HeadquarterFormProps
} from "@/schemas/location/location.schema"

/*--------------------------------------------------office form--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de creación o actualización de oficinas
 * @param id - ID de la oficina a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useOfficeForm = (id?: string, onSuccess?: () => void) => {
  const { createLocation, updateLocation, isLoading } = useLocationMutation('office')
  const { fetchAllLocations, fetchLocationById } = useQueryLocation()
  const { data: headquarters } = fetchAllLocations<Headquarter>('headquarter')
  const { data: office } = fetchLocationById<Office>('office', id as string)

  const methods = useForm<OfficeFormProps>({
    resolver: zodResolver(officeSchema),
    defaultValues: officeDefaultValues,
    mode: "onChange",
  })

  useEffect(() => {
    office && methods.reset({
      name: office.name,
      group: office.group || '',
      services: office.services || [],
      headquarter: office.headquarter?._id || ''
    })
  }, [office, methods.reset])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: OfficeFormProps) => {
      id ? updateLocation({ id, data }) : createLocation(data)
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    isLoading,
    ...handleSubmit,
    options: { headquarter: headquarters || [] }
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------headquarter form--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de creación o actualización de sedes
 * @param id - ID de la sede a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useHeadquarterForm = (id?: string, onSuccess?: () => void) => {
  const { createLocation, updateLocation, isLoading } = useLocationMutation('headquarter')
  const { fetchAllLocations, fetchLocationById } = useQueryLocation()
  const { data: headquarter } = fetchLocationById<Headquarter>('headquarter', id as string)
  const { data: clients } = useQueryUser().fetchUserByQuery<User>({ role: 'client' })
  const { data: countries } = fetchAllLocations<Country>('country')
  const { data: states } = fetchAllLocations<State>('state')
  const { data: cities } = fetchAllLocations<City>('city')

  const methods = useForm<HeadquarterFormProps>({
    resolver: zodResolver(headquarterSchema),
    defaultValues: headquarterDefaultValues,
    mode: "onChange",
  })

  useEffect(() => {
    headquarter && methods.reset({
      name: headquarter.name,
      address: headquarter.address,
      city: headquarter.city?._id || '',
      user: headquarter.user?._id || '',
      state: headquarter.city.state?._id || '',
      country: headquarter.city.state.country?._id || ''
    })
  }, [headquarter, cities, clients])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: HeadquarterFormProps) => {
      const { name, city, user, address } = data
      const format = { name, city, user, address }
      id ? updateLocation({ id, data: format }) : createLocation(format)
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    isLoading,
    ...handleSubmit,
    options: {
      cities: cities || [],
      states: states || [],
      clients: clients || [],
      countries: countries || [],
    }
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------city form--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de creación o actualización de ciudades
 * @param id - ID de la ciudad a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useCityForm = (id?: string, onSuccess?: () => void) => {
  const { createLocation, updateLocation, isLoading } = useLocationMutation('city')
  const { fetchAllLocations, fetchLocationById } = useQueryLocation()
  const { data: city } = fetchLocationById<City>('city', id as string)
  const { data: states } = fetchAllLocations<State>('state')

  const methods = useForm<CityFormProps>({
    resolver: zodResolver(citySchema),
    defaultValues: cityDefaultValues,
    mode: "onChange",
  })

  useEffect(() => {
    city && methods.reset({
      name: city.name,
      state: city.state?._id || ''
    })
  }, [city, states])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: CityFormProps) => {
      id ? updateLocation({ id, data }) : createLocation(data)
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    isLoading,
    ...handleSubmit,
    options: states?.map((e) => ({ value: e._id, label: e.name })) || []
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------state form--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de creación o actualización de departamentos
 * @param id - ID del departamento a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useStateForm = (id?: string, onSuccess?: () => void) => {
  const { createLocation, updateLocation, isLoading } = useLocationMutation('state')
  const { fetchAllLocations, fetchLocationById } = useQueryLocation()
  const { data: state } = fetchLocationById<State>('state', id as string)
  const { data: countries } = fetchAllLocations<Country>('country')

  const methods = useForm<StateFormProps>({
    resolver: zodResolver(stateSchema),
    defaultValues: stateDefaultValues,
    mode: "onChange",
  })

  useEffect(() => {
    state && methods.reset({
      name: state.name,
      country: state.country?._id || ''
    })
  }, [state, countries])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: StateFormProps) => {
      id ? updateLocation({ id, data }) : createLocation(data)
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    isLoading,
    ...handleSubmit,
    options: countries?.map((e) => ({ value: e._id, label: e.name })) || []
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------country form--------------------------------------------------*/
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
    mode: "onChange",
  })

  useEffect(() => {
    country && methods.reset({
      name: country.name
    })
  }, [country])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: CountryFormProps) => {
      id ? updateLocation({ id, data }) : createLocation(data)
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    isLoading,
    ...handleSubmit
  }
}
/*---------------------------------------------------------------------------------------------------------*/