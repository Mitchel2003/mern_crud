import { cityDefaultValues, countryDefaultValues, headquarterDefaultValues, officeDefaultValues, stateDefaultValues } from "@/utils/constants"
import { City, Client, Country, State, Headquarter, Office } from "@/interfaces/context.interface"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useCallback, useEffect, useRef, useState } from "react"
import { useFormSubmit } from "@/hooks/core/useFormSubmit"
import { useQueryUser } from "@/hooks/query/useUserQuery"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  citySchema, CityFormProps,
  stateSchema, StateFormProps,
  officeSchema, OfficeFormProps,
  countrySchema, CountryFormProps,
  headquarterSchema, HeadquarterFormProps
} from "@/schemas/location/location.schema"

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
    mode: "onSubmit",
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
    onSubmit: async (data: any) => {
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

/**
 * Hook personalizado para manejar el formulario de creación o actualización de sedes
 * @param id - ID de la sede a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useHeadquarterForm = (id?: string, onSuccess?: () => void) => {
  const { createLocation, updateLocation, isLoading } = useLocationMutation('headquarter')
  const { fetchAllLocations, fetchLocationById } = useQueryLocation()
  const { data: headquarter } = fetchLocationById<Headquarter>('headquarter', id as string)
  const { data: clients } = useQueryUser().fetchAllUsers<Client>('client')
  const { data: countries } = fetchAllLocations<Country>('country')
  const { data: states } = fetchAllLocations<State>('state')
  const { data: cities } = fetchAllLocations<City>('city')

  const methods = useForm<HeadquarterFormProps>({
    resolver: zodResolver(headquarterSchema),
    defaultValues: headquarterDefaultValues,
    mode: "onSubmit",
  })

  useEffect(() => {
    headquarter && methods.reset({
      name: headquarter.name,
      address: headquarter.address,
      city: headquarter.city?._id || '',
      client: headquarter.client?._id || '',
      state: headquarter.city.state?._id || '',
      country: headquarter.city.state.country?._id || ''
    })
  }, [headquarter, cities, clients])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: any) => {
      const format = { name: data.name, city: data.city, client: data.client, address: data.address }
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
    mode: "onSubmit",
  })

  useEffect(() => {
    city && methods.reset({
      name: city.name,
      state: city.state?._id || ''
    })
  }, [city, states])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: any) => {
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
    mode: "onSubmit",
  })

  useEffect(() => {
    state && methods.reset({
      name: state.name,
      country: state.country?._id || ''
    })
  }, [state, countries])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: any) => {
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
    country && methods.reset({
      name: country.name
    })
  }, [country])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: any) => {
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

export const useCountryTable = () => {
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined)
  const { deleteLocation } = useLocationMutation("country")
  const isOperating = useRef(false)

  const deleteCountry = useCallback(async (id: string) => {
    if (isOperating.current) return
    isOperating.current = true
    await deleteLocation({ id }).finally(() => {
      setOnDelete(undefined)
      isOperating.current = false
    })
  }, [deleteLocation])

  useEffect(() => {
    onDelete && deleteCountry(onDelete)
  }, [onDelete, deleteCountry])

  return {
    handleDelete: (id: string) => setOnDelete(id)
  }
}