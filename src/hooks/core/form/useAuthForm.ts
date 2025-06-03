import { userDefaultValues, clientFlowDefaultValues } from "@/constants/values.constants"
import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useQueryUser, useUserMutation } from "@/hooks/query/useAuthQuery"
import { City, RoleProps, User } from "@/interfaces/context.interface"
import { useFormatMutation } from "@/hooks/query/useFormatQuery"
import { useFormSubmit } from "@/hooks/core/useFormSubmit"
import { zodResolver } from "@hookform/resolvers/zod"

import { extractMetadataUrl } from "@/constants/format.constants"
import { useAuthContext } from "@/context/AuthContext"
import { useEffect, useMemo, useState } from "react"
import { UserRoundCheck } from "lucide-react"
import { useForm } from "react-hook-form"
import {
  loginSchema, LoginFormProps,
  signatureSchema, SignatureProps,
  authSchema, UserFormProps, ClientFlowProps,
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
export const useForgotPasswordForm = (onSuccess?: () => void) => {
  const { sendResetPassword } = useAuthContext()
  const methods = useForm<ForgotPasswordFormProps>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onSubmit',
  })
  /**
   * Función que se ejecuta cuando se envía el formulario
   * nos permite controlar el envío del formulario y la ejecución de la request
   * @param e - Valores del formulario
   */
  const handleSubmit = useFormSubmit({
    onSubmit: async (e: ForgotPasswordFormProps) => {
      await sendResetPassword(e.email)
      methods.reset()
    },
    onSuccess
  }, methods)

  return { methods, ...handleSubmit }
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
  const { userSchema } = authSchema(credentials)
  const queryUser = useQueryUser()

  /** "to" is the role of the user to be created and "credentials" is the user logged in */
  const canAccess = (credentials?.role === 'company' || credentials?.role === 'admin')
  const allow = (to === 'company' || to === 'collaborator') && canAccess

  const isCompany = credentials?.role === 'company'
  const { data: user } = queryUser.fetchUserById<User>(id as string, { enabled: !!id })
  const { data: clients = [] } = queryUser.fetchUserByQuery<User>({ role: 'client', enabled: allow })
  const { data: companies = [] } = queryUser.fetchUserByQuery<User>({ role: 'company', enabled: allow })

  /** Dynamically filter available companies based on type format and role context */
  const companyFormat = useMemo(() => ( //to form company and collaborator (sort)
    isCompany && to === 'company' ? companies.filter(e => !e.belongsTo) //get main:companies
      : (isCompany && to === 'collaborator' ? companies.filter(e => e.belongsTo) : companies)
  ), [credentials, companies, id])

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
      position: user.position,
      phone: user.phone,
      nit: user.nit || '',
      invima: user.invima || '',
      profesionalLicense: user.profesionalLicense || '',
      //user access
      role: user.role,
      permissions: user.permissions || [],
      //handle reference (company and collaborators)
      belongsTo: user.belongsTo?._id || undefined,
      classification: user.classification || [],
      //add previews (metadata client - company)
      previewClientImage: user.metadata?.logo,
      previewCompanyLogo: user.metadata?.logo,
      previewCompanySignature: user.metadata?.signature,
    })
  }, [companies, clients, user, id])

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
          //state progresive to mutation metadata
          let currentMetadata = { ...user?.metadata }
          await Promise.all(files.map(async ({ file, exist, ref, base }) => {
            if (!file) return //if no file found, skip and continue with next
            const extension = file.name.split('.').pop() //png, jpg, jpeg, etc
            const toDelete = extractMetadataUrl([exist as string])?.[0] //extract name
            toDelete && await deleteFile({ path: `${base}/${id}/preview/${toDelete}` })
            const url = await createFile({ file, path: `${base}/${id}/preview/${ref}.${extension}` })
            currentMetadata = { ...currentMetadata, [ref]: url } //update metadata
            await updateUser({ id, data: { metadata: currentMetadata } })
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
          //state progresive to mutation metadata
          let currentMetadata = { ...(e.metadata || {}) }
          await Promise.all(files.map(async ({ file, ref, base }) => {
            if (!file) return //if no file found, skip and continue with next
            const extension = file.name.split('.').pop() //png, jpg, etc
            const path = `${base}/${e._id}/preview/${ref}.${extension}`
            const photoUrl = await createFile({ file, path }) //get url            
            currentMetadata = { ...currentMetadata, [ref]: photoUrl } //metadata
            await updateUser({ id: e._id, data: { metadata: currentMetadata } })
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
      clients: clients?.map((e) => ({ value: e?._id || '', label: `${e?.username || 'Sin nombre'} - ${e?.nit ? `NIT: ${e?.nit}` : 'Sin NIT'}`, icon: UserRoundCheck })) || [],
      companies: [...(companyFormat)].map((e) => ({ value: e?._id || '', label: `${e?.username || 'Sin nombre'} - ${e?.role === 'company' && !e?.belongsTo ? 'Prestador' : 'Sub prestador'}` })) || []
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
  const { user: credentials } = useAuthContext()
  const { clientFlowSchema } = authSchema()

  const { data: cities, isLoading: isLoadingCities } = useQueryLocation().fetchAllLocations<City>('city')

  const methods = useForm<ClientFlowProps>({
    resolver: zodResolver(clientFlowSchema),
    defaultValues: clientFlowDefaultValues,
    mode: "onChange"
  })

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: ClientFlowProps) => {
      const userData: any = data.client //ts-ignore
      const user: User = await createUser(userData)
      const file = data.client.photoUrl?.[0]?.file
      const path = `client/${user._id}/preview/logo`
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
            const services = office.services.map((service) => service.split(' - ')[0])
            const group = office.services[0].split(' - ')[1] //Obtain group of services
            await createOffice({ group, services, name: office.name, headquarter: headquarter._id })
          })) //allow permissions to above created user (client); efficient to references
          if (credentials?.role !== 'company') return //updating only for companies
          const permissions = [...(credentials?.permissions || []), user._id]
          await updateUser(credentials._id, { permissions }) //set permissions
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