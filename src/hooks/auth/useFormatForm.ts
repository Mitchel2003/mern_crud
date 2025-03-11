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
import { useEffect, useState, useCallback, useRef, useMemo } from 'react'

import MaintenancePDF from '@/lib/export/MaintenancePDF'
import CurriculumPDF from '@/lib/export/CurriculumPDF'
import { usePDFDownload } from '@/lib/utils'
import { processFile } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { formatDateTime } from '@/utils/format'

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
    onSubmit: async (e: any) => {
      const data = {
        ...referenceData.submitData(e),
        ...observationData.submitData(e)
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
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------Curriculum table--------------------------------------------------*/
interface MaintenanceChildren extends Maintenance { childRows: (Maintenance & { isPreventive: boolean })[] }
interface GroupedMaintenance extends Record<string, {
  latestPreventive: Maintenance | null,
  allMaintenance: Maintenance[],
  equipmentName: string
}> { }

/** Hook principal que orquesta los sub-hooks de curriculum para la tabla */
export const useCurriculumTable = () => {
  const [onDownloadZip, setOnDownloadZip] = useState<Curriculum[] | undefined>(undefined)
  const [onDownload, setOnDownload] = useState<Curriculum | undefined>(undefined)
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined)
  const { deleteFormat: deleteMt } = useFormatMutation("maintenance")
  const { deleteFormat: deleteAcc } = useFormatMutation("accessory")
  const { deleteFormat: deleteCv } = useFormatMutation("cv")
  const { downloadPDF, downloadZIP } = usePDFDownload()
  const { deleteFile } = useFormatMutation("file")
  const isProcessing = useRef(false)
  const queryFormat = useQueryFormat()
  const queryUser = useQueryUser()

  const { data: mts = [] } = queryFormat.fetchAllFormats<Maintenance>('maintenance')/** get all maintenances */
  const { data: coms } = queryUser.fetchAllUsers<Company>('company')/** get all companies */
  const com = coms?.[0]

  const { data: imgCom = [], isLoading: isLoadingCom } = queryFormat.fetchAllFiles<Metadata>('file', { path: `company/${com?._id}/preview`, enabled: !!com })
  const { data: imgCli = [], isLoading: isLoadingCli } = queryFormat.fetchAllFiles<Metadata>('file', { path: `client/${onDownload?.office?.headquarter?.client?._id}/preview`, enabled: !!onDownload })
  const { data: imgCv = [], isLoading: isLoadingCv } = queryFormat.fetchAllFiles<Metadata>('file', { path: `files/${onDelete || onDownload?._id}/preview`, enabled: !!onDelete || !!onDownload })
  const { data: accs = [] } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: onDelete || onDownload?._id, enabled: !!onDelete || !!onDownload })
  const isLoading = isLoadingCli || isLoadingCv || isLoadingCom

  /**
   * Function that formats the retrieved maintenances, returns the prepared data for the table
   * This allow to group the maintenances by equipment and sort them by date
   * @param mts - Array of maintenance records to format
   * @returns Array of formatted maintenance records
   */
  const formatMaintenances = useCallback((mts?: Maintenance[]): MaintenanceChildren[] => {
    if (!mts?.length) return []
    // 1. normalize data (dates)
    const normalizedMts = mts.map(mt => ({
      ...mt,
      dateMaintenance: new Date(mt.dateMaintenance),
      typeMaintenance: mt.typeMaintenance.toLowerCase(),
      dateNextMaintenance: new Date(mt.dateNextMaintenance)
    }))

    // 2. Group by equipment ID and find last preventive maintenance
    const groupedMaintenance = normalizedMts.reduce((acc, mt) => {
      const equipmentId = mt.curriculum?._id
      if (!equipmentId) return acc
      if (!acc[equipmentId]) {// Initialize group if it doesn't exist
        acc[equipmentId] = { allMaintenance: [], latestPreventive: null, equipmentName: mt.curriculum.name }
      }
      acc[equipmentId].allMaintenance.push(mt)// Add to maintenance array
      if (mt.typeMaintenance === 'preventivo') {// Update last preventive maintenance if applicable
        const currentDate = mt.dateMaintenance.getTime()
        const existingDate = acc[equipmentId].latestPreventive ? acc[equipmentId].latestPreventive.dateMaintenance.getTime() : 0
        if (!acc[equipmentId].latestPreventive || currentDate > existingDate) { acc[equipmentId].latestPreventive = mt }
      }
      return acc
    }, {} as GroupedMaintenance)

    // 3. Transform and sort the data
    const formattedData = Object.entries(groupedMaintenance).filter(([_, group]) => !!group.latestPreventive).map(([_, group]) => {
      const sortedMaintenance = group.allMaintenance.sort((a, b) => b.dateMaintenance.getTime() - a.dateMaintenance.getTime())// Sort maintenance by date (most recent first)
      return {
        ...group.latestPreventive!, // last maintenance preventive
        childRows: sortedMaintenance.filter(mt => mt._id !== group.latestPreventive!._id) // exclude mt preventive principal
          .map(mt => ({ ...mt, isPreventive: mt.typeMaintenance === 'preventivo' }))
      } as MaintenanceChildren
    })

    // 4. Sort results by maintenance date
    return formattedData.sort((a, b) => b.dateMaintenance.getTime() - a.dateMaintenance.getTime())
  }, [])

  /**
   * Función que se ejecuta cuando se descarga currículos multiple
   * @param {Curriculum[]} cvs - Currículos a descargar
   */
  const downloadFileZip = useCallback(async (cvs: Curriculum[]) => { //working here...
    if (!imgCv?.[0]?.url || !imgCli?.[0]?.url || !imgCom?.[0]?.url) return
    if (isProcessing.current) return
    isProcessing.current = true
    // Prepare components for the ZIP
    const pdfComponents = cvs.map(cv => ({
      fileName: `${cv?.name}-${new Date().toISOString().split('T')[0]}.pdf`,
      component: CurriculumPDF, props: {
        cv, accs, com: coms?.[0] as Company,
        cliLogo: imgCli?.[0]?.url,
        comLog: imgCom?.[0]?.url,
        cvLogo: imgCv?.[0]?.url
      }
    }))
    // Generate zip name based on date and number of equipments
    const zipName = `hojas-de-vida-${new Date().toISOString().split('T')[0]}-${cvs.length}equipos.zip`
    await downloadZIP({ zipName, components: pdfComponents }).finally(() => { setOnDownloadZip(undefined); isProcessing.current = false })// Download ZIP with all PDFs
  }, [downloadZIP])

  /**
   * Función que se ejecuta cuando se descarga un currículo
   * @param {Curriculum} cv - Currículo a descargar
   */
  const downloadFile = useCallback(async (cv: Curriculum) => {
    if (!imgCv?.[0]?.url || !imgCli?.[0]?.url || !imgCom?.[0]?.url) return
    if (isProcessing.current) return
    isProcessing.current = true
    const fileName = `hoja-de-vida-${cv.name}-${cv.modelEquip}.pdf`
    await downloadPDF({
      fileName, component: CurriculumPDF, props: {
        cv, accs, com: coms?.[0] as Company,
        comLogo: imgCom[0].url,
        cliLogo: imgCli[0].url,
        cvLogo: imgCv[0].url
      }
    }).finally(() => { setOnDownload(undefined); isProcessing.current = false })
  }, [downloadPDF])

  /**
   * Función que se ejecuta cuando se elimina un currículo
   * @param {string} id - ID del currículo a eliminar
  */
  const deleteCurriculum = useCallback(async (id: string) => {
    if (isProcessing.current) return
    isProcessing.current = true
    await deleteCv({ id }).then(async () => {
      accs?.length > 0 && await Promise.all(accs.map(acc => deleteAcc({ id: acc._id })))
      mts?.length > 0 && await Promise.all(mts.map(mt => deleteMt({ id: mt._id })))
      imgCv?.[0]?.url && await deleteFile({ path: `files/${id}/preview/img` })
    }).finally(() => { isProcessing.current = false; setOnDelete(undefined) })
  }, [deleteCv, deleteMt, deleteAcc, deleteFile])

  /** just one useEffect */
  useEffect(() => {
    onDelete && deleteCurriculum(onDelete)
    onDownload && downloadFile(onDownload)
    onDownloadZip && downloadFileZip(onDownloadZip)
  }, [
    deleteCurriculum, downloadFile, downloadFileZip, onDelete, onDownload, onDownloadZip,
    accs, coms, imgCli, imgCom, imgCv, isLoading
  ])

  return {
    handleDelete: (id: string) => setOnDelete(id),
    handleDownload: (cv: Curriculum) => setOnDownload(cv),
    handleDownloadZip: (cvs: Curriculum[]) => setOnDownloadZip(cvs),
    maintenances: useMemo(() => formatMaintenances(mts), [mts, formatMaintenances]),
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------Maintenance table--------------------------------------------------*/
/** Hook principal que orquesta los sub-hooks de mantenimiento para la tabla */
export const useMaintenanceTable = () => {
  const [onDownloadZip, setOnDownloadZip] = useState<Maintenance[] | undefined>(undefined)
  const [onDownload, setOnDownload] = useState<Maintenance | undefined>(undefined)
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined)
  const { deleteFormat: deleteMT } = useFormatMutation("maintenance")
  const { downloadPDF, downloadZIP } = usePDFDownload()
  const isProcessing = useRef(false)

  const { data: mts } = useQueryFormat().fetchAllFormats<Maintenance>('maintenance')
  const { data: companies } = useQueryUser().fetchAllUsers<Company>('company')
  const com = companies?.[0]

  const { data: imgs } = useQueryFormat().fetchAllFiles<Metadata>('file', { path: `company/${com?._id}/preview`, enabled: !!com })

  /**
   * Función que se ejecuta cuando se descarga mantenimientos multiple
   * @param {Maintenance[]} mts - Mantenimientos a descargar
   */
  const downloadFileZip = useCallback(async (mts: Maintenance[]) => {
    if (isProcessing.current) return
    isProcessing.current = true
    // Grouping by equipment
    const groupedByEquipment = mts.reduce((acc, mt) => {
      const curriculumId = mt.curriculum?._id
      if (!curriculumId) return acc
      if (!acc.has(curriculumId)) acc.set(curriculumId, [])
      acc.get(curriculumId)?.push(mt)
      return acc
    }, new Map<string, Maintenance[]>())

    // Prepare components for the ZIP
    const pdfComponents = Array.from(groupedByEquipment.entries()).flatMap(([_, equipmentMts]) =>
      equipmentMts.map(mt => ({
        props: { mt, com, imgs },
        component: MaintenancePDF,
        fileName: `${mt.curriculum?.name} - ${mt.curriculum?.modelEquip}/${mt.typeMaintenance}-${new Date(mt.dateMaintenance).toISOString().split('T')[0]}.pdf`
      }))
    )

    // Generate zip name based on date and number of equipments
    const zipName = `mantenimientos-${new Date().toISOString().split('T')[0]}-${groupedByEquipment.size}equipos.zip`
    await downloadZIP({ zipName, components: pdfComponents }).finally(() => { setOnDownloadZip(undefined); isProcessing.current = false })
  }, [downloadZIP, com, imgs])

  /**
   * Función que se ejecuta cuando se descarga un mantenimiento
   * @param {Maintenance} mt - Mantenimiento a descargar
   */
  const downloadFile = useCallback(async (mt: Maintenance) => {
    if (isProcessing.current) return
    isProcessing.current = true
    const fileName = `mantenimiento-${mt.curriculum?.name}-${mt.curriculum?.modelEquip} (${formatDateTime(mt.dateMaintenance)}).pdf`
    await downloadPDF({ fileName, component: MaintenancePDF, props: { mt, com, imgs } })
      .finally(() => { setOnDownload(undefined); isProcessing.current = false })
  }, [downloadPDF, com, imgs])

  /**
   * Función que se ejecuta cuando se elimina un mantenimiento
   * @param {string} id - ID del mantenimiento a eliminar
   */
  const deleteMaintenance = useCallback(async (id: string) => {
    if (isProcessing.current) return
    isProcessing.current = true
    await deleteMT({ id }).finally(() => { setOnDelete(undefined); isProcessing.current = false })
  }, [deleteMT])

  /** just one useEffect */
  useEffect(() => {
    onDelete && deleteMaintenance(onDelete)
    onDownload && downloadFile(onDownload)
    onDownloadZip && downloadFileZip(onDownloadZip)
  }, [onDelete, onDownload, onDownloadZip, downloadFile, deleteMaintenance, downloadFileZip])

  return {
    maintenances: useMemo(() => mts, [mts]),
    handleDelete: (id: string) => setOnDelete(id),
    handleDownload: (mt: Maintenance) => setOnDownload(mt),
    handleDownloadZip: (mts: Maintenance[]) => setOnDownloadZip(mts),
  }
}