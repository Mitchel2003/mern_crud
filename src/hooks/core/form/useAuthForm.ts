import { userDefaultValues, clientFlowDefaultValues, groupCollection as groups } from "@/constants/values.constants"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useQueryUser, useUserMutation } from "@/hooks/query/useAuthQuery"
import { City, RoleProps, User } from "@/interfaces/context.interface"
import { useFormatMutation } from "@/hooks/query/useFormatQuery"
import { useFormSubmit } from "@/hooks/core/useFormSubmit"
import { zodResolver } from "@hookform/resolvers/zod"

import { useAuthContext } from "@/context/AuthContext"
import { UserRoundCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  userSchema, UserFormProps,
  loginSchema, LoginFormProps,
  signatureSchema, SignatureProps,
  clientFlowSchema, ClientFlowProps,
  forgotPasswordSchema, ForgotPasswordFormProps,
} from "@/schemas/auth/auth.schema"


/*--------------------------------------------------signature form--------------------------------------------------*/
/** Hook personalizado para manejar el formulario de firma */
export const useSignatureForm = () => {
  const methods = useForm<SignatureProps>({
    resolver: zodResolver(signatureSchema),
    defaultValues: { png: '' },
    mode: 'onSubmit',
  })
  const onSubmit = methods.handleSubmit(async (data: SignatureProps) => void (data))
  return { methods, onSubmit }
}
/*---------------------------------------------------------------------------------------------------------*/

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
 * @param to - Contexto del formulario usuario, actualmente manejados: admin, company, client, collaborator
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useUserForm = (id?: string, to?: RoleProps, onSuccess?: () => void) => {
  const { createFile, deleteFile } = useFormatMutation('file')
  const { createUser, updateUser } = useUserMutation()
  const { user: credentials } = useAuthContext()
  const queryUser = useQueryUser()

  const { data: user } = queryUser.fetchUserById<User>(id as string, { enabled: !!id })
  const { data: clients } = queryUser.fetchUserByQuery<User>({ role: 'client', enabled: to === 'company' || to === 'collaborator' })

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
      previewClientImage: user.metadata?.logo,
      previewCompanyLogo: user.metadata?.logo,
      previewCompanySignature: user.metadata?.signature,
    })
  }, [id, user])

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: UserFormProps) => {
      const companySignature: File | undefined = data.photoSignature?.[0]?.file
      const companyLogo: File | undefined = data.photoLogo?.[0]?.file
      const clientImg: File | undefined = data.photoImage?.[0]?.file
      id && delete data.email //delete field email for update (fb)
      id ? (
        updateUser({ id, data }).then(async () => {
          if (!clientImg && !companyLogo && !companySignature) return
          const files = [ //files to upload with those references and existance
            { file: companySignature, base: 'company', ref: 'signature', exist: user?.metadata?.signature },
            { file: companyLogo, base: 'company', ref: 'logo', exist: user?.metadata?.logo },
            { file: clientImg, base: 'client', ref: 'logo', exist: user?.metadata?.logo }
          ].filter(f => f.file instanceof File)
          //handle file uploads in your paths
          await Promise.all(files.map(async ({ file, exist, ref, base }) => {
            const path = `${base}/${id}/preview/${ref}`
            exist && file && await deleteFile({ path }).then(async () => {
              const photoUrl = await createFile({ file, path })
              await updateUser({ id, data: { metadata: { [ref]: photoUrl } } })
            })
          }))
        })
      ) : (
        createUser(data).then(async (e: User) => { //Only company and admins can do.
          if (!clientImg && !companySignature && !companyLogo) return
          const files = [ //files to upload with those references
            { file: companySignature, base: 'company', ref: 'signature' },
            { file: companyLogo, base: 'company', ref: 'logo' },
            { file: clientImg, base: 'client', ref: 'logo' }
          ].filter(f => f.file instanceof File)
          //handle file uploads in your paths
          await Promise.all(files.map(async ({ file, ref, base }) => {
            if (!file) return //if no file found, skip
            const path = `${base}/${e._id}/preview/${ref}`
            const photoUrl = await createFile({ file, path })
            await updateUser({ id: e._id, data: { metadata: { [ref]: photoUrl } } })
          })) //allow permissions to above created user (client)
          if (to === 'client' && credentials?.role === 'company') {
            const permissions = [...(credentials?.permissions || []), e._id]
            await updateUser({ id: credentials._id, data: { permissions } })
          }
        })
      )
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    ...handleSubmit,
    options: {
      clients: credentials?.role !== 'company'
        ? clients?.map((e) => ({ value: e?._id || '', label: `${e?.username || 'Sin nombre'} - ${e?.nit ? `NIT: ${e?.nit}` : 'Sin NIT'}`, icon: UserRoundCheck })) || []
        : clients?.filter((e) => credentials?.permissions?.includes(e._id)).map((e) => ({ value: e?._id || '', label: `${e?.username || 'Sin nombre'} - ${e?.nit ? `NIT: ${e?.nit}` : 'Sin NIT'}`, icon: UserRoundCheck })) || []
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
  const { create: createUser, update: updateUser } = useAuthContext()
  const { createFile } = useFormatMutation("file")

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
      if (file instanceof File) { //save image reference (storage)
        const photoUrl: string = await createFile({ file, path })
        await updateUser(user._id, { metadata: { logo: photoUrl } })
      } //create locations and references (headquarter and offices)
      await Promise.all(//complements in parallel
        data.headquarter.map(async (hq: any) => {
          const headquarter = await createHeadquarter({ ...hq, client: user._id })
          const offices = data.office.filter((office: any) => office.headquarter === `${hq.name}-${hq.address}`)
          if (!offices.length) return
          //create offices associated to headquarter
          await Promise.all(offices.map(async (office) => {
            //remember that value of services is ['service1 - group', 'service2 - group', ...]
            const service = office.services[0].split(' - ')[0] //['service - group'] -> 'service'
            const group = groups?.find(group => group.services.includes(service))
            await createOffice({
              name: office.name,
              services: office.services,
              group: group?.name ?? 'N/R',
              headquarter: headquarter._id,
            })
          }))
        })
      )
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