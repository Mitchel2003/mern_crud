import { forgotPasswordDefaultValues, loginDefaultValues, clientDefaultValues, userDefaultValues, clientFlowDefaultValues } from "@/utils/constants"
import { Country, State, City, Client, Headquarter, User, Group } from "@/interfaces/context.interface"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useQueryUser, useUserMutation } from "@/hooks/query/useUserQuery"
import { useFormSubmit } from "@/hooks/core/useFormSubmit"
import { useAuthContext } from "@/context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapPinHouseIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  loginSchema, LoginFormProps,
  forgotPasswordSchema, ForgotPasswordFormProps,

  userSchema, UserFormProps,
  clientSchema, ClientFormProps,
  clientFlowSchema, ClientFlowProps
} from "@/schemas/auth/auth.schema"

/*--------------------------------------------------useAuthForm--------------------------------------------------*/
/** Hook personalizado para manejar el formulario de inicio de sesión */
export const useLoginForm = () => {
  const { signin } = useAuthContext()

  const methods = useForm<LoginFormProps>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
    mode: 'onSubmit',
  })

  const onSubmit = methods.handleSubmit(async (data: object) => await signin(data))
  return { methods, onSubmit }
}

/** Hook personalizado para manejar el formulario de recuperación de contraseña */
export const useForgotPasswordForm = () => {
  const { sendResetPassword } = useAuthContext()

  const methods = useForm<ForgotPasswordFormProps>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordDefaultValues,
    mode: 'onSubmit',
  })

  const onSubmit = methods.handleSubmit(async (data: ForgotPasswordFormProps) => {
    await sendResetPassword(data.email)
    methods.reset()
  })
  return { methods, onSubmit }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useUserForm--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de creación o actualización de usuarios
 * @param id - ID del usuario a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useUserForm = (id?: string, onSuccess?: () => void) => {
  const { data: headquarters, isLoading } = useQueryLocation().fetchAllLocations<Headquarter>('headquarter')
  const { data: user } = useQueryUser().fetchUserById<User>('user', id as string)
  const { signup: createUser } = useAuthContext()
  const { updateUser } = useUserMutation('user')

  const methods = useForm<UserFormProps>({
    resolver: zodResolver(userSchema),
    defaultValues: userDefaultValues,
    mode: "onSubmit",
  })

  useEffect(() => {
    user && methods.reset({
      role: user.role,
      username: user.username,
      headquarters: user.permissions.headquarters || []
    })
  }, [user])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: any) => { id ? updateUser({ id, data }) : createUser(data); methods.reset() },
    onSuccess
  }, methods)

  return {
    methods,
    isLoading,
    ...handleSubmit,
    options: headquarters?.map((e) => ({ value: e._id, label: `${e.client?.name || ''} - ${e.address} - ${e.city?.name || ''}`, icon: MapPinHouseIcon })) || []
  }
}

/**
 * Hook personalizado para manejar el formulario de creación o actualización de clientes
 * @param id - ID del cliente a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useClientForm = (id?: string, onSuccess?: () => void) => {
  const { data: client } = useQueryUser().fetchUserById<Client>('client', id as string)
  const { createUser, updateUser, isLoading } = useUserMutation('client')

  const methods = useForm<ClientFormProps>({
    resolver: zodResolver(clientSchema),
    defaultValues: clientDefaultValues,
    mode: "onSubmit",
  })

  useEffect(() => {
    client && methods.reset({
      nit: client.nit,
      name: client.name,
      email: client.email,
      phone: String(client.phone),
    })
  }, [client])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: any) => { id ? updateUser({ id, data }) : createUser(data); methods.reset() },
    onSuccess
  }, methods)

  return {
    methods,
    isLoading,
    ...handleSubmit,
  }
}

/**
 * Hook personalizado para manejar el formulario de creación de nuevo cliente
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useClientFlow = (onSuccess?: () => void) => {
  const [currentStep, setCurrentStep] = useState<'client' | 'headquarter' | 'office'>('client')
  const { createLocation: createHeadquarter } = useLocationMutation('headquarter')
  const { createLocation: createOffice } = useLocationMutation('office')
  const { createUser: createClient } = useUserMutation('client')

  const { fetchAllLocations } = useQueryLocation()
  const { data: countries, isLoading: isLoadingCountries } = fetchAllLocations<Country>('country')
  const { data: groups, isLoading: isLoadingGroups } = fetchAllLocations<Group>('group')
  const { data: states, isLoading: isLoadingStates } = fetchAllLocations<State>('state')
  const { data: cities, isLoading: isLoadingCities } = fetchAllLocations<City>('city')

  const methods = useForm<ClientFlowProps>({
    resolver: zodResolver(clientFlowSchema),
    defaultValues: clientFlowDefaultValues,
    mode: "onSubmit"
  })

  const handleSubmit = useFormSubmit({
    onSubmit: async (data) => {
      const client = await createClient(data.client)
      const headquarter = await createHeadquarter({ ...data.headquarter, client: client._id })
      await createOffice({ ...data.office, headquarter: headquarter._id })
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    currentStep,
    setCurrentStep,
    ...handleSubmit,
    options: {
      headquarter: {
        states: states || [],
        cities: cities || [],
        countries: countries || [],
        isLoading: isLoadingCountries || isLoadingStates || isLoadingCities
      },
      office: {
        groups: groups || [],
        isLoading: isLoadingGroups
      }
    }
  }
}