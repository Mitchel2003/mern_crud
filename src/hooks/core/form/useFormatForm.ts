import { curriculumDefaultValues, maintenanceDefaultValues, solicitDefaultValues, activityDefaultValues, scheduleDefaultValues } from '@/utils/constants'
import { Accessory, User, Curriculum, Maintenance, Office } from '@/interfaces/context.interface'
import { useFormatMutation, useQueryFormat } from '@/hooks/query/useFormatQuery'
import { useNotificationContext } from '@/context/NotificationContext'
import { useQueryLocation } from '@/hooks/query/useLocationQuery'
import { useNotification } from '@/hooks/ui/useNotification'
import { useFormSubmit } from '@/hooks/core/useFormSubmit'
import { useQueryUser } from '@/hooks/query/useAuthQuery'
import { formatHooks } from '@/hooks/format/useFormat'
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
import { useAuthContext } from '@/context/AuthContext'
import { UserRoundCheck } from 'lucide-react'
import { usePDFDownload } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { baseUrl } from '@/utils/config'

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
  const { data: client } = useQueryUser().fetchUserById<User>(clientId, !!clientId)
  const { data: clients } = useQueryUser().fetchUserByQuery<User>({ role: 'client' }, !!user) //get clients to show in select
  const { data: companies } = useQueryUser().fetchUserByQuery<User>({ role: 'company', permissions: [client?._id] }, !!client)
  const company = companies?.[0]

  /*--------------------------------------------------complements--------------------------------------------------*/
  const { data: cvs = [] } = useQueryFormat().fetchFormatByQuery<Curriculum>('cv', {}, !!clientId && typeSchedule === 'mantenimiento') //get cvs to maintenance
  const { data: offices = [] } = useQueryLocation().fetchLocationByQuery<Office>('office', {}, !!client && typeSchedule === 'capacitación') //get offices (areas) to training
  /*---------------------------------------------------------------------------------------------------------*/
  const areas = useMemo(() => {
    if (!client || !offices.length || typeSchedule !== 'capacitación') return []
    const clientOffices = offices.filter(office => office?.headquarter?.user?._id === client._id)
    const uniqueAreas = Array.from(new Set(clientOffices.map(office => office.group).filter(Boolean)))
    return uniqueAreas
  }, [client, offices])

  /**
   * Función que contiene la lógica para crear el cronograma
   * @param e - Valores del formulario
   */
  const submit = useCallback(async (e: ScheduleFormProps) => {
    if ((e.typeSchedule === 'mantenimiento' && !cvs.length) || (e.typeSchedule === 'capacitación' && !areas.length)) return
    if (!client || !company || isProcessing.current) return
    isProcessing.current = true
    try { //build path fileName and upload pdf
      const typeClassification = e.typeClassification || 'estándar'
      const fileName = `${e.typeSchedule}-${typeClassification}-${Date.now()}.pdf`
      const path = `client/${e.client}/schedule/${fileName}`

      const type = e.typeSchedule
      const adds = type === 'capacitación' ? { areas } : (type === 'mantenimiento' ? { cvs } : {})
      const PDF = type === 'capacitación' ? TrainingPDF : (type === 'mantenimiento' ? MaintenancePDF : AttendancePDF)
      const blob = await downloadPDFDirect({ fileName, component: PDF as any, props: { ...e, client, company, ...adds } })
      if (!blob) return notifyError({ message: 'No se pudo crear el cronograma' }) //if dont download pdf, return error
      const schedule = { name: fileName, client: e.client, typeClassification, type } //build schedule element to create
      await createFile({ file: blob, path }).then(async (url) => await createSchedule({ ...schedule, url }))
    } finally { setOnSubmit(null); isProcessing.current = false }
    methods.reset()
  }, [createFile, downloadPDFDirect, areas, cvs])

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
    clients: clients?.filter((e) => user?.permissions?.includes(e._id)).map((e) => ({ value: e?._id || '', label: `${e?.username || 'Sin nombre'} - ${e?.nit ? `NIT: ${e?.nit}` : 'Sin NIT'}`, icon: UserRoundCheck })) || [],
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------activity form--------------------------------------------------*/
/** Hook personalizado para manejar el formulario de creación de actividades */
export const useActivityForm = (onSuccess?: () => void) => {
  const { createFormat: createActivity } = useFormatMutation('activity')
  const { updateFormat: updateSolicit } = useFormatMutation('solicit')
  const { createNotification } = useNotificationContext()
  const { sendNotification } = useAuthContext()
  const { notifyError } = useNotification()
  const { user } = useAuthContext()

  const { data: engineers } = useQueryUser().fetchUserByQuery<User>({ role: 'engineer' })

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
  const onSubmit = methods.handleSubmit(async (e: ActivityFormProps) => {
    if (user?.role !== 'company') return notifyError({ message: 'No tienes permiso para crear actividades' })
    await createActivity({ ...e, status: 'pendiente' }).then(async () => {
      const title = `Nueva actividad - ${user?.username}`
      const body = `Revisa tu bandeja de entradas`
      await sendNotification({ id: e.engineer, title, body }) //messaging
      await createNotification({ //create notification inbox with redirect
        title, message: body, type: 'alert', url: `${baseUrl}/dashboard`,
        recipient: e.engineer, sender: user?._id,
      }) //Update solicit status to assigned, after creating activity
      await updateSolicit({ id: e.solicit, data: { status: 'asignado' } })
    })
    methods.reset()
    onSuccess?.()
  })

  return {
    methods, onSubmit,
    engineers: engineers?.map((e) => ({ value: e?._id || '', label: `${e?.username || 'Sin nombre'} - ${e?.phone || 'Sin teléfono'}`, icon: UserRoundCheck })) || [],
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
  const company = com?.[0]

  const methods = useForm<SolicitFormProps>({
    resolver: zodResolver(solicitSchema),
    defaultValues: solicitDefaultValues,
    mode: "onChange",
  })

  //to load the form on update mode "id"
  useEffect(() => { id && cv && methods.reset({ ...observationData.mapValues(cv) }) }, [id, cv, isLoading])

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
        file && (photoUrl = await createFile({ file, path: `files/${id}/solicit/img_${Date.now()}` }))
        createFormat({ ...data, photoUrl }).then(async () => {
          const client = cv?.office?.headquarter?.user
          const title = `Nueva solicitud de ${client?.username}`
          const body = `(${data.priority ? 'URGENTE' : 'PENDIENTE'}) ${data.message}`
          company && await sendNotification({ id: company._id, title, body }) //messaging
          company && await createNotification({ //create notification inbox with redirect
            recipient: company._id, sender: client?._id, url: `${baseUrl}/form/solicit`,
            title, message: body, type: data.priority ? 'payment' : 'alert',
          })
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
  const { data: mt, isLoading } = useQueryFormat().fetchFormatById<Maintenance>('maintenance', id as string)

  const methods = useForm<MaintenanceFormProps>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: maintenanceDefaultValues,
    mode: "onChange",
  })

  //to load the form on update mode "id"
  useEffect(() => { id && loadData() }, [id, isLoading])

  /** Carga los datos del currículo en el formulario */
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
      id ? updateFormat({ id, data }) : createFormat(data)
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
  const queryFormat = useQueryFormat()

  const { data: acc = [], isLoading: isLoadingAcc } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: id, enabled: !!id })
  const { data: cv, isLoading: isLoadingCv } = queryFormat.fetchFormatById<Curriculum>('cv', id as string)
  const isLoading = isLoadingAcc || isLoadingCv

  const methods = useForm<CurriculumFormProps>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: curriculumDefaultValues,
    mode: "onChange",
  })

  useEffect(() => {//to autocomplete based on curriculum name
    const subscription = methods.watch((value, { name }) => {
      if (name !== 'name' || !value.name) return // only execute when name changes and value.name is defined
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
  const loadData = async () => {// implement callback (suggested)
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
        ...accessoryData.submitData(e),
        ...inspectionData.submitData(e),
        ...maintenanceData.submitData(e),
        ...technicalData.submitData(e),
        ...equipmentData.submitData(e),
        ...locationData.submitData(e),
        ...detailsData.submitData(e),
        ...basicData.submitData(e),
      }
      id ? (
        updateCV({ id, data }).then(async () => {
          const hasChanges = (() => {
            if (data.newAccessories?.length !== acc.length) return true
            return acc.some((existingAcc) => { //match each existing accessory with the new
              const matchingNew = data.newAccessories?.find((newAcc) =>
                //if dont find match, it means there were changes
                newAcc.modelEquip === existingAcc.modelEquip
                && newAcc.serie === existingAcc.serie
                && newAcc.name === existingAcc.name
                && newAcc.type === existingAcc.type
              ); return !matchingNew
            })
          })()

          if (hasChanges) {
            await Promise.all(acc.map(async (acc) => await deleteAcc({ id: acc._id })))
            await Promise.all(data.newAccessories?.map(async (acc) => await createAcc({ ...acc, curriculum: id })))
          }
          const file = e.photoUrl?.[0]?.file
          const path = `files/${id}/preview/img`
          file && await deleteFile({ path }).then(async () => {
            const photoUrl = await createFile({ file, path })
            await updateCV({ id, data: { photoUrl } })
          })
        })
      ) : (
        createCV(data).then(async (cv) => {
          const file = e.photoUrl?.[0]?.file
          const path = `files/${cv._id}/preview/img`
          await Promise.all(data.newAccessories?.map(async (acc) => await createAcc({ ...acc, curriculum: cv._id })))
          file && await createFile({ file, path }).then(async (photoUrl) => await updateCV({ id: cv._id, data: { photoUrl } }))
        })
      )
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