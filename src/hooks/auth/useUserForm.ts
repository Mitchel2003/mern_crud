import { useQueryUser, useUserMutation } from "@/hooks/query/useUserQuery"
import { Client, User } from "@/interfaces/context.interface"
import { useAuthContext } from "@/context/AuthContext"
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

const userDefaultValues = { role: '', email: '', username: '', password: '', headquarters: [] }
const userUpdateDefaultValues = { role: '', username: '', permissions: { overwrite: { read: false, create: false, update: false, delete: false }, headquarters: [] } }
const clientDefaultValues = { nit: '', name: '', phone: '', email: '' }

/*--------------------------------------------------use create form--------------------------------------------------*/
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

/*--------------------------------------------------use update form--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de actualización de usuarios
 * @param user - Usuario actual a actualizar
 */
export const useUpdateUserForm = (user: User) => {
  const { updateUser } = useUserMutation("user")

  const methods = useForm<UserUpdateFormProps>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: userUpdateDefaultValues,
    mode: "onSubmit"
  })

  // Cargar datos iniciales del usuario
  useEffect(() => {
    user && methods.reset({
      role: user.role,
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
    defaultValues: clientDefaultValues,
    mode: "onSubmit"
  })

  // Cargar datos iniciales del cliente
  useEffect(() => {
    client && methods.reset({
      nit: client.nit,
      name: client.name,
      email: client.email,
      phone: String(client.phone),
    })
  }, [client])

  const onSubmit = methods.handleSubmit(async (data: any) => {
    updateClient({ id: client._id, data })
    methods.reset()
  })

  return { methods, onSubmit }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de creación o actualización de estados "departamentos"
 * @param id - ID del estado a actualizar
 */
export const useUserForm = (id?: string) => {// to User
  const { fetchUserById } = useQueryUser()
  const { data: user } = fetchUserById<User>('user', id as string)

  const createForm = useCreateUserForm()
  const updateForm = useUpdateUserForm(user as User)
  return id ? updateForm : createForm
}

/**
 * Hook personalizado para manejar el formulario de creación o actualización de ciudades
 * @param id - ID de la ciudad a actualizar
 */
export const useClientForm = (id?: string) => {// to Client
  const { fetchUserById: fetchClientById } = useQueryUser()
  const { data: client } = fetchClientById<Client>('client', id as string)

  const createForm = useCreateClientForm()
  const updateForm = useUpdateClientForm(client as Client)
  return id ? updateForm : createForm
}
/*---------------------------------------------------------------------------------------------------------*/