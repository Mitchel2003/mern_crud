import { userDefaultValues, clientFlowDefaultValues, groupCollection as groups } from "@/utils/constants"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useFormatMutation, useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryUser, useUserMutation } from "@/hooks/query/useAuthQuery"
import { City, RoleProps, User } from "@/interfaces/context.interface"
import { useFormSubmit } from "@/hooks/core/useFormSubmit"
import { zodResolver } from "@hookform/resolvers/zod"
import { Metadata } from "@/interfaces/db.interface"

import { MapPinHouseIcon, UserRoundCheck } from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  userSchema, UserFormProps,
  loginSchema, LoginFormProps,
  clientFlowSchema, ClientFlowProps,
  forgotPasswordSchema, ForgotPasswordFormProps,
} from "@/schemas/auth/auth.schema"

/*--------------------------------------------------login form--------------------------------------------------*/
/** Hook personalizado para manejar el formulario de inicio de sesión */
export const useLoginForm = () => {
  const { login } = useAuthContext()
  const methods = useForm<LoginFormProps>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  })
  const onSubmit = methods.handleSubmit(async (data: LoginFormProps) => await login(data))
  return { methods, onSubmit }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------forgotPassword form--------------------------------------------------*/
/** Hook personalizado para manejar el formulario de recuperación de contraseña */
export const useForgotPasswordForm = () => {
  const { sendResetPassword } = useAuthContext()
  const methods = useForm<ForgotPasswordFormProps>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onSubmit',
  })
  const onSubmit = methods.handleSubmit(async (data: ForgotPasswordFormProps) => await sendResetPassword(data.email))
  return { methods, onSubmit }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------user form--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de creación o actualización de usuarios
 * @param id - ID del usuario a actualizar, si no se proporciona, la request corresponde a crear
 * @param to - Contexto del formulario usuario, actualmente manejados: company, client, engineer, admin
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useUserForm = (id?: string, to?: RoleProps, onSuccess?: () => void) => {
  const { createFile, deleteFile } = useFormatMutation('file')
  const { createUser, updateUser } = useUserMutation()
  const { user: credentials } = useAuthContext()
  const queryFormat = useQueryFormat()
  const queryUser = useQueryUser()

  const { data: user } = queryUser.fetchUserById<User>(id as string, !!id)
  const { data: clients } = queryUser.fetchUserByQuery<User>({ role: 'client', enabled: to === 'company' })
  const { data: company } = queryUser.fetchUserById<User>(credentials?.uid as string, credentials?.role === 'company') //to company
  const { data: companies } = queryUser.fetchUserByQuery<User>({ role: 'company', enabled: credentials?.role === 'admin' }) //to admin
  const { data: imgs = [], isLoading } = queryFormat.fetchAllFiles<Metadata>({ path: `${to}/${id}/preview`, enabled: !!id && !!to })

  const methods = useForm<UserFormProps>({
    resolver: zodResolver(userSchema),
    defaultValues: { ...userDefaultValues, isUpdate: !!id },
    mode: "onChange",
  })

  useEffect(() => {
    id && user && methods.reset({
      isUpdate: !!id,
      //user credentials
      username: user.username,
      phone: user.phone,
      nit: user.nit || '',
      invima: user.invima || '',
      profesionalLicense: user.profesionalLicense || '',
      //user access
      role: user.role,
      permissions: user.permissions || [],
      //add previews...
      previewClientImage: imgs?.find(img => img.name.includes('img'))?.url,
      previewCompanyLogo: imgs.find(img => img.name.includes('logo'))?.url,
      previewCompanySignature: imgs.find(img => img.name.includes('signature'))?.url,
    })
  }, [id, user, imgs])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: UserFormProps) => {
      const companySignature: File | undefined = data.photoSignature?.[0]?.file
      const companyLogo: File | undefined = data.photoLogo?.[0]?.file
      const clientImg: File | undefined = data.photoImage?.[0]?.file
      id && delete data.email // delete field email for update (fb)
      id ? (
        updateUser({ id, data }).then(async () => {
          if (!clientImg && !companySignature && !companyLogo) return
          const files = [// files to upload with those references and existance
            { file: companySignature, ref: 'signature', exist: imgs.find(img => img.name.includes('signature')) },
            { file: companyLogo, ref: 'logo', exist: imgs.find(img => img.name.includes('logo')) },
            { file: clientImg, ref: 'img', exist: imgs.find(img => img.name.includes('img')) }
          ].filter(f => f.file instanceof File)
          //handle file uploads in your paths
          await Promise.all(files.map(async ({ file, exist, ref }) => {
            const path = `${ref === 'img' ? 'client' : 'company'}/${id}/preview/${ref}`
            exist && file && await deleteFile({ path }).then(async () => await createFile({ file, path }))
          }))
        })
      ) : (
        createUser(data).then(async (e) => {
          if (!clientImg && !companySignature && !companyLogo) return
          const files = [ //files to upload with those references
            { file: companySignature, ref: 'signature' },
            { file: companyLogo, ref: 'logo' },
            { file: clientImg, ref: 'img' }
          ].filter(f => f.file instanceof File)
          //handle file uploads in your paths
          await Promise.all(files.map(async ({ file, ref }) => {
            const base = ref === 'img' ? 'client' : 'company'
            const path = `${base}/${e._id}/preview/${ref}`
            file && await createFile({ file, path })
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
    options: {
      companies: credentials?.role === 'admin'
        ? companies?.map((e) => ({ value: e?._id || '', label: `${e?.username || 'Sin nombre'} - ${e?.nit || 'Sin NIT'}`, icon: MapPinHouseIcon })) || []
        : company ? [{ value: company?._id || '', label: `${company?.username || 'Sin nombre'} - ${company?.nit || 'Sin NIT'}`, icon: MapPinHouseIcon }] : [],
      clients: clients?.map((e) => ({ value: e?._id || '', label: `${e?.username || 'Sin nombre'} - ${e?.nit || 'Sin NIT'}`, icon: UserRoundCheck })) || [],
    }
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------client flow--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de creación de nuevo cliente
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useClientFlow = (onSuccess?: () => void) => {
  const [currentStep, setCurrentStep] = useState<'client' | 'headquarter' | 'office'>('client')
  const { createLocation: createHeadquarter } = useLocationMutation('headquarter')
  const { createLocation: createOffice } = useLocationMutation('office')
  const { createFile } = useFormatMutation("file")
  const { create: createUser } = useAuthContext()

  const { data: cities, isLoading: isLoadingCities } = useQueryLocation().fetchAllLocations<City>('city')

  const methods = useForm<ClientFlowProps>({
    resolver: zodResolver(clientFlowSchema),
    defaultValues: clientFlowDefaultValues,
    mode: "onChange"
  })

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: ClientFlowProps) => {
      const credentials: any = data.client //ts-ignore
      const user: User = await createUser(credentials)
      const file = data.client.photoUrl?.[0]?.file
      const path = `client/${user._id}/preview/img`
      await Promise.all(//complements in parallel
        data.headquarter.map(async (hq: any) => {
          const headquarter = await createHeadquarter({ ...hq, user: user._id })
          const offices = data.office.filter((office: any) => office.headquarter === `${hq.name}-${hq.address}`)
          if (!offices.length) return
          //create offices associated to headquarter
          await Promise.all(offices.map(async (office) => {
            const serviceGroup = groups?.find(group => group.services.includes(office.services[0]))
            await createOffice({
              name: office.name,
              services: office.services,
              headquarter: headquarter._id,
              group: serviceGroup?.name ?? 'N/R'
            })
          }))
        })
      ) //save image reference (storage)
      file && await createFile({ file, path })
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
/*---------------------------------------------------------------------------------------------------------*/