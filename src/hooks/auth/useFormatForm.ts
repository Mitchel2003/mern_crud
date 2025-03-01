import { Accessory, Company, Curriculum, Maintenance } from '@/interfaces/context.interface'
import { useFormatMutation, useQueryFormat } from '@/hooks/query/useFormatQuery'
import { useFormSubmit } from '@/hooks/core/useFormSubmit'
import { useQueryUser } from '@/hooks/query/useUserQuery'
import { formatHooks } from '@/hooks/format/useFormat'
import { zodResolver } from '@hookform/resolvers/zod'
import { Metadata } from '@/interfaces/db.interface'

import { MaintenanceFormProps, maintenanceSchema } from '@/schemas/format/maintenance.schema'
import { curriculumSchema, CurriculumFormProps } from '@/schemas/format/curriculum.schema'
import { curriculumDefaultValues, maintenanceDefaultValues } from '@/utils/constants'
import { useEffect, useState, useCallback, useRef } from 'react'

import MaintenancePDF from '@/lib/export/MaintenancePDF'
import { usePDFDownload } from '@/lib/utils'
import { processFile } from '@/lib/utils'
import { useForm } from 'react-hook-form'

/*--------------------------------------------------Curriculum form--------------------------------------------------*/
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

  useEffect(() => {//to autocomplete based on curriculum name
    const subscription = methods.watch((value, { name }) => {
      if (name !== 'name' || !value.name) return // only execute when name changes and value.name is defined
      const selectedCV = basicData.cvs?.find((cv: any) => cv.name === value.name)
      if (!selectedCV || id) return

      const auto: Partial<CurriculumFormProps> = {// Update for batch to improve performance
        ...detailsData.mapAutocomplete(selectedCV),
        ...equipmentData.mapAutocomplete(selectedCV),
        ...technicalData.mapAutocomplete(selectedCV),
        ...maintenanceData.mapAutocomplete(selectedCV),
        ...characteristicsData.mapAutocomplete(selectedCV)
      }
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
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------Maintenance form--------------------------------------------------*/
/**
 * Hook principal que orquesta los sub-hooks de maintenance
 * @param id - ID del mantenimiento a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useMaintenanceForm = (id?: string, onSuccess?: () => void) => {
  const { createFormat, updateFormat } = useFormatMutation("maintenance")
  const { referenceData, observationData } = formatHooks.maintenance()

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
    onSubmit: async (e: any) => {
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

/*--------------------------------------------------Curriculum table--------------------------------------------------*/
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

/*--------------------------------------------------Maintenance table--------------------------------------------------*/
/** Hook principal que orquesta los sub-hooks de mantenimiento para la tabla */
export const useMaintenanceTable = () => {
  const { data: companies } = useQueryUser().fetchAllUsers<Company>('company')/** get all companies */
  const [onDownload, setOnDownload] = useState<Maintenance | undefined>(undefined)
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined)
  const { deleteFormat: deleteMT } = useFormatMutation("maintenance")
  const { downloadPDF } = usePDFDownload()
  const isDownloading = useRef(false)
  const com = companies?.[0]

  const { data: imgs = [] } = useQueryFormat().fetchAllFiles<Metadata>('file', { path: `company/${com?._id}/preview`, enabled: !!com?._id })

  const downloadFile = useCallback(async (mt: Maintenance) => {
    if (isDownloading.current) return; isDownloading.current = true
    const fileName = `mantenimiento-${mt.curriculum?.name}-${new Date(mt.dateMaintenance).toISOString().split('T')[0]}.pdf`
    await downloadPDF({ fileName, component: MaintenancePDF, props: { mt, com, imgs } })
      .finally(() => { setOnDownload(undefined); isDownloading.current = false })
  }, [downloadPDF, companies, imgs])

  const deleteMaintenance = useCallback(async (id: string) => {
    await deleteMT({ id }).finally(() => setOnDelete(undefined))
  }, [deleteMT])

  useEffect(() => {
    onDelete && deleteMaintenance(onDelete)
    onDownload && downloadFile(onDownload)
  }, [onDelete, onDownload, downloadFile, deleteMaintenance])

  return {
    handleDelete: (id: string) => setOnDelete(id),
    handleDownload: (mt: Maintenance) => setOnDownload(mt)
  }
}
/*---------------------------------------------------------------------------------------------------------*/