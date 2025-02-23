import { Accessory, Curriculum, Maintenance } from '@/interfaces/context.interface'
import { useFormatMutation, useQueryFormat } from '@/hooks/query/useFormatQuery'
import { useFormSubmit } from '@/hooks/core/useFormSubmit'
import { formatHooks } from '@/hooks/format/useFormat'
import { zodResolver } from '@hookform/resolvers/zod'
import { Metadata } from '@/interfaces/db.interface'
import { processFile } from '@/lib/utils'
import { useForm } from 'react-hook-form'

import { MaintenanceFormProps, maintenanceSchema } from '@/schemas/format/maintenance.schema'
import { curriculumSchema, CurriculumFormProps } from '@/schemas/format/curriculum.schema'
import { curriculumDefaultValues, maintenanceDefaultValues } from '@/utils/constants'
import { useEffect, useState, useCallback } from 'react'

/*--------------------------------------------------Curriculum--------------------------------------------------*/
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

  const { data: img = [], isLoading: isLoadingImg } = queryFormat.fetchAllFiles<Metadata>('file', { path: `files/${id}/preview`, enabled: !!id })
  const { data: acc = [], isLoading: isLoadingAcc } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: id, enabled: !!id })
  const { data: cv, isLoading: isLoadingCv } = queryFormat.fetchFormatById<Curriculum>('cv', id as string)
  const isLoading = isLoadingAcc || isLoadingCv || isLoadingImg

  const methods = useForm<CurriculumFormProps>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: curriculumDefaultValues,
    mode: "onChange",
  })

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
      ...detailsData.mapValues(cv),
      ...basicData.mapValues(cv, img),
      ...locationData.mapValues(cv),
    })
  }

  /**
   * Función que se ejecuta cuando se envía el formulario
   * nos permite controlar el envío del formulario y la ejecución de la request
   * @param e - Valores del formulario
   */
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
          const hasChanges = (() => {
            if (data.newAccessories?.length !== acc.length) return true
            return acc.some((existingAcc) => {//match each existing accessory with the new
              const matchingNew = data.newAccessories?.find((newAcc) =>
                newAcc.modelEquip === existingAcc.modelEquip
                && newAcc.serie === existingAcc.serie
                && newAcc.name === existingAcc.name
                && newAcc.type === existingAcc.type
              ); return !matchingNew //if dont find match, it means there were changes
            })
          })()

          if (hasChanges) {
            await Promise.all(acc.map(async (acc) => await deleteAcc({ id: acc._id })))
            await Promise.all(data.newAccessories?.map(async (acc) => await createAcc({ ...acc, curriculum: id })))
          }

          data.photoUrl && await deleteFile({ path: `files/${id}/preview/img` }).then(async () => {
            const { name, type, size } = data.photoUrl
            const base64 = await processFile(data.photoUrl)
            const file = { buffer: base64, originalname: name, mimetype: type, size }
            await createFile({ files: [file], path: `files/${id}/preview/img`, unique: true })
          })
        })
      ) : (
        createCV(data).then(async (e) => {
          await Promise.all(data.newAccessories?.map(async (acc) => await createAcc({ ...acc, curriculum: e._id })))
          if (!data.photoUrl) return
          const { name, type, size } = data.photoUrl
          const base64 = await processFile(data.photoUrl)
          const file = { buffer: base64, originalname: name, mimetype: type, size }
          await createFile({ files: [file], path: `files/${e._id}/preview/img`, unique: true })
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

/** Hook principal que orquesta los sub-hooks de curriculum para la tabla */
export const useCurriculumTable = () => {
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined)
  const { deleteFormat: deleteAcc } = useFormatMutation("accessory")
  const { deleteFormat: deleteCv } = useFormatMutation("cv")
  const { deleteFile } = useFormatMutation("file")
  const queryFormat = useQueryFormat()

  const { data: accs = [] } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: onDelete, enabled: !!onDelete })
  const { data: img = [] } = queryFormat.fetchAllFiles<Metadata>('file', { path: `files/${onDelete}/preview`, enabled: !!onDelete })

  const deleteCurriculum = useCallback(async (id: string) => {
    await deleteCv({ id }).then(async () => {
      accs?.length > 0 && await Promise.all(accs.map(acc => deleteAcc({ id: acc._id })))
      img?.[0]?.url && await deleteFile({ path: `files/${id}/preview/img` })
    }).finally(() => setOnDelete(undefined))
  }, [accs, img, deleteCv, deleteAcc, deleteFile])

  useEffect(() => {
    onDelete && deleteCurriculum(onDelete)
  }, [onDelete, deleteCurriculum])

  return {
    handleDelete: (id: string) => setOnDelete(id)
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------Maintenance--------------------------------------------------*/
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

/** Hook principal que orquesta los sub-hooks de mantenimiento para la tabla */
export const useMaintenanceTable = () => {
  const [onDelete, setOnDelete] = useState<Maintenance | undefined>(undefined)
  const { deleteFormat: deleteMT } = useFormatMutation("maintenance")
  const { deleteFile } = useFormatMutation("file")
  const queryFormat = useQueryFormat()

  const { data: img = [] } = queryFormat.fetchAllFiles<Metadata>('file', { path: `files/${onDelete?.curriculum._id}/mt/${onDelete?._id}`, enabled: !!onDelete })

  const deleteMaintenance = useCallback(async (id: string) => {
    await deleteMT({ id }).then(async (e: Maintenance) => {
      console.log('maintenance deleted', e)
      img?.length > 0 && await deleteFile({ path: `files/${e.curriculum._id}/mt/${e._id}` })
    }).finally(() => setOnDelete(undefined))
  }, [img, deleteMT, deleteFile])

  useEffect(() => {
    onDelete && deleteMaintenance(onDelete._id)
  }, [onDelete, deleteMaintenance])

  return {
    handleDelete: (mt: Maintenance) => setOnDelete(mt)
  }
}