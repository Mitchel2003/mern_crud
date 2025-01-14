import { City, Client, Country, State, Headquarter, Area, Office, Service } from "@/interfaces/context.interface"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useFormSubmit } from "@/hooks/core/useFormSubmit"
import { useQueryUser } from "@/hooks/query/useUserQuery"
import { zodResolver } from "@hookform/resolvers/zod"
import { HandHelpingIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

import {
  citySchema, CityFormProps,
  stateSchema, StateFormProps,
  countrySchema, CountryFormProps,
  headquarterSchema, HeadquarterFormProps,
  areaSchema, AreaFormProps,
  officeSchema, OfficeFormProps,
  serviceSchema, ServiceFormProps,
} from "@/schemas/location.schema"

const countryDefaultValues = { name: '' }
const stateDefaultValues = { name: '', country: '' }
const cityDefaultValues = { name: '', state: '' }
const headquarterDefaultValues = { name: '', address: '', client: '', city: '' }
const areaDefaultValues = { name: '', headquarter: '' }
const officeDefaultValues = { name: '', area: '', services: [] }
const serviceDefaultValues = { name: '' }

/**
 * Hook personalizado para manejar el formulario de creación o actualización de servicios
 * @param id - ID del servicio a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useServiceForm = (id?: string, onSuccess?: () => void) => {
  const { data: service } = useQueryLocation().fetchLocationById<Service>('service', id as string)
  const { createLocation, updateLocation, isLoading } = useLocationMutation('service')

  const methods = useForm<ServiceFormProps>({
    resolver: zodResolver(serviceSchema),
    defaultValues: serviceDefaultValues,
    mode: "onSubmit",
  })

  useEffect(() => {
    service && methods.reset({ name: service.name })
  }, [service])

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

/**
 * Hook personalizado para manejar el formulario de creación o actualización de oficinas
 * @param id - ID de la oficina a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useOfficeForm = (id?: string, onSuccess?: () => void) => {
  const { fetchAllLocations, fetchLocationById } = useQueryLocation()
  const { data: office } = fetchLocationById<Office>('office', id as string)
  const { data: services } = fetchAllLocations<Service>('service')
  const { data: areas } = fetchAllLocations<Area>('area')
  const { createLocation, updateLocation, isLoading } = useLocationMutation('office')

  const methods = useForm<OfficeFormProps>({
    resolver: zodResolver(officeSchema),
    defaultValues: officeDefaultValues,
    mode: "onSubmit",
  })

  useEffect(() => {
    office && methods.reset({
      name: office.name,
      area: office.area?._id,
      services: office.services
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
    optionsService: services?.map((e) => ({ value: e.name, label: e.name, icon: HandHelpingIcon })) || [],
    optionsArea: areas?.map((e) => ({ value: e._id, label: `${e.name} - ${e.headquarter.address} - ${e.headquarter.client.name}` })) || [],
  }
}

/**
 * Hook personalizado para manejar el formulario de creación o actualización de áreas
 * @param id - ID del área a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useAreaForm = (id?: string, onSuccess?: () => void) => {
  const { fetchAllLocations, fetchLocationById } = useQueryLocation()
  const { data: headquarters } = fetchAllLocations<Headquarter>('headquarter')
  const { data: area } = fetchLocationById<Area>('area', id as string)
  const { createLocation, updateLocation, isLoading } = useLocationMutation('area')

  const methods = useForm<AreaFormProps>({
    resolver: zodResolver(areaSchema),
    defaultValues: areaDefaultValues,
    mode: "onSubmit",
  })

  useEffect(() => {
    area && methods.reset({
      name: area.name,
      headquarter: area.headquarter?._id
    })
  }, [area, headquarters])

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
    options: headquarters?.map((e) => ({ label: `${e.name} - ${e.client.name}`, value: e._id })) || []
  }
}

/**
 * Hook personalizado para manejar el formulario de creación o actualización de sedes
 * @param id - ID de la sede a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useHeadquarterForm = (id?: string, onSuccess?: () => void) => {
  const { fetchAllLocations, fetchLocationById } = useQueryLocation()
  const { data: headquarter } = fetchLocationById<Headquarter>('headquarter', id as string)
  const { data: clients } = useQueryUser().fetchAllUsers<Client>('client')
  const { data: cities } = fetchAllLocations<City>('city')
  const { createLocation, updateLocation, isLoading } = useLocationMutation('headquarter')

  const methods = useForm<HeadquarterFormProps>({
    resolver: zodResolver(headquarterSchema),
    defaultValues: headquarterDefaultValues,
    mode: "onSubmit",
  })

  useEffect(() => {
    headquarter && methods.reset({
      name: headquarter.name,
      address: headquarter.address,
      client: headquarter.client?._id,
      city: headquarter.city?._id
    })
  }, [headquarter, cities, clients])

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
    optionsCity: cities?.map((e) => ({ label: e.name, value: e._id })) || [],
    optionsClient: clients?.map((e) => ({ label: e.name, value: e._id })) || [],
  }
}

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
    city && methods.reset({ name: city.name, state: city.state?._id })
  }, [city, states])

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
    state && methods.reset({ name: state.name, country: state.country?._id })
  }, [state, countries])

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