import { signMaintenanceDefaultValues, officeDefaultValues, headquarterDefaultValues, cityDefaultValues, stateDefaultValues, countryDefaultValues } from "@/constants/values.constants"
import { City, Country, State, Headquarter, Office, User, Signature, Maintenance } from "@/interfaces/context.interface"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { groupCollection as groups } from "@/constants/values.constants"
import { useFormatMutation } from "@/hooks/query/useFormatQuery"
import { useNotification } from "@/hooks/ui/useNotification"
import { useFormSubmit } from "@/hooks/core/useFormSubmit"
import { useQueryUser } from "@/hooks/query/useAuthQuery"
import { zodResolver } from "@hookform/resolvers/zod"
import { promisePool } from "@/utils/helpers"
import { dataUrlToFile } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import {
  citySchema, CityFormProps,
  stateSchema, StateFormProps,
  officeSchema, OfficeFormProps,
  countrySchema, CountryFormProps,
  headquarterSchema, HeadquarterFormProps,
  signMaintenanceSchema, SignMaintenanceFormProps,
} from "@/schemas/location/location.schema"

/*--------------------------------------------------sign maintenance form--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de creación o actualización de firmas
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useSignMaintenanceForm = (maintenances?: Maintenance[], onSuccess?: () => void) => {
  const { createLocation: createSignature } = useLocationMutation('signature')
  const { updateFormat: updateMaintenance } = useFormatMutation('maintenance')
  const { notifySuccess, notifyError } = useNotification()
  const { createFile } = useFormatMutation('file')
  const queryLocation = useQueryLocation()

  const headquarter = maintenances?.[0]?.curriculum?.office?.headquarter
  const { data: signature } = queryLocation.fetchLocationByQuery<Signature>('signature', { headquarter: headquarter?._id, enabled: !!headquarter })

  const methods = useForm<SignMaintenanceFormProps>({
    resolver: zodResolver(signMaintenanceSchema),
    defaultValues: signMaintenanceDefaultValues,
    mode: "onChange",
  })

  useEffect(() => { //to load the form on update mode "id"
    signature && methods.reset({ preview: signature?.[0]?.url || '' })
  }, [signature])

  /**
   * Función que se ejecuta cuando se envía el formulario
   * nos permite controlar el envío del formulario y la ejecución de la request
   * @param e - Valores del formulario
   */
  const handleSubmit = useFormSubmit({
    onSubmit: async (e: SignMaintenanceFormProps) => {
      //prepare and evaluate local fields (signature)
      let sign: Signature | undefined //signature ref
      const newSignature = e.signature?.[0]?.ref || e.image?.[0]?.ref
      const signedAt = new Date() //to save the date of the signature
      if (newSignature) { //in case was submitted a new signature, create a new reference
        let signatureFile: File | string //if the new signature is a file, use it, otherwise convert blob to file
        newSignature instanceof File ? signatureFile = newSignature : signatureFile = dataUrlToFile(newSignature)
        const nameFile = `${Date.now()}.${signatureFile.name.split('.').pop()}` //generate a unique name for file
        const path = `client/${headquarter?.client?._id}/headquarters/${headquarter?._id}/signatures/${nameFile}`
        const fileUrl = await createFile({ file: signatureFile, path }) //create the file in the storage
        sign = await createSignature({ headquarter: headquarter?._id, url: fileUrl })
      } //Use the old reference if there is no new signature
      else { sign = signature?.[0] } //most recent
      if (!maintenances?.length || !sign) return notifyError({ title: '❌ Error al firmar', message: 'Sin firma seleccionada' })
      const updateTasks = maintenances.map(mt => () => updateMaintenance({ id: mt._id, data: { signature: sign?._id, signedAt } }))
      await promisePool(updateTasks, 6) //pool promises to handle concurrency execution, allow improve performance (avoid overload)
      notifySuccess({ title: '✅ Documentos firmados', message: `Se han firmado ${maintenances?.length || 0} mantenimiento(s) correctamente` })
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    ...handleSubmit,
    onSubmit: handleSubmit.handleSubmit
  }
}
/*---------------------------------------------------------------------------------------------------------*/

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

  useEffect(() => { //to load the form on update mode "id"
    office && methods.reset({
      name: office.name,
      headquarter: office.headquarter?._id || '',
      services: office.services.map(buildServices)
    })
  }, [office, methods.reset])

  /**
   * Función que se ejecuta cuando se envía el formulario
   * nos permite controlar el envío del formulario y la ejecución de la request
   * @param e - Valores del formulario
   */
  const handleSubmit = useFormSubmit({
    onSubmit: async (data: OfficeFormProps) => {
      //remember that value of services is ['service1 - group', 'service2 - group', ...]
      const services = data.services.map((service) => service.split(' - ')[0])
      const group = data.services[0].split(' - ')[1] //Obtain group of services
      const { services: _, ...e } = data //extract services from original
      const dataFormat = { ...e, group, services } //prepare to send
      id ? updateLocation({ id, data: dataFormat }) : createLocation(dataFormat)
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

  useEffect(() => { //to load the form on update mode "id"
    headquarter && methods.reset({
      name: headquarter.name,
      address: headquarter.address,
      city: headquarter.city?._id || '',
      client: headquarter.client?._id || '',
      state: headquarter.city.state?._id || '',
      country: headquarter.city.state.country?._id || ''
    })
  }, [headquarter, cities, clients])

  /**
   * Función que se ejecuta cuando se envía el formulario
   * nos permite controlar el envío del formulario y la ejecución de la request
   * @param e - Valores del formulario
   */
  const handleSubmit = useFormSubmit({
    onSubmit: async (data: HeadquarterFormProps) => {
      const { name, city, client, address } = data
      const format = { name, city, client, address }
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

  useEffect(() => { //to load the form on update mode "id"
    city && methods.reset({ name: city.name, state: city.state?._id || '' })
  }, [city, states])

  /**
   * Función que se ejecuta cuando se envía el formulario
   * nos permite controlar el envío del formulario y la ejecución de la request
   * @param e - Valores del formulario
   */
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

  useEffect(() => { //to load the form on update mode "id"
    state && methods.reset({ name: state.name, country: state.country?._id || '' })
  }, [state, countries])

  /**
   * Función que se ejecuta cuando se envía el formulario
   * nos permite controlar el envío del formulario y la ejecución de la request
   * @param e - Valores del formulario
   */
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

  useEffect(() => { //to load the form on update mode "id"
    country && methods.reset({ name: country.name })
  }, [country])

  /**
   * Función que se ejecuta cuando se envía el formulario
   * nos permite controlar el envío del formulario y la ejecución de la request
   * @param e - Valores del formulario
   */
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

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * This function transforms the services of the office for the update form.
 * Remember that field services is an array of strings, and we need to show them in the format "servicio - grupo"
 */
const buildServices = (service: string): string => {
  const groupFound = groups.find(group => group.services.includes(service))
  return groupFound ? `${service} - ${groupFound.name}` : service
}