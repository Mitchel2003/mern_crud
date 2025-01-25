import { useFormatMutation, useQueryFormat } from '@/hooks/query/useFormatQuery'
import { useFormSubmit } from '@/hooks/core/useFormSubmit'
import { formatHooks } from '@/hooks/format/useFormat'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

import { MaintenanceFormProps, maintenanceSchema } from '@/schemas/format/maintenance.schema'
import { curriculumSchema, CurriculumFormProps } from '@/schemas/format/curriculum.schema'
import { curriculumDefaultValues, maintenanceDefaultValues } from '@/utils/constants'
import { Accessory, Curriculum, Maintenance } from '@/interfaces/context.interface'
import { processFile } from '@/lib/utils'

/**
 * Hook principal que orquesta los sub-hooks de curriculum
 * @param id - ID del currículum a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useCurriculumForm = (id?: string, onSuccess?: () => void) => {
  const { characteristicsData, accessoryData, inspectionData, maintenanceData, equipmentData, technicalData, locationData, detailsData, basicData } = formatHooks.curriculum()
  const { createFormat: createAcc, deleteFormat: deleteAcc } = useFormatMutation("accessory")
  const { createFormat: createCV, updateFormat: updateCV } = useFormatMutation("cv")
  const { createFile, deleteFile } = useFormatMutation("file")

  const { data: acc } = useQueryFormat().fetchFormatByQuery<Accessory>('accessory', { curriculum: id })
  const { data: cv } = useQueryFormat().fetchFormatById<Curriculum>('cv', id as string)

  const methods = useForm<CurriculumFormProps>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: curriculumDefaultValues,
    mode: "onChange",
  })

  useEffect(() => { loadData() }, [id])

  const loadData = async () => {
    cv && methods.reset({
      ...characteristicsData.mapValues(cv),
      ...accessoryData.mapValues(acc),
      ...inspectionData.mapValues(cv),
      ...maintenanceData.mapValues(cv),
      ...technicalData.mapValues(cv),
      ...equipmentData.mapValues(cv),
      ...detailsData.mapValues(cv),
      ...basicData.mapValues(cv),
      ...locationData.mapValues(cv),
    })
  }

  const handleSubmit = useFormSubmit({
    onSubmit: async (e: any) => {
      const data = {
        ...characteristicsData.submitData(e),
        ...accessoryData.submitData(e),
        ...inspectionData.submitData(e),
        ...maintenanceData.submitData(e),
        ...technicalData.submitData(e),
        ...equipmentData.submitData(e),
        ...detailsData.submitData(e),
        ...basicData.submitData(e),
        ...locationData.submitData(e),
      }
      id ? (
        updateCV({ id, data }).then(async () => {
          const { data: existingAccessories } = useQueryFormat().fetchFormatByQuery<Accessory>('accessory', { curriculum: id })
          await Promise.all(existingAccessories?.map(async (acc) => await deleteAcc({ id: acc._id })) || [])
          await Promise.all(data.newAccessories?.map(async (acc) => await createAcc({ ...acc, curriculum: id })) || [])

          data.photoUrl && await deleteFile({ id, ref: 'preview', filename: 'img' }).then(async () => {//delete previous file conditionally
            const { name, type, size } = data.photoUrl
            const base64 = await processFile(data.photoUrl)
            const file = { buffer: base64, originalname: name, mimetype: type, size }
            await createFile({ files: [file], filename: 'img', ref: 'preview', id })
          })
        })
      ) : (
        createCV(data).then(async (e) => {
          await Promise.all(data.newAccessories?.map(async (acc) => await createAcc({ ...acc, curriculum: e._id })))
          if (!data.photoUrl) return
          const { name, type, size } = data.photoUrl
          const base64 = await processFile(data.photoUrl)
          const file = { buffer: base64, originalname: name, mimetype: type, size }
          await createFile({ files: [file], filename: 'img', ref: 'preview', id: e._id, unique: true })
        })
      )
      methods.reset()
    },
    onSuccess
  }, methods)

  return {
    id,
    methods,
    ...handleSubmit,
    detailsData: detailsData.options,
    locationData: locationData.options,
    inspectionData: inspectionData.options
  }
}

/**
 * Hook principal que orquesta los sub-hooks de maintenance
 * @param id - ID del mantenimiento a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useMaintenanceForm = (id?: string, onSuccess?: () => void) => {
  const { referenceData, observationData, engineerServiceData } = formatHooks.maintenance()
  const { data: mt } = useQueryFormat().fetchFormatById<Maintenance>('maintenance', id as string)
  const { createFormat, updateFormat } = useFormatMutation("maintenance")

  const methods = useForm<MaintenanceFormProps>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: maintenanceDefaultValues,
    mode: "onChange",
  })

  useEffect(() => { loadData() }, [id])

  const loadData = async () => {
    mt && methods.reset({
      ...referenceData.mapValues(mt),
      ...observationData.mapValues(mt),
      ...engineerServiceData.mapValues(mt),
    })
  }

  const handleSubmit = useFormSubmit({
    onSubmit: async (e: any) => {
      const data = {
        ...referenceData.submitData(e),
        ...observationData.submitData(e),
        ...engineerServiceData.submitData(e),
      }
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