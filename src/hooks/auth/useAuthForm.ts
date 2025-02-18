import { City, Client, Company, Headquarter, User } from "@/interfaces/context.interface"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useFormatMutation, useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryUser, useUserMutation } from "@/hooks/query/useUserQuery"
import { useFormSubmit } from "@/hooks/core/useFormSubmit"
import { zodResolver } from "@hookform/resolvers/zod"
import { Metadata } from "@/interfaces/db.interface"

import { useAuthContext } from "@/context/AuthContext"
import { MapPinHouseIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { processFile } from "@/lib/utils"
import {
  userDefaultValues,
  loginDefaultValues,
  clientDefaultValues,
  companyDefaultValues,
  clientFlowDefaultValues,
  groupCollection as groups,
  forgotPasswordDefaultValues,
} from "@/utils/constants"
import {
  userSchema, UserFormProps,
  loginSchema, LoginFormProps,
  clientSchema, ClientFormProps,
  companySchema, CompanyFormProps,
  clientFlowSchema, ClientFlowProps,
  forgotPasswordSchema, ForgotPasswordFormProps,
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
  const { data: img = [] } = useQueryFormat().fetchAllFiles<Metadata>('file', { path: `client/${id}/preview`, enabled: !!id })
  const { data: client } = useQueryUser().fetchUserById<Client>('client', id as string)
  const { createUser, updateUser, isLoading } = useUserMutation('client')
  const { createFile, deleteFile } = useFormatMutation('file')

  const methods = useForm<ClientFormProps>({
    resolver: zodResolver(clientSchema),
    defaultValues: clientDefaultValues,
    mode: "onSubmit",
  })

  useEffect(() => {
    id && client && methods.reset({
      nit: client.nit,
      name: client.name,
      email: client.email,
      preview: img?.[0]?.url,
      phone: String(client.phone),
    })
  }, [client, img])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: any) => {
      id ? (
        updateUser({ id, data }).then(async () => {
          const file: File | undefined = data.photoUrl?.[0]?.file
          const imageUrl: string | undefined = img?.[0]?.url
          if (!file) return
          //building blob
          if (imageUrl) await deleteFile({ path: `client/${id}/preview/img` })
          const { name, type, size } = file
          const base64 = await processFile(file)
          const blob = { buffer: base64, originalname: name, mimetype: type, size }
          await createFile({ files: [blob], path: `client/${id}/preview/img`, unique: true })
        })
      ) : (
        createUser(data).then(async () => {
          const file: File | undefined = data.photoUrl?.[0]?.file
          if (!file) return
          //building blob
          const { name, type, size } = file
          const base64 = await processFile(file)
          const blob = { buffer: base64, originalname: name, mimetype: type, size }
          await createFile({ files: [blob], path: `client/${id}/preview/img`, unique: true })
        })
      )
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    isLoading,
    ...handleSubmit,
  }
}

/**
 * Hook personalizado para manejar el formulario de creación o actualización de compañías
 * @param id - ID de la compañía a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useCompanyForm = (id?: string, onSuccess?: () => void) => {
  const { data: imgs = [] } = useQueryFormat().fetchAllFiles<Metadata>('file', { path: `company/${id}/preview`, enabled: !!id })
  const { data: company } = useQueryUser().fetchUserById<Company>('company', id as string)
  const { createUser, updateUser, isLoading } = useUserMutation('company')
  const { createFile, deleteFile } = useFormatMutation('file')

  //if found at least one, so disable create company
  const { data: companies = [] } = useQueryUser().fetchAllUsers<Company>('company')

  const methods = useForm<CompanyFormProps>({
    resolver: zodResolver(companySchema),
    defaultValues: companyDefaultValues,
    mode: "onChange",
  })

  useEffect(() => {
    if (!id && companies?.length > 0) return onSuccess?.()
    id && company && methods.reset({
      nit: company.nit,
      name: company.name,
      invima: company.invima,
      profesionalLicense: company.profesionalLicense,
      previewLogo: imgs.find(img => img.name.includes('logo'))?.url,
      previewSignature: imgs.find(img => img.name.includes('signature'))?.url,
    })
  }, [company, imgs])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: any) => {
      id ? (
        await updateUser({ id, data }).then(async () => {
          const signature: File | undefined = data.photoSignature?.[0]?.file
          const logo: File | undefined = data.photoLogo?.[0]?.file
          if (!signature && !logo) return

          const hasSignature = imgs.find(img => img.name.includes('signature'))
          const hasLogo = imgs.find(img => img.name.includes('logo'))

          const files = [{ file: signature, ref: 'signature', exist: hasSignature }, { file: logo, ref: 'logo', exist: hasLogo }]
            .filter(f => f.file instanceof File)

          await Promise.all(files.map(async ({ file, exist, ref }) => {
            if (!file) return
            exist && await deleteFile({ path: `company/${id}/preview/${ref}` })
            const { name, type, size } = file
            const base64 = await processFile(file)
            const blob = { buffer: base64, originalname: name, mimetype: type, size }
            await createFile({ files: [blob], path: `company/${id}/preview/${ref}`, unique: true })
          }))
        })
      ) : (
        createUser(data).then(async (e) => {
          const signature: File | undefined = data.photoSignature?.[0]?.file
          const logo: File | undefined = data.photoLogo?.[0]?.file
          if (!signature && !logo) return

          const files = [{ file: signature, ref: 'signature' }, { file: logo, ref: 'logo' }]
            .filter(f => f.file instanceof File)

          await Promise.all(files.map(async ({ file, ref }) => {
            if (!file) return
            const { name, type, size } = file
            const base64 = await processFile(file)
            const blob = { buffer: base64, originalname: name, mimetype: type, size }
            await createFile({ files: [blob], path: `company/${e._id}/preview/${ref}`, unique: true })
          }))
        })
      )
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    isLoading,
    ...handleSubmit,
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------useUserForm (form-step)--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de creación de nuevo cliente
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useClientFlow = (onSuccess?: () => void) => {
  const [currentStep, setCurrentStep] = useState<'client' | 'headquarter' | 'office'>('client')
  const { createLocation: createHeadquarter } = useLocationMutation('headquarter')
  const { createLocation: createOffice } = useLocationMutation('office')
  const { createUser: createClient } = useUserMutation('client')
  const { createFile } = useFormatMutation("file")

  const { fetchAllLocations } = useQueryLocation()
  const { data: cities, isLoading: isLoadingCities } = fetchAllLocations<City>('city')

  const methods = useForm<ClientFlowProps>({
    resolver: zodResolver(clientFlowSchema),
    defaultValues: clientFlowDefaultValues,
    mode: "onChange"
  })

  const handleSubmit = useFormSubmit({
    onSubmit: async (data) => {
      const client = await createClient(data.client)
      await Promise.all(
        data.headquarter.map(async (hq: any) => {
          const headquarter = await createHeadquarter({ ...hq, client: client._id })
          const offices = data.office.filter((office: any) => office.headquarter === `${hq.name}-${hq.address}`)
          if (!offices.length) return

          await Promise.all(offices.map(async (office) => {
            const serviceGroup = groups?.find(group => group.services.includes(office.services[0]))
            await createOffice({
              name: office.name,
              services: office.services,
              headquarter: headquarter._id,
              group: serviceGroup?.name ?? 'n/r'
            })
          }))
        })
      )
      if (data.client.photoUrl?.[0]?.file) {
        const { name, type, size } = data.client.photoUrl?.[0]?.file
        const base64 = await processFile(data.client.photoUrl?.[0]?.file)
        const file = { buffer: base64, originalname: name, mimetype: type, size }
        await createFile({ files: [file], path: `client/${client._id}/preview/img`, unique: true })
      }
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    currentStep,
    setCurrentStep,
    ...handleSubmit,
    options: { headquarter: { cities: cities || [], isLoading: isLoadingCities } }
  }
}