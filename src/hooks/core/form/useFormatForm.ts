import { curriculumDefaultValues, maintenanceDefaultValues, solicitDefaultValues, activityDefaultValues, scheduleDefaultValues } from '@/constants/values.constants'
import { Accessory, User, Curriculum, Maintenance, Office } from '@/interfaces/context.interface'
import { useFormatMutation, useQueryFormat } from '@/hooks/query/useFormatQuery'
import { useNotificationContext } from '@/context/NotificationContext'
import { useQueryLocation } from '@/hooks/query/useLocationQuery'
import { formatHooks } from '@/hooks/form-handlers/useFormat'
import { useNotification } from '@/hooks/ui/useNotification'
import { useFormSubmit } from '@/hooks/core/useFormSubmit'
import { useQueryUser } from '@/hooks/query/useAuthQuery'
import { zodResolver } from '@hookform/resolvers/zod'

import { MaintenanceFormProps, maintenanceSchema } from '@/schemas/format/maintenance.schema'
import { curriculumSchema, CurriculumFormProps } from '@/schemas/format/curriculum.schema'
import { ActivityFormProps, activitySchema } from '@/schemas/format/activity.schema'
import { ScheduleFormProps, scheduleSchema } from '@/schemas/format/schedule.schema'
import { solicitSchema, SolicitFormProps } from '@/schemas/format/solicit.schema'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MaintenancePDF from '@/lib/export/schedule/MaintenanceSchedulePDF'
import AttendancePDF from '@/lib/export/schedule/AttendanceSchedulePDF'
import TrainingPDF from '@/lib/export/schedule/TrainingSchedulePDF'
import { extractMetadataUrl } from '@/constants/format.constants'
import { useAuthContext } from '@/context/AuthContext'
import { baseFrontendUrl } from '@/utils/config'
import { UserRoundCheck } from 'lucide-react'
import { usePDFDownload } from '@/lib/utils'
import { useForm } from 'react-hook-form'

/*--------------------------------------------------schedule form--------------------------------------------------*/
/**
 * Hook personalizado para manejar el formulario de creación de cronogramas
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useScheduleForm = (onSuccess?: () => void) => {
  const [onSubmit, setOnSubmit] = useState<ScheduleFormProps | null>(null)
  const { createFormat: createSchedule } = useFormatMutation('schedule')
  const { createFile } = useFormatMutation('file')
  const { downloadPDFDirect } = usePDFDownload()
  const { notifyError } = useNotification()
  const isProcessing = useRef(false)
  const { user } = useAuthContext()

  const methods = useForm<ScheduleFormProps>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: scheduleDefaultValues,
    mode: "onChange",
  })

  // Obtain client and company onchange
  const clientId = methods.watch('client')
  const typeSchedule = methods.watch('typeSchedule')
  const { data: client } = useQueryUser().fetchUserById<User>(clientId, { enabled: !!clientId })
  const { data: clients } = useQueryUser().fetchUserByQuery<User>({ role: 'client', enabled: !!user })
  const userAllowed = user?.role === 'company' || user?.role === 'collaborator' //user allowed to create schedules

  /*--------------------------------------------------complements--------------------------------------------------*/
  const { data: cvs = [] } = useQueryFormat().fetchFormatByQuery<Curriculum>('cv', { enabled: !!clientId && typeSchedule === 'mantenimiento' }) //get cvs to maintenance
  const { data: offices = [] } = useQueryLocation().fetchLocationByQuery<Office>('office', { enabled: !!client && typeSchedule === 'capacitación' }) //get offices (areas) to training
  /*---------------------------------------------------------------------------------------------------------*/
  const equips = useMemo(() => { //formating equipments
    if (!client || !cvs.length || typeSchedule !== 'mantenimiento') return []
    return cvs.filter(cv => cv?.office?.headquarter?.client?._id === client._id)
  }, [client, cvs])

  const areas = useMemo(() => { //formating offices
    if (!client || !offices.length || typeSchedule !== 'capacitación') return []
    const clientOffices = offices.filter(office => office?.headquarter?.client?._id === client._id)
    const uniqueAreas = Array.from(new Set(clientOffices.map(office => office.group).filter(Boolean)))
    return uniqueAreas
  }, [client, offices])

  /**
   * Función que contiene la lógica para crear el cronograma
   * @param e - Valores del formulario
   */
  const submit = useCallback(async (e: ScheduleFormProps) => {
    if (!userAllowed) { setOnSubmit(null); isProcessing.current = false; return notifyError({ message: 'No tienes permiso para crear cronogramas' }) }
    if ((e.typeSchedule === 'mantenimiento' && !equips.length) || (e.typeSchedule === 'capacitación' && !areas.length)) return
    if (!client || isProcessing.current) return
    isProcessing.current = true
    try { //build path fileName and upload pdf
      const typeClassification = e.typeClassification || 'estándar'
      const fileName = `${e.typeSchedule}-${typeClassification}-${Date.now()}.pdf`
      const path = `client/${e.client}/schedule/${fileName}`

      const type = e.typeSchedule
      const adds = type === 'capacitación' ? { areas } : (type === 'mantenimiento' ? { cvs: equips } : {})
      const PDF = type === 'capacitación' ? TrainingPDF : (type === 'mantenimiento' ? MaintenancePDF : AttendancePDF)
      const blob = await downloadPDFDirect({ fileName, component: PDF as any, props: { ...e, client, createdBy: user, ...adds } })
      if (!blob) return notifyError({ message: 'No se pudo crear el cronograma' }) //if dont download pdf, return error
      const schedule = { name: fileName, client: e.client, typeClassification, type } //build schedule element to create
      await createFile({ file: blob, path }).then(async (url) => await createSchedule({ ...schedule, url, createdBy: user?._id }))
    } finally { setOnSubmit(null); isProcessing.current = false }
    methods.reset()
  }, [createFile, downloadPDFDirect, areas, equips])

  /**
   * Función que se ejecuta cuando se envía el formulario
   * nos permite controlar el envío del formulario y la ejecución de la request
   * @param e - Valores del formulario
   */
  const handleSubmit = useFormSubmit({ onSubmit: async (e: ScheduleFormProps) => setOnSubmit(e), onSuccess }, methods)

  /** just one useEffect */
  useEffect(() => { onSubmit && submit(onSubmit) }, [submit, onSubmit])

  return {
    methods,
    ...handleSubmit,
    clients: clients?.map((e) => ({ value: e?._id || '', label: `${e?.username || 'Sin nombre'} - ${e?.nit ? `NIT: ${e?.nit}` : 'Sin NIT'}` })) || [],
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------activity form--------------------------------------------------*/
/** Hook personalizado para manejar el formulario de creación de actividades */
export const useActivityForm = (client: string | null, onSuccess?: () => void) => {
  const { createFormat: createActivity } = useFormatMutation('activity')
  const { updateFormat: updateSolicit } = useFormatMutation('solicit')
  const { createNotification } = useNotificationContext()
  const { sendNotification } = useAuthContext()
  const { notifyError } = useNotification()
  const { user } = useAuthContext()

  const { data: collaborators } = useQueryUser().fetchUserByQuery<User>({ role: 'collaborator' })

  const methods = useForm<ActivityFormProps>({
    resolver: zodResolver(activitySchema),
    defaultValues: activityDefaultValues,
    mode: "onChange",
  })

  /**
   * Función que se ejecuta cuando se envía el formulario
   * nos permite controlar el envío del formulario y la ejecución de la request
   * @param e - Valores del formulario
   */
  const handleSubmit = useFormSubmit({
    onSubmit: async (e: ActivityFormProps) => {
      if (user?.role !== 'company') return notifyError({ message: 'No tienes permiso para crear actividades' })
      await createActivity({ ...e, status: 'pendiente' }).then(async () => {
        const body = `Revisa tu bandeja de entradas`
        const title = `Nueva actividad - ${user?.username}`
        await sendNotification({ id: e.collaborator, title, body })
        await createNotification({ //notification inbox with redirect
          recipient: e.collaborator, sender: user?._id,
          title, message: body, type: 'alert',
          url: `${baseFrontendUrl}/calendar`,
        }) //Update solicit status to assigned, after creating activity
        await updateSolicit({ id: e.solicit, data: { status: 'asignado' } })
        client && await sendNotification({//alert to client with message
          body: `Será atendida por ${user?.username}`,
          title: 'Tu solicitud ha sido asignada',
          id: client,
        })
      })
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    ...handleSubmit,
    collaborators: collaborators?.map((e) => ({
      label: `${e?.username || 'Sin nombre'} - ${e?.phone || 'Sin teléfono'}`,
      permissions: e.permissions, icon: UserRoundCheck, value: e?._id || '',
    })) || [],
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------solicit form--------------------------------------------------*/
/**
 * Hook principal que orquesta los sub-hooks de solicitud para el formulario
 * @param id - ID del currículum asociado a la solicitud, necesaria para la renderización
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useSolicitForm = (id?: string, onSuccess?: () => void) => {
  const { createNotification } = useNotificationContext()
  const { observationData } = formatHooks.solicit()
  const { createFormat } = useFormatMutation("solicit")
  const { createFile } = useFormatMutation("file")
  const { sendNotification } = useAuthContext()
  const { notifyError } = useNotification()

  const { data: cv, isLoading } = useQueryFormat().fetchFormatById<Curriculum>('cv', id as string)
  const { data: com } = useQueryUser().fetchUserByQuery<User>({ role: 'company' })
  const client = cv?.office?.headquarter?.client

  const methods = useForm<SolicitFormProps>({
    resolver: zodResolver(solicitSchema),
    defaultValues: solicitDefaultValues,
    mode: "onChange",
  })

  //to load the form on update mode "id"
  useEffect(() => { id && cv && methods.reset({ ...observationData.mapValues(cv) }) }, [id, cv, isLoading])

  /**
   * Filters the company users by permissions and classification
   * - Principals: Only need to have the client permission
   * - Subordinates: Need to have the client permission and the equipment classification
   */
  const companies = useMemo(() => {
    if (!com || !client?._id || !cv?.typeClassification) return []
    return com.filter(company => {
      const hasClientPermission = company.permissions?.includes(client._id)
      if (!hasClientPermission) return false
      if (!company.belongsTo) return true //is company:main
      //if is subordinate, must have the classification expected
      return company.classification?.includes(cv.typeClassification)
    })
  }, [cv, com, client])

  /**
   * Función que se ejecuta cuando se envía el formulario
   * nos permite controlar el envío del formulario y la ejecución de la request
   * @param e - Valores del formulario
   */
  const handleSubmit = useFormSubmit({
    onSubmit: async (e: SolicitFormProps) => {
      const data = { ...observationData.submitData(e, id!) }
      if (!cv) return notifyError({ message: "No tienes acceso a este currículum" })
      if (id) { //ID correspond to cv associated
        const file = e.photoUrl?.[0]?.file //blob
        let photoUrl: string | undefined = undefined
        const extension = file?.name.split('.').pop()
        const name = `img_${Date.now()}.${extension}`
        const path = `files/${id}/solicit/${name}` //upload
        file && (photoUrl = await createFile({ file, path }))
        //we create the solicit and send notification message
        createFormat({ ...data, photoUrl }).then(async () => {
          const title = `Nueva solicitud de ${client?.username}`
          const body = `(${data.priority ? 'URGENTE' : 'PENDIENTE'}) ${data.message}`
          await Promise.all(companies?.map(async (company) => { //send notifications
            await sendNotification({ id: company._id, title, body })
            await createNotification({ //notification inbox with redirect
              title, message: body, type: data.priority ? 'payment' : 'alert',
              recipient: company._id, sender: client?._id,
              url: `${baseFrontendUrl}/form/solicits`,
            })
          }))
        })
      }
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    ...handleSubmit
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------maintenance form--------------------------------------------------*/
/**
 * Hook principal que orquesta los sub-hooks de maintenance
 * @param id - ID del mantenimiento a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useMaintenanceForm = (id?: string, onSuccess?: () => void) => {
  const { referenceData, observationData } = formatHooks.maintenance()
  const { createFormat, updateFormat } = useFormatMutation("maintenance")
  const { createFile, deleteFile } = useFormatMutation("file")
  const { user = {} as User } = useAuthContext()
  const { notifyError } = useNotification()

  const userAllowed = user?.role === 'company' || user?.role === 'collaborator' //user allowed to create mts
  const { data: mt, isLoading } = useQueryFormat().fetchFormatById<Maintenance>('maintenance', id as string)

  const methods = useForm<MaintenanceFormProps>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: maintenanceDefaultValues,
    mode: "onChange",
  })

  //to load the form on update mode "id"
  useEffect(() => { id && loadData() }, [id, isLoading, referenceData.options.curriculums])

  /** Carga los datos del mantenimiento en el formulario */
  const loadData = async () => {// implement callback (suggested)
    mt && methods.reset({
      ...referenceData.mapValues(mt),
      ...observationData.mapValues(mt),
    })
  }

  /**
   * Función que se ejecuta cuando se envía el formulario
   * nos permite controlar el envío del formulario y la ejecución de la request
   * @param e - Valores del formulario
   */
  const handleSubmit = useFormSubmit({
    onSubmit: async (e: MaintenanceFormProps) => {
      const data = { ...referenceData.submitData(e), ...observationData.submitData(e) }
      id ? (
        updateFormat({ id, data }).then(async (mt) => {
          const originalFiles: string[] = mt?.metadata?.files || []
          const keptUrls: string[] = e.annexesPreview || []
          const hasNewAnnexes = e.newAnnexes?.length > 0

          /** Determine if there are changes in the images comparing with the original metadata */
          const hasRemovedFiles = originalFiles.some(url => !keptUrls.includes(url)) //check for removed files
          const hasDifferentLength = originalFiles.length !== keptUrls.length //match length between arrays
          const hasChangesMetadata = hasRemovedFiles || hasDifferentLength || hasNewAnnexes
          if (!hasChangesMetadata) return // No changes in the images

          /** Determine which files have been deleted by comparing the original URLs with the kept ones */
          const toDeleteUrls = mt?.metadata?.files?.filter((url: any) => !keptUrls.includes(url)) || []
          const toDelete = extractMetadataUrl(toDeleteUrls) || [] //extract file names from URLs to delete
          await Promise.all(toDelete.map(async name => await deleteFile({ path: `files/${mt?.curriculum?._id}/maintenances/${name}` })))
          const toAdd = e.newAnnexes?.map(item => item.file) || [] /** Prepare the new files to upload */
          /** Upload new annexes if exist */
          let newUrls: string[] = []
          if (toAdd.length > 0) {
            newUrls = (await Promise.all(toAdd.map(async (file) => {
              const path = `files/${mt.curriculum?._id}/maintenances/${file.name}`
              const url = await createFile({ file, path })
              return url ?? undefined //expected string
            }))).filter((url): url is string => Boolean(url))
          }
          /** Build new metadata and update maintenance */
          const urlsUpdated = [...keptUrls, ...newUrls]
          if (toDelete.length > 0 || toAdd.length > 0 || keptUrls.length !== (mt?.metadata?.files?.length || 0)) {
            await updateFormat({ id, data: { metadata: { ...(mt?.metadata || {}), files: urlsUpdated } } })
          }
        })
      ) : userAllowed ? (
        createFormat({ ...data, createdBy: user._id }).then(async (mt) => {
          const annexes = e.newAnnexes?.map(item => item.file) || []
          /** Upload files to storage and update metadata maintenance */
          if (annexes.length === 0) return //if we dont have some files
          const urls = (await Promise.all(annexes.map(async (file) => {
            const path = `files/${mt.curriculum?._id}/maintenances/${file.name}`
            const url = await createFile({ file, path })
            return url ?? undefined //expected string
          }))).filter((url): url is string => Boolean(url))
          /** Update metadata references with files (images) URLs, if have some */
          urls.length > 0 && await updateFormat({ id: mt._id, data: { metadata: { files: urls } } })
        })
      ) : (notifyError({ message: "No tienes permiso para crear mantenimientos" }))
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    ...handleSubmit,
    referenceData: referenceData.options,
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------curriculum form--------------------------------------------------*/
/**
 * Hook principal que orquesta los sub-hooks de curriculum para el formulario
 * @param id - ID del currículum a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useCurriculumForm = (id?: string, onSuccess?: () => void) => {
  const { characteristicsData, accessoryData, inspectionData, maintenanceData, equipmentData, technicalData, locationData, detailsData, basicData } = formatHooks.curriculum()
  const { createFormat: createAcc, deleteFormat: deleteAcc } = useFormatMutation("accessory")
  const { createFormat: createCV, updateFormat: updateCV } = useFormatMutation("cv")
  const { createFile, deleteFile } = useFormatMutation("file")
  const { user = {} as User } = useAuthContext()
  const { notifyError } = useNotification()
  const queryFormat = useQueryFormat()

  const userAllowed = user?.role === 'company' || user?.role === 'collaborator' //user allowed to create curriculums (createdBy)
  const { data: acc = [], isLoading: isLoadingAcc } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: id, enabled: !!id })
  const { data: cv, isLoading: isLoadingCv } = queryFormat.fetchFormatById<Curriculum>('cv', id as string)
  const isLoading = isLoadingAcc || isLoadingCv

  const methods = useForm<CurriculumFormProps>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: curriculumDefaultValues,
    mode: "onChange",
  })

  useEffect(() => { //to autocomplete based on curriculum name
    const subscription = methods.watch((value, { name }) => {
      if (name !== 'name' || !value.name) return //only execute when name changes and value.name is defined
      const selectedCV = basicData.cvs?.find((cv: any) => cv.name === value.name)
      if (!selectedCV || id) return
      //Update for batch to improve performance
      const auto: Partial<CurriculumFormProps> = {
        ...detailsData.mapAutocomplete(selectedCV),
        ...equipmentData.mapAutocomplete(selectedCV),
        ...technicalData.mapAutocomplete(selectedCV),
        ...maintenanceData.mapAutocomplete(selectedCV),
        ...characteristicsData.mapAutocomplete(selectedCV)
      } //so, the form will be updated with the selected curriculum
      Object.entries(auto).forEach(([field, value]) => value && methods.setValue(field as keyof CurriculumFormProps, value))
    })

    return () => subscription.unsubscribe()
  }, [methods.watch, methods.setValue, basicData.cvs, id])

  //to load the form on update mode "id"
  useEffect(() => { id && loadData() }, [id, isLoading])

  /** Carga los datos del currículo en el formulario */
  const loadData = async () => { //implement callback (suggested)
    cv && methods.reset({
      ...characteristicsData.mapValues(cv),
      ...accessoryData.mapValues(acc),
      ...inspectionData.mapValues(cv),
      ...maintenanceData.mapValues(cv),
      ...technicalData.mapValues(cv),
      ...equipmentData.mapValues(cv),
      ...locationData.mapValues(cv),
      ...detailsData.mapValues(cv),
      ...basicData.mapValues(cv),
    })
  }

  /**
   * Función que se ejecuta cuando se envía el formulario
   * nos permite controlar el envío del formulario y la ejecución de la request
   * @param e - Valores del formulario
   */
  const handleSubmit = useFormSubmit({
    onSubmit: async (e: CurriculumFormProps) => {
      const data = {
        ...characteristicsData.submitData(e),
        ...maintenanceData.submitData(e),
        ...inspectionData.submitData(e),
        ...technicalData.submitData(e),
        ...equipmentData.submitData(e),
        ...locationData.submitData(e),
        ...detailsData.submitData(e),
        ...basicData.submitData(e),
      }
      id ? (
        updateCV({ id, data }).then(async () => {
          /** Upload new photo if exists */
          const file = e.photoUrl?.[0]?.file
          const extension = file?.name.split('.').pop()
          const toDelete = extractMetadataUrl([cv?.photoUrl as string])?.[0]
          file && toDelete && await deleteFile({ path: `files/${id}/preview/${toDelete}` })
          file && await createFile({ file, path: `files/${id}/preview/img.${extension}` })
            .then(async (photoUrl) => await updateCV({ id, data: { photoUrl } }))
          /*--------------------------------------------------------------------------------*/

          /*------------------------- accessories and metadata -------------------------*/
          /** Check if there are changes in the accessories */
          const hasChangesAccessories = (() => {
            if (e.newAccessories?.length !== acc.length) return true
            return acc.some((existingAcc) => { //match each existing accessory with the new
              const matchingNew = e.newAccessories?.find((newAcc) =>
                //if dont find match, it means there were changes
                newAcc.modelEquip === existingAcc.modelEquip
                && newAcc.serie === existingAcc.serie
                && newAcc.name === existingAcc.name
                && newAcc.type === existingAcc.type
              ); return !matchingNew
            })
          })()

          /** Check if there are changes in the metadata (annexes) */
          const hasChangesMetadata = (() => {
            if (e.newAnnexes?.some(item => item.file)) return true
            if (e.annexesPreview?.length !== cv?.metadata?.files?.length) return true
            return !e.annexesPreview?.every(url => cv?.metadata?.files?.includes(url))
          })()

          if (hasChangesAccessories) { //to update accessories
            await Promise.all(acc.map(async (acc) => await deleteAcc({ id: acc._id })))
            await Promise.all(e.newAccessories?.map(async (acc) => await createAcc({ ...acc, curriculum: id })))
          }

          if (hasChangesMetadata) { //to update metadata (annexes)
            const keptUrls = e.annexesPreview || [] //get existing URLs
            const toAdd = e.newAnnexes?.map(item => item.file) || [] //get new files to upload
            if (keptUrls.length === 0 && toAdd.length === 0 && (cv?.metadata?.files?.length || 0) === 0) return
            /** Determine which files have been deleted by comparing the original URLs with the kept ones */
            const toDeleteUrls = cv?.metadata?.files?.filter((url: any) => !keptUrls.includes(url)) || []
            const toDelete = extractMetadataUrl(toDeleteUrls) || [] //extract file names from URLs to delete
            await Promise.all(toDelete.map(async name => await deleteFile({ path: `files/${id}/annexes/${name}` })))
            /** Upload new annexes if exist */
            let newUrls: string[] = []
            if (toAdd.length > 0) { //Upload new files to storage
              newUrls = (await Promise.all(toAdd.map(async (file) => {
                const path = `files/${id}/annexes/${file.name}`
                const url = await createFile({ file, path })
                return url ?? undefined //expected string
              }))).filter((url): url is string => Boolean(url))
            }
            /** Build new metadata and update curriculum */
            const urlsUpdated = [...keptUrls, ...newUrls]
            if (toDelete.length > 0 || toAdd.length > 0 || keptUrls.length !== (cv?.metadata?.files?.length || 0)) {
              await updateCV({ id, data: { metadata: { ...(cv?.metadata || {}), files: urlsUpdated } } })
            }
          }
        })
      ) : userAllowed ? (
        createCV({ ...data, createdBy: user._id }).then(async (cv) => {
          const file = e.photoUrl?.[0]?.file //file to upload (max 1)
          const extension = file?.name.split('.').pop() //png etc
          const path = `files/${cv._id}/preview/img.${extension}`
          const annexes = e.newAnnexes?.map(item => item.file) || []
          /** Create new accessories and save with reference respectitvely */
          await Promise.all(e.newAccessories?.map(async (acc) => await createAcc({ ...acc, curriculum: cv._id })))
          /** Upload preview image (photo) to storage and update curriculum with photo URL reference */
          file && await createFile({ file, path }).then(async (photoUrl) => await updateCV({ id: cv._id, data: { photoUrl } }))
          /** Upload annexes to storage and update metadata curriculum */
          if (annexes.length === 0) return //if we dont have some annexe
          const urls = (await Promise.all(annexes.map(async (file) => {
            const path = `files/${cv._id}/annexes/${file.name}`
            const url = await createFile({ file, path })
            return url ?? undefined //expected string
          }))).filter((url): url is string => Boolean(url))
          /** Update metadata references with annexes URLs, if have some */
          urls.length > 0 && await updateCV({ id: cv._id, data: { metadata: { files: urls } } })
        })
      ) : (notifyError({ message: "No tienes permiso para crear hojas de vida" }))
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    ...handleSubmit,
    basicData: basicData.options,
    equipmentData: basicData.cvs,
    detailsData: detailsData.options,
    locationData: locationData.options,
    inspectionData: inspectionData.options,
  }
}
/*---------------------------------------------------------------------------------------------------------*/