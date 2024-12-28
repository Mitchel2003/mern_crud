import { Client, UserCredentials } from "@/interfaces/context.interface"
import { useAuthContext } from "@/context/AuthContext"
import { useUserMutation } from "@/hooks/useUserQuery"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

import {
  // User
  userSchema, UserFormProps,
  userUpdateSchema, UserUpdateFormProps,
  // Client
  clientSchema, ClientFormProps,
  clientUpdateSchema, ClientUpdateFormProps
} from "@/schemas/auth.schema"

/*--------------------------------------------------useCreateForm--------------------------------------------------*/
const userDefaultValues = {
  role: '',
  email: '',
  username: '',
  password: '',
  headquarters: []
}
const clientDefaultValues = {
  name: '',
  address: ''
}

/** Hook personalizado para manejar el formulario de creación de usuarios */
export const useCreateUserForm = () => {
  const { signup } = useAuthContext()

  const methods = useForm<UserFormProps>({
    resolver: zodResolver(userSchema),
    defaultValues: userDefaultValues,
    mode: "onSubmit",
  })

  const onSubmit = methods.handleSubmit(async (data: any) => {
    await signup(data)
    methods.reset()
  })

  return { methods, onSubmit }
}

/** Hook personalizado para manejar el formulario de creación de clientes */
export const useCreateClientForm = () => {
  const { createUser: createClient } = useUserMutation("client")

  const methods = useForm<ClientFormProps>({
    resolver: zodResolver(clientSchema),
    defaultValues: clientDefaultValues,
    mode: "onSubmit",
  })

  const onSubmit = methods.handleSubmit(async (data: any) => {
    createClient(data)
    methods.reset()
  })

  return { methods, onSubmit }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useUpdateForm--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de actualización de usuarios
 * @param user - Usuario actual a actualizar
 */
export const useUpdateUserForm = (user: UserCredentials) => {
  const { updateUser } = useUserMutation("user")

  const methods = useForm<UserUpdateFormProps>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: undefined,
    mode: "onSubmit"
  })

  // Cargar datos iniciales del usuario
  useEffect(() => {
    user && methods.reset({
      username: user.username,
      permissions: user.permissions
    })
  }, [user])

  const onSubmit = methods.handleSubmit(async (data: any) => {
    updateUser({ id: user?._id as string, data })
    methods.reset()
  })

  return { methods, onSubmit }
}

/**
 * Hook personalizado para manejar el formulario de actualización de clientes
 * @param client - Cliente actual a actualizar
 */
export const useUpdateClientForm = (client: Client) => {
  const { updateUser: updateClient } = useUserMutation("client")

  const methods = useForm<ClientUpdateFormProps>({
    resolver: zodResolver(clientUpdateSchema),
    defaultValues: undefined,
    mode: "onSubmit"
  })

  // Cargar datos iniciales del cliente
  useEffect(() => {
    client && methods.reset({
      name: client.name,
      address: client.address,
    })
  }, [client])

  const onSubmit = methods.handleSubmit(async (data: any) => {
    updateClient({ id: client._id, data })
    methods.reset()
  })

  return { methods, onSubmit }
}
/*---------------------------------------------------------------------------------------------------------*/