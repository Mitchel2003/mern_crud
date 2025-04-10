import { Accessory, User, Curriculum, Maintenance } from '@/interfaces/context.interface'
import { useFormatMutation, useQueryFormat } from '@/hooks/query/useFormatQuery'
import { useNotificationContext } from '@/context/NotificationContext'
import { useNotification } from '@/hooks/ui/useNotification'
import { useFormSubmit } from '@/hooks/core/useFormSubmit'
import { useQueryUser } from '@/hooks/query/useAuthQuery'
import { formatHooks } from '@/hooks/format/useFormat'
import { zodResolver } from '@hookform/resolvers/zod'
import { Metadata } from '@/interfaces/db.interface'

import { curriculumDefaultValues, maintenanceDefaultValues, solicitDefaultValues } from '@/utils/constants'
import { MaintenanceFormProps, maintenanceSchema } from '@/schemas/format/maintenance.schema'
import { curriculumSchema, CurriculumFormProps } from '@/schemas/format/curriculum.schema'
import { solicitSchema, SolicitFormProps } from '@/schemas/format/solicit.schema'
import { useAuthContext } from '@/context/AuthContext'
import { useForm } from 'react-hook-form'
import { baseUrl } from '@/utils/config'
import { useEffect } from 'react'

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
    id,
    methods,
    ...handleSubmit,
    referenceData: referenceData.options,
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

  const { data: img } = useQueryFormat().fetchAllFiles<Metadata>({ path: `files/${id}/preview`, enabled: !!id })
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
      if (id && cv) {
        const file = e.photoUrl?.[0]?.file
        let photoUrl: string | undefined = undefined
        file && (photoUrl = await createFile({ file, path: `files/${id}/solicit/img_${Date.now()}` }))
        createFormat({ ...data, photoUrl }).then(async () => {
          const client = cv?.office?.headquarter?.user
          const title = `Nueva solicitud de ${client?.username}`
          const body = `(${data.priority ? 'URGENTE' : 'PENDIENTE'}) ${data.message}`
          company && await sendNotification({ id: company._id, title, body }) //messaging
          company && await createNotification({ //create notification inbox
            title, message: body, type: data.priority ? 'payment' : 'alert',
            recipient: company._id, sender: client?._id,
            url: `${baseUrl}/form/solicit`,
          })
        })
      } else { notifyError({ message: "No tienes acceso a este currículum" }) }
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    methods,
    ...handleSubmit,
    img: img?.[0]?.url || '',
  }
}
/*---------------------------------------------------------------------------------------------------------*/