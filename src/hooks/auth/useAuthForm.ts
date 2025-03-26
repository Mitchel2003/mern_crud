import { useLocationMutation, useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useFormatMutation, useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryUser, useUserMutation } from "@/hooks/query/useAuthQuery"
import { City, RoleProps, User } from "@/interfaces/context.interface"
import { useFormSubmit } from "@/hooks/core/useFormSubmit"
import { zodResolver } from "@hookform/resolvers/zod"
import { Metadata } from "@/interfaces/db.interface"

import { useCallback, useEffect, useRef, useState } from "react"
import { MapPinHouseIcon, UserRoundCheck } from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"
import { useForm } from "react-hook-form"
import { processFile } from "@/lib/utils"
import {
  userDefaultValues,
  clientFlowDefaultValues,
  groupCollection as groups,
} from "@/utils/constants"
import {
  userSchema, UserFormProps,
  loginSchema, LoginFormProps,
  clientFlowSchema, ClientFlowProps,
  forgotPasswordSchema, ForgotPasswordFormProps,
} from "@/schemas/auth/auth.schema"

/*==================================================useForm==================================================*/
/*--------------------------------------------------login form--------------------------------------------------*/
/** Hook personalizado para manejar el formulario de inicio de sesión */
export const useLoginForm = () => {
  const { login } = useAuthContext()
  const methods = useForm<LoginFormProps>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  })
  const onSubmit = methods.handleSubmit(async (data: LoginFormProps) => {
    await login(data)
    methods.reset()
  })
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
  const onSubmit = methods.handleSubmit(async (data: ForgotPasswordFormProps) => {
    await sendResetPassword(data.email)
    methods.reset()
  })
  return { methods, onSubmit }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------user form--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de creación o actualización de usuarios
 * @param id - ID del usuario a actualizar, si no se proporciona, la request corresponde a crear
 * @param role - Rol del usuario, actualmente manejados: company, client, engineer, admin
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useUserForm = (id?: string, role?: RoleProps, onSuccess?: () => void) => {
  const { createFile, deleteFile } = useFormatMutation('file')
  const { create: createUser } = useAuthContext()
  const { updateUser } = useUserMutation()
  const queryFormat = useQueryFormat()
  const queryUser = useQueryUser()

  const { data: user } = queryUser.fetchUserById<User>(id as string)
  const { data: clients } = queryUser.fetchUserByQuery<User>({ role: 'client', enabled: role === 'company' })
  const { data: companies } = queryUser.fetchUserByQuery<User>({ role: 'company', enabled: role === 'client' })
  const { data: imgs = [], isLoading } = queryFormat.fetchAllFiles<Metadata>('file', { path: `${role}/${id}/preview`, enabled: !!id && !!role })

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
      id && delete data.email // delete field email for update
      id ? (
        updateUser({ id, data }).then(async () => {
          if (!clientImg && !companySignature && !companyLogo) return
          const files = [// files to upload with those references and existance
            { file: companySignature, ref: 'signature', exist: imgs.find(img => img.name.includes('signature')) },
            { file: companyLogo, ref: 'logo', exist: imgs.find(img => img.name.includes('logo')) },
            { file: clientImg, ref: 'img', exist: imgs.find(img => img.name.includes('img')) }
          ].filter(f => f.file instanceof File)

          await Promise.all(files.map(async ({ file, exist, ref }) => {
            if (!file) return
            const path = `${ref === 'img' ? 'client' : 'company'}/${id}/preview/${ref}`
            exist && await deleteFile({ path })
            const { name, type, size } = file
            const base64 = await processFile(file)
            const blob = { buffer: base64, originalname: name, mimetype: type, size }
            await createFile({ files: [blob], path, unique: true })
          }))
        })
      ) : (
        createUser(data).then(async (e) => {
          if (!clientImg && !companySignature && !companyLogo) return
          const files = [// files to upload with those references
            { file: companySignature, ref: 'signature' },
            { file: companyLogo, ref: 'logo' },
            { file: clientImg, ref: 'img' }
          ].filter(f => f.file instanceof File)

          await Promise.all(files.map(async ({ file, ref }) => {
            if (!file) return
            const { name, type, size } = file
            const base64 = await processFile(file)
            const blob = { buffer: base64, originalname: name, mimetype: type, size }
            const path = `${ref !== 'img' ? 'company' : 'client'}/${e._id}/preview/${ref}`
            await createFile({ files: [blob], path, unique: true })
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
      clients: clients?.map((e) => ({ value: e?._id || '', label: `${e?.username || 'Sin nombre'} - ${e?.nit || 'Sin NIT'}`, icon: UserRoundCheck })) || [],
      companies: companies?.map((e) => ({ value: e?._id || '', label: `${e?.username || 'Sin nombre'} - ${e?.nit || 'Sin NIT'}`, icon: MapPinHouseIcon })) || []
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

  const { fetchAllLocations } = useQueryLocation()
  const { data: cities, isLoading: isLoadingCities } = fetchAllLocations<City>('city')

  const methods = useForm<ClientFlowProps>({
    resolver: zodResolver(clientFlowSchema),
    defaultValues: clientFlowDefaultValues,
    mode: "onChange"
  })

  const handleSubmit = useFormSubmit({
    onSubmit: async (data: ClientFlowProps) => {
      const user: User = await createUser(data.client)
      const userImg = data.client.photoUrl?.[0]?.file
      await Promise.all(//create headquarter and offices in parallel
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
      )
      if (userImg) {//upload the image user
        const { name, type, size } = userImg
        const base64 = await processFile(userImg)
        const file = { buffer: base64, originalname: name, mimetype: type, size }
        await createFile({ files: [file], path: `client/${user._id}/preview/img`, unique: true })
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
/*=========================================================================================================*/

/*==================================================useTable==================================================*/
/*--------------------------------------------------user table--------------------------------------------------*/
/** Hook principal que orquesta los sub-hooks de usuarios para la tabla */
export const useUserTable = () => {
  const [onDelete, setOnDelete] = useState<User | undefined>(undefined)
  const { deleteFile } = useFormatMutation('file')
  const { delete: _delete } = useAuthContext()
  const isProcessing = useRef(false)

  /**
   * Función que se ejecuta cuando se elimina un usuario
   * @param {string} id - ID del usuario a eliminar
   */
  const deleteUser = useCallback(async (user: User) => {
    if (isProcessing.current) return
    isProcessing.current = true
    const credential = `${user._id}-${user.uid}`
    await _delete(credential).then(async () => {
      const files = user.role === 'client' ? [{ path: 'client', ref: 'img' }] : [{ path: 'company', ref: 'logo' }, { path: 'company', ref: 'signature' }]
      await Promise.all(files.map(async ({ path, ref }) => await deleteFile({ path: `${path}/${user._id}/preview/${ref}` })))
    }).finally(() => { setOnDelete(undefined); isProcessing.current = false })
  }, [_delete, deleteFile])

  /** just one useEffect */
  useEffect(() => { onDelete && deleteUser(onDelete) }, [onDelete, deleteUser])

  return { handleDelete: (user: User) => setOnDelete(user) }
}
/*=========================================================================================================*/