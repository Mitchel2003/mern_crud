import { Accessory, Curriculum, Maintenance, Solicit, Schedule } from '@/interfaces/context.interface'
import { extractMetadataUrl, formatDateTime } from '@/constants/format.constants'
import { useFormatMutation, useQueryFormat } from '@/hooks/query/useFormatQuery'
import MaintenancePDF from '@/lib/export/MaintenancePDF'
import CurriculumPDF from '@/lib/export/CurriculumPDF'
import { Metadata } from '@/interfaces/db.interface'
import { usePDFDownload } from '@/lib/utils'
import { pdfToBase64 } from '@/lib/utils'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'

/*--------------------------------------------------schedule table--------------------------------------------------*/
/** Hook principal que orquesta los sub-hooks de cronogramas para la tabla */
export const useScheduleTable = () => {
  const [onDownload, setOnDownload] = useState<Schedule | undefined>(undefined)
  const [onDelete, setOnDelete] = useState<Schedule | undefined>(undefined)
  const { deleteFormat: deleteSch } = useFormatMutation('schedule')
  const { deleteFile } = useFormatMutation('file')
  const queryFormat = useQueryFormat()
  const isProcessing = useRef(false)

  const { data: schedules = [] } = queryFormat.fetchAllFormats<Schedule>('schedule')

  /**
   * Función que se ejecuta cuando se descarga un cronograma
   * @param {Schedule} schedule - Cronograma a descargar
   */
  const downloadSchedule = useCallback((schedule: Schedule) => {
    if (isProcessing.current) return
    isProcessing.current = true
    window.open(schedule.url, '_blank')
    isProcessing.current = false
    setOnDownload(undefined)
  }, [])

  /**
   * Función que se ejecuta cuando se elimina un cronograma
   * Seguidamente se eliminan los archivos asociados (storage)
   * @param {Schedule} schedule - Cronograma a eliminar
   */
  const deleteSchedule = useCallback(async (schedule: Schedule) => {
    if (isProcessing.current) return
    isProcessing.current = true
    const path = `client/${schedule.client?._id}/schedule/${schedule.name}`
    await deleteFile({ path }).then(() => deleteSch({ id: schedule._id }))
      .finally(() => { setOnDelete(undefined); isProcessing.current = false })
  }, [deleteFile, deleteSch])

  /** just one useEffect */
  useEffect(() => {
    onDelete && deleteSchedule(onDelete)
    onDownload && downloadSchedule(onDownload)
  }, [deleteSchedule, downloadSchedule, onDelete, onDownload])

  return {
    schedules: schedules,
    handleDelete: (schedule: Schedule) => setOnDelete(schedule),
    handleDownload: (schedule: Schedule) => setOnDownload(schedule)
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------solicit table--------------------------------------------------*/
/** Hook principal que orquesta los sub-hooks de solicitudes para la tabla */
export const useSolicitTable = () => {
  const [onDelete, setOnDelete] = useState<Solicit | undefined>(undefined)
  const { deleteFormat } = useFormatMutation('solicit')
  const { deleteFile } = useFormatMutation('file')
  const queryFormat = useQueryFormat()
  const isProcessing = useRef(false)

  const { data: solicits = [] } = queryFormat.fetchAllFormats<Solicit>('solicit')

  /**
   * Función que se ejecuta cuando se elimina una solicitud
   * Seguidamente se eliminan los archivos asociados (storage)
   * @param {Solicit} solicit - Solicitud a eliminar
   */
  const deleteSolicit = useCallback(async (solicit: Solicit) => {
    if (isProcessing.current) return
    isProcessing.current = true
    await deleteFormat({ id: solicit._id }).then(async () => {
      if (!solicit.photoUrl) return //if there is no photo, skip
      const fileName = extractMetadataUrl([solicit.photoUrl])
      const curriculumId = solicit.curriculum?._id //reference
      const path = `files/${curriculumId}/solicit/${fileName?.[0]}`
      await deleteFile({ path }) //delete photo from storage (file)
    }).finally(() => { setOnDelete(undefined); isProcessing.current = false })
  }, [deleteFormat, deleteFile])

  /** just one useEffect */
  useEffect(() => { onDelete && deleteSolicit(onDelete) }, [deleteSolicit, onDelete])

  return {
    solicits: useMemo(() => solicits, [solicits]),
    handleDelete: (solicit: Solicit) => setOnDelete(solicit)
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------maintenance table--------------------------------------------------*/
/** Hook principal que orquesta los sub-hooks de mantenimiento para la tabla */
export const useMaintenanceTable = () => {
  const [onDownloadZip, setOnDownloadZip] = useState<Maintenance[] | undefined>(undefined)
  const [onDownload, setOnDownload] = useState<Maintenance | undefined>(undefined)
  const [onDelete, setOnDelete] = useState<Maintenance | undefined>(undefined)
  const { deleteFormat: deleteMT } = useFormatMutation("maintenance")
  const { downloadPDF, downloadZIP } = usePDFDownload()
  const { deleteFile } = useFormatMutation("file")
  const isProcessing = useRef(false)

  const { data: mts = [] } = useQueryFormat().fetchAllFormats<Maintenance>('maintenance')

  /**
   * Función que se ejecuta cuando se descarga mantenimientos multiple
   * @param {Maintenance[]} mts - Mantenimientos a descargar
   */
  const downloadFileZip = useCallback(async (mts: Maintenance[]) => {
    if (isProcessing.current) return
    isProcessing.current = true
    //Grouping by equipment
    const groupedByEquipment = mts.reduce((acc, mt) => {
      const curriculumId = mt.curriculum?._id
      if (!curriculumId) return acc
      if (!acc.has(curriculumId)) acc.set(curriculumId, [])
      acc.get(curriculumId)?.push(mt)
      return acc
    }, new Map<string, Maintenance[]>())
    //Prepare components for the ZIP
    const pdfComponents = Array.from(groupedByEquipment.entries()).flatMap(([_, equipmentMts]) =>
      equipmentMts.map(mt => ({
        props: { mt }, component: MaintenancePDF,
        fileName: `${mt.curriculum?.name} - ${mt.curriculum?.modelEquip}/${mt.typeMaintenance}-${new Date(mt.dateMaintenance).toISOString().split('T')[0]}.pdf`
      }))
    ) //Generate zip name based on date and number of equipments
    const zipName = `mantenimientos-${new Date().toISOString().split('T')[0]}-${groupedByEquipment.size}equipos.zip`
    await downloadZIP({ zipName, components: pdfComponents }).finally(() => { setOnDownloadZip(undefined); isProcessing.current = false })
  }, [downloadZIP])

  /**
   * Función que se ejecuta cuando se descarga un mantenimiento
   * @param {Maintenance} mt - Mantenimiento a descargar
   */
  const downloadFile = useCallback(async (mt: Maintenance) => {
    if (isProcessing.current) return
    isProcessing.current = true
    const fileName = `mantenimiento-${mt.curriculum?.name}-${mt.curriculum?.modelEquip} (${formatDateTime(mt.dateMaintenance)}).pdf`
    await downloadPDF({ fileName, component: MaintenancePDF, props: { mt } })
      .finally(() => { setOnDownload(undefined); isProcessing.current = false })
  }, [downloadPDF])

  /**
   * Función que se ejecuta cuando se elimina un mantenimiento
   * Seguidamente se eliminan los archivos asociados (storage)
   * @param {Maintenance} mt - Mantenimiento a eliminar
   */
  const deleteMaintenance = useCallback(async (mt: Maintenance) => {
    if (isProcessing.current) return
    isProcessing.current = true
    await deleteMT({ id: mt._id }).then(async () => {
      const urls = mt.metadata?.files || []
      const files = extractMetadataUrl(urls)
      if (!files || files.length === 0) return
      await Promise.all(files.map(name => deleteFile({ path: `files/${mt.curriculum?._id}/maintenances/${name}` })))
    }).finally(() => { setOnDelete(undefined); isProcessing.current = false })
  }, [deleteMT, deleteFile, extractMetadataUrl])

  /** just one useEffect */
  useEffect(() => {
    onDelete && deleteMaintenance(onDelete)
    onDownload && downloadFile(onDownload)
    onDownloadZip && downloadFileZip(onDownloadZip)
  }, [downloadFile, deleteMaintenance, downloadFileZip, onDelete, onDownload, onDownloadZip])

  return {
    maintenances: useMemo(() => mts, [mts]),
    handleDelete: (mt: Maintenance) => setOnDelete(mt),
    handleDownload: (mt: Maintenance) => setOnDownload(mt),
    handleDownloadZip: (mts: Maintenance[]) => setOnDownloadZip(mts),
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------curriculum table--------------------------------------------------*/
interface CurriculumChildren extends Curriculum { childRows: (Maintenance & { isPreventive: boolean })[]; hasMaintenances: boolean }
interface GroupedMaintenance extends Record<string, { allMaintenances: Maintenance[], curriculum: Curriculum }> { }
interface ResourceMap {
  curriculumAccs: Accessory[]
  clientImages: Metadata[]
}

/** Hook principal que orquesta los sub-hooks de curriculum para la tabla */
export const useCurriculumTable = () => {
  const [onDownloadZipMts, setOnDownloadZipMts] = useState<CurriculumChildren[] | undefined>(undefined)
  const [onDownloadZip, setOnDownloadZip] = useState<CurriculumChildren[] | undefined>(undefined)
  const [onDownload, setOnDownload] = useState<CurriculumChildren | undefined>(undefined)
  const [onDelete, setOnDelete] = useState<CurriculumChildren | undefined>(undefined)
  const { downloadPDF, downloadZIP, downloadFilesAsZIP } = usePDFDownload()
  const { deleteFormat: deleteMt } = useFormatMutation("maintenance")
  const { deleteFormat: deleteAcc } = useFormatMutation("accessory")
  const { deleteFormat: deleteCv } = useFormatMutation("cv")
  const { deleteFolder } = useFormatMutation("file")
  const isProcessing = useRef(false)
  const queryFormat = useQueryFormat()

  const { data: mts = [] } = queryFormat.fetchAllFormats<Maintenance>('maintenance')
  const { data: cvs = [] } = queryFormat.fetchAllFormats<Curriculum>('cv')

  const { data: accs } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: onDelete?._id || onDownload?._id, enabled: !!onDelete || !!onDownload })
  const zipFiles = queryFormat.fetchQueriesCV((onDownloadZip || onDownloadZipMts || [])) //fetch all queries for zip
  const isLoading = zipFiles.some(q => q.isLoading || q.isFetching)

  /** Verify all queries state on zipFiles (either successfully or with an error) */
  const zipFinished = useMemo(() => {
    if ((!onDownloadZip?.length && !onDownloadZipMts?.length) || !zipFiles.length) return false
    return !zipFiles.some(q => q.isLoading || q.isFetching)
  }, [onDownloadZip, onDownloadZipMts, zipFiles])

  /** Helps us group the results by curriculum */
  const zipMap = useMemo(() => {
    if (!onDownloadZip?.length && !onDownloadZipMts?.length) return new Map<string, ResourceMap>()
    const isLoading = zipFiles.some(q => q.isLoading || q.isFetching)
    const resourceMap = new Map<string, ResourceMap>()
    if (isLoading) return resourceMap
    const curriculums = onDownloadZip || onDownloadZipMts || [] //Use the available elements
    curriculums.forEach((cv: Curriculum) => { //Mapping all curriculums with their resources
      const curriculumAccs = zipFiles.find(q => q.data?.type === 'accessory' && q.data?.id === cv._id)?.data?.data as Accessory[] || []
      resourceMap.set(cv._id, { curriculumAccs } as ResourceMap)
    })
    return resourceMap
  }, [onDownloadZip, onDownloadZipMts, zipFiles])

  /**
   * Funcion que formatea y combina los datos de currículums y mantenimientos para la tabla; esto nos permite:
   * 1. Mostrar todos los currículums incluso si no tienen mantenimientos
   * 2. Agrupar los mantenimientos por equipo y ordenarlos por fecha
   * @param curriculums - Array de registros de currículum
   * @param maintenances - Array de registros de mantenimiento
   * @returns Array de currículums formateados con sus mantenimientos asociados
   */
  const formatTableData = useCallback((curriculums: Curriculum[], maintenances: Maintenance[]): CurriculumChildren[] => {
    //1. Normalize maintenance data
    const normalizedMts: Maintenance[] = maintenances.map(mt => ({
      ...mt,
      dateMaintenance: new Date(mt.dateMaintenance),
      isPreventive: mt.typeMaintenance === 'preventivo',
      dateNextMaintenance: mt.dateNextMaintenance ? new Date(mt.dateNextMaintenance) : undefined
    }))
    //2. Group maintenances by curriculum ID
    const maintenanceGroups = normalizedMts.reduce((acc, mt) => {
      const equipmentId = mt.curriculum?._id //curriculum id
      const hasSignature = mt.signature?._id //signature (posible un-signed maintenance)
      if (!equipmentId || !hasSignature) return acc //if the maintenance has a signature, skip it
      if (!acc[equipmentId]) acc[equipmentId] = { allMaintenances: [], curriculum: mt.curriculum }
      acc[equipmentId].allMaintenances.push(mt)
      return acc
    }, {} as GroupedMaintenance)
    //3. Transform all curriculums, including those without maintenances
    const formattedData = curriculums.map(cv => {
      const maintenanceGroup = maintenanceGroups[cv._id]
      const sortedMaintenances = maintenanceGroup?.allMaintenances
        .sort((a, b) => b.dateMaintenance.getTime() - a.dateMaintenance.getTime())
        .map(mt => ({ ...mt, isPreventive: mt.typeMaintenance === 'preventivo' })) || []
      return { ...cv, hasMaintenances: sortedMaintenances.length > 0, childRows: sortedMaintenances }
    })
    //4. Sort curriculums: first those with maintenances (by latest date), then those without
    return formattedData.sort((a, b) => {
      if (a.hasMaintenances && !b.hasMaintenances) return -1
      if (!a.hasMaintenances && b.hasMaintenances) return 1
      if (!a.hasMaintenances && !b.hasMaintenances) return 0
      const latestA = a.childRows[0]?.dateMaintenance.getTime() || 0
      const latestB = b.childRows[0]?.dateMaintenance.getTime() || 0
      return latestB - latestA
    })
  }, [])

  /**
   * Función que se ejecuta cuando se descarga currículos multiple
   * @param {CurriculumChildren[]} cvs - Currículos a descargar
   */
  const downloadFileZip = useCallback(async (cvs: CurriculumChildren[]) => {
    if (!zipFinished) return //await for this dependencies
    if (isProcessing.current) return
    isProcessing.current = true
    const pdfComponents = cvs.map(cv => { //Prepare each cv from map
      const resources = zipMap.get(cv._id) || { curriculumAccs: [] }
      const client = cv?.office?.headquarter?.client //client context
      const accs = resources.curriculumAccs || [] //accessories curriculum
      const mts = cv.childRows.filter(mt => mt.signedAt) //maintenances signed associated
      const fileName = `${cv?.name}-${cv?.modelEquip}-${new Date().toISOString().split('T')[0]}.pdf`
      return { fileName, component: CurriculumPDF, props: { cv, client, accs, mts } }
    })
    //Generate zip name based on date and number of equipments
    const zipName = `hojas-de-vida-${new Date().toISOString().split('T')[0]}-${cvs.length}equipos.zip`
    await downloadZIP({ zipName, components: pdfComponents }).finally(() => { isProcessing.current = false; setOnDownloadZip(undefined) })
  }, [downloadZIP, zipMap, zipFiles, zipFinished])

  /**
   * Función que se ejecuta cuando se descarga currículos multiple con sus mantenimientos
   * @param {CurriculumChildren[]} cvs - Currículos a descargar con sus mantenimientos
   */
  const downloadFileZipMts = useCallback(async (cvs: CurriculumChildren[]) => {
    if (!zipFinished) return //await for this dependencies
    if (isProcessing.current) return
    isProcessing.current = true
    const curriculumPromises = cvs.map(async (cv) => {
      const resources = zipMap.get(cv._id) || { curriculumAccs: [] }
      const client = cv?.office?.headquarter?.client //client context
      const accs = resources.curriculumAccs || [] //accessories curriculum
      const mts = cv.childRows.filter(mt => mt.signedAt) //maintenances signed
      const pdf = await pdfToBase64(CurriculumPDF, { cv, client, accs, mts })
      return { pdf, fileName: `${cv.name} - ${cv.modelEquip}/Hoja de vida.pdf` }
    }) //Prepare promises for generating maintenance PDFs
    const maintenancePromises = cvs.flatMap((cv) =>
      cv.hasMaintenances && cv.childRows?.length > 0
        ? cv.childRows.map(async (mt) => {
          const pdf = await pdfToBase64(MaintenancePDF, { mt })
          return { pdf, fileName: `${cv.name} - ${cv.modelEquip}/Mantenimientos/${mt.typeMaintenance}-${mt.dateMaintenance.toISOString().split('T')[0]}.pdf` }
        }) : []
    )
    //Execute all promises in parallel and generate the zip
    const zipName = `equipos-completos-${new Date().toISOString().split('T')[0]}-${cvs.length}equipos.zip`
    const [curriculumPDFs, maintenancePDFs] = await Promise.all([Promise.all(curriculumPromises), Promise.all(maintenancePromises)])
    const pdfFiles = [...curriculumPDFs, ...maintenancePDFs] //merge all pdfs and prepare data collection for the zip (cvs and mts)
    await downloadFilesAsZIP({ pdfFiles, zipName }).finally(() => { isProcessing.current = false; setOnDownloadZipMts(undefined) })
  }, [downloadFilesAsZIP, zipMap, zipFiles, zipFinished])

  /**
   * Función que se ejecuta cuando se descarga un currículo
   * @param {CurriculumChildren} cv - Currículo a descargar
   */
  const downloadFile = useCallback(async (cv: CurriculumChildren) => {
    if (!accs) return //await for this dependencies
    if (isProcessing.current) return
    isProcessing.current = true
    const mts = cv.childRows.filter(mt => mt.signedAt)
    const client = cv?.office?.headquarter?.client
    await downloadPDF({ //Download curriculum PDF      
      fileName: `hoja-de-vida-${cv.name}-${cv.modelEquip}.pdf`,
      component: CurriculumPDF, props: { cv, client, accs, mts }
    }).finally(() => { setOnDownload(undefined); isProcessing.current = false })
  }, [downloadPDF, accs])

  /**
   * Función que se ejecuta cuando se elimina un currículo
   * Seguidamente se eliminan los mantenimientos asociados
   * @param {CurriculumChildren} cv - Currículo a eliminar
   */
  const deleteCurriculum = useCallback(async (cv: CurriculumChildren) => {
    if (!accs || !mts) return //await for this dependencies
    if (isProcessing.current) return
    isProcessing.current = true
    const deleteOperations = []
    await deleteCv({ id: cv._id })
    const curriculumAccs = accs?.filter(acc => acc.curriculum?._id === cv._id) || [] //associated accessories
    const curriculumMts = mts?.filter(mt => mt.curriculum?._id === cv._id) || [] //associated maintenances
    curriculumAccs.length > 0 && deleteOperations.push(Promise.all(curriculumAccs.map(acc => deleteAcc({ id: acc._id }))))
    curriculumMts.length > 0 && deleteOperations.push(Promise.all(curriculumMts.map(mt => deleteMt({ id: mt._id }))))
    cv.photoUrl && deleteOperations.push(deleteFolder({ path: `files/${cv._id}` })) //with associated sub-folders
    await Promise.all(deleteOperations).finally(() => { isProcessing.current = false; setOnDelete(undefined) })
  }, [deleteCv, deleteMt, deleteAcc, deleteFolder, accs, mts])

  /** just one useEffect */
  useEffect(() => {
    onDelete && deleteCurriculum(onDelete)
    onDownload && downloadFile(onDownload)
    onDownloadZip && downloadFileZip(onDownloadZip)
    onDownloadZipMts && downloadFileZipMts(onDownloadZipMts)
  }, [
    deleteCurriculum, downloadFile, downloadFileZip, downloadFileZipMts,
    onDelete, onDownload, onDownloadZip, onDownloadZipMts,
    isLoading, accs, mts
  ])

  return {
    handleDelete: (cv: CurriculumChildren) => setOnDelete(cv),
    handleDownload: (cv: CurriculumChildren) => setOnDownload(cv),
    handleDownloadZip: (cvs: CurriculumChildren[]) => setOnDownloadZip(cvs),
    handleDownloadZipMts: (cvs: CurriculumChildren[]) => setOnDownloadZipMts(cvs),
    curriculums: useMemo(() => formatTableData(cvs, mts), [cvs, mts, formatTableData])
  }
}
/*---------------------------------------------------------------------------------------------------------*/