import { Accessory, Curriculum, Maintenance, Solicit, User } from '@/interfaces/context.interface'
import { useFormatMutation, useQueryFormat } from '@/hooks/query/useFormatQuery'
import { useQueryUser } from '@/hooks/query/useAuthQuery'
import MaintenancePDF from '@/lib/export/MaintenancePDF'
import CurriculumPDF from '@/lib/export/CurriculumPDF'
import { Metadata } from '@/interfaces/db.interface'
import { formatDateTime } from '@/utils/format'
import { usePDFDownload } from '@/lib/utils'
import { pdfToBase64 } from '@/lib/utils'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'

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
  const [onDownloadZip, setOnDownloadZip] = useState<Curriculum[] | undefined>(undefined)
  const [onDownload, setOnDownload] = useState<Curriculum | undefined>(undefined)
  const [onDelete, setOnDelete] = useState<Curriculum | undefined>(undefined)
  const { downloadPDF, downloadZIP, downloadFilesAsZIP } = usePDFDownload()
  const { deleteFormat: deleteMt } = useFormatMutation("maintenance")
  const { deleteFormat: deleteAcc } = useFormatMutation("accessory")
  const { deleteFormat: deleteCv } = useFormatMutation("cv")
  const { deleteFile } = useFormatMutation("file")
  const isProcessing = useRef(false)
  const queryFormat = useQueryFormat()
  const queryUser = useQueryUser()

  const { data: companies } = queryUser.fetchUserByQuery<User>({ role: 'company' })
  const { data: mts = [] } = queryFormat.fetchAllFormats<Maintenance>('maintenance')
  const { data: cvs = [] } = queryFormat.fetchAllFormats<Curriculum>('cv')
  const client = onDownload?.office?.headquarter?.user //this user is client
  const company = companies?.[0]

  const { data: imgCli, isLoading: isLoadingCli } = queryFormat.fetchAllFiles<Metadata>({ path: `client/${client?._id}/preview`, enabled: !!client })
  const { data: imgCom, isLoading: isLoadingCom } = queryFormat.fetchAllFiles<Metadata>({ path: `company/${company?._id}/preview`, enabled: !!company })
  const { data: accs } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: onDelete?._id || onDownload?._id, enabled: !!onDelete || !!onDownload })
  const zipFiles = queryFormat.fetchAllQueries((onDownloadZip || onDownloadZipMts || [])) //fetch all queries for zip
  const isLoading = zipFiles.some(q => q.isLoading || q.isFetching) || isLoadingCom || isLoadingCli
  const imgCompany = imgCom?.[0]?.url
  const imgClient = imgCli?.[0]?.url

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
      const clientImages = zipFiles.find(q => q.data?.type === 'client' && q.data?.id === cv.office?.headquarter?.user?._id)?.data?.data as Metadata[] || []
      const curriculumAccs = zipFiles.find(q => q.data?.type === 'accessory' && q.data?.id === cv._id)?.data?.data as Accessory[] || []
      resourceMap.set(cv._id, { clientImages, curriculumAccs } as ResourceMap)
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
      const equipmentId = mt.curriculum?._id
      if (!equipmentId) return acc
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
   * @param {Curriculum[]} cvs - Currículos a descargar
   */
  const downloadFileZip = useCallback(async (cvs: Curriculum[]) => {
    if (!zipFinished) return
    if (isProcessing.current) return
    isProcessing.current = true
    const pdfComponents = cvs.map(cv => { //Prepare each cv with its resources from map
      const resources = zipMap.get(cv._id) || { clientImages: [], curriculumAccs: [] }
      const curriculumAccs = resources.curriculumAccs || []
      const clientImage = resources.clientImages?.[0]?.url
      return {
        fileName: `${cv?.name}-${cv?.modelEquip}-${new Date().toISOString().split('T')[0]}.pdf`,
        component: CurriculumPDF, props: {
          cv, com: company!, accs: curriculumAccs,
          cliLogo: clientImage,
          comLogo: imgCompany,
        }
      }
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
    if (!zipFinished) return
    if (isProcessing.current) return
    isProcessing.current = true
    const curriculumPromises = cvs.map(async (cv) => { //Prepare promises for generating curriculum PDFs
      const resources = zipMap.get(cv._id) || { clientImages: [], curriculumAccs: [] }
      const curriculumAccs = resources.curriculumAccs || []
      const clientImage = resources.clientImages?.[0]?.url
      const pdf = await pdfToBase64(CurriculumPDF, {
        cv, com: company!, accs: curriculumAccs,
        cliLogo: clientImage,
        comLogo: imgCompany,
      })
      return { pdf, fileName: `${cv.name} - ${cv.modelEquip}/Hoja de vida.pdf` }
    }) //Prepare promises for generating maintenance PDFs
    const maintenancePromises = cvs.flatMap((cv) =>
      cv.hasMaintenances && cv.childRows?.length > 0
        ? cv.childRows.map(async (mt) => {
          const pdf = await pdfToBase64(MaintenancePDF, { mt, com: company!, imgs: imgCom })
          return { pdf, fileName: `${cv.name} - ${cv.modelEquip}/Mantenimientos/${mt.typeMaintenance}-${mt.dateMaintenance.toISOString().split('T')[0]}.pdf` }
        }) : []
    )
    //Execute all promises in parallel and generate the zip
    const [curriculumPDFs, maintenancePDFs] = await Promise.all([Promise.all(curriculumPromises), Promise.all(maintenancePromises)])
    const pdfFiles = [...curriculumPDFs, ...maintenancePDFs]
    const zipName = `equipos-completos-${new Date().toISOString().split('T')[0]}-${cvs.length}equipos.zip`
    await downloadFilesAsZIP({ pdfFiles, zipName }).finally(() => { isProcessing.current = false; setOnDownloadZipMts(undefined) })
  }, [downloadFilesAsZIP, zipMap, zipFiles, zipFinished])

  /**
   * Función que se ejecuta cuando se descarga un currículo
   * @param {Curriculum} cv - Currículo a descargar
   */
  const downloadFile = useCallback(async (cv: Curriculum) => {
    if (!imgClient || !imgCompany || !accs) return
    if (isProcessing.current) return
    isProcessing.current = true
    const fileName = `hoja-de-vida-${cv.name}-${cv.modelEquip}.pdf`
    await downloadPDF({
      fileName, component: CurriculumPDF, props: {
        cv, accs, com: company!,
        comLogo: imgCompany,
        cliLogo: imgClient,
      }
    }).finally(() => { setOnDownload(undefined); isProcessing.current = false })
  }, [downloadPDF, company, accs])

  /**
   * Función que se ejecuta cuando se elimina un currículo
   * @param {Curriculum} cv - Currículo a eliminar
   */
  const deleteCurriculum = useCallback(async (cv: Curriculum) => {
    if (!accs || !mts) return
    if (isProcessing.current) return
    isProcessing.current = true
    const deleteOperations = []
    await deleteCv({ id: cv._id })
    const curriculumAccs = accs?.filter(acc => acc.curriculum?._id === cv._id) || [] //associated accessories
    const curriculumMts = mts?.filter(mt => mt.curriculum?._id === cv._id) || [] //associated maintenances
    curriculumAccs.length > 0 && deleteOperations.push(Promise.all(curriculumAccs.map(acc => deleteAcc({ id: acc._id }))))
    curriculumMts.length > 0 && deleteOperations.push(Promise.all(curriculumMts.map(mt => deleteMt({ id: mt._id }))))
    cv.photoUrl && deleteOperations.push(Promise.resolve(await deleteFile({ path: `files/${cv._id}/preview/img` })))
    await Promise.all(deleteOperations).finally(() => { isProcessing.current = false; setOnDelete(undefined) })
  }, [deleteCv, deleteMt, deleteAcc, deleteFile, accs, mts])

  /** just one useEffect */
  useEffect(() => {
    onDelete && deleteCurriculum(onDelete)
    onDownload && downloadFile(onDownload)
    onDownloadZip && downloadFileZip(onDownloadZip)
    onDownloadZipMts && downloadFileZipMts(onDownloadZipMts)
  }, [
    deleteCurriculum, downloadFile, downloadFileZip, downloadFileZipMts,
    onDelete, onDownload, onDownloadZip, onDownloadZipMts,
    imgCli, imgCom, isLoading, companies, accs, mts
  ])

  return {
    handleDelete: (cv: Curriculum) => setOnDelete(cv),
    handleDownload: (cv: Curriculum) => setOnDownload(cv),
    handleDownloadZip: (cvs: Curriculum[]) => setOnDownloadZip(cvs),
    handleDownloadZipMts: (cvs: CurriculumChildren[]) => setOnDownloadZipMts(cvs),
    curriculums: useMemo(() => formatTableData(cvs, mts), [cvs, mts, formatTableData])
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------maintenance table--------------------------------------------------*/
/** Hook principal que orquesta los sub-hooks de mantenimiento para la tabla */
export const useMaintenanceTable = () => {
  const [onDownloadZip, setOnDownloadZip] = useState<Maintenance[] | undefined>(undefined)
  const [onDownload, setOnDownload] = useState<Maintenance | undefined>(undefined)
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined)
  const { deleteFormat: deleteMT } = useFormatMutation("maintenance")
  const { fetchAllFormats, fetchAllFiles } = useQueryFormat()
  const { downloadPDF, downloadZIP } = usePDFDownload()
  const isProcessing = useRef(false)

  const { data: companies } = useQueryUser().fetchUserByQuery<User>({ role: 'company' })
  const { data: mts = [] } = fetchAllFormats<Maintenance>('maintenance')
  const com = companies?.[0]
  /** Get company images */
  const { data: imgs } = fetchAllFiles<Metadata>({
    path: `company/${com?._id}/preview`,
    enabled: !!com
  })

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
        props: { mt, com, imgs },
        component: MaintenancePDF,
        fileName: `${mt.curriculum?.name} - ${mt.curriculum?.modelEquip}/${mt.typeMaintenance}-${new Date(mt.dateMaintenance).toISOString().split('T')[0]}.pdf`
      }))
    ) //Generate zip name based on date and number of equipments
    const zipName = `mantenimientos-${new Date().toISOString().split('T')[0]}-${groupedByEquipment.size}equipos.zip`
    await downloadZIP({ zipName, components: pdfComponents }).finally(() => { setOnDownloadZip(undefined); isProcessing.current = false })
  }, [downloadZIP, imgs, com])

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
  }, [downloadPDF, imgs, com])

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
  }, [downloadFile, deleteMaintenance, downloadFileZip, onDelete, onDownload, onDownloadZip])

  return {
    maintenances: useMemo(() => mts, [mts]),
    handleDelete: (id: string) => setOnDelete(id),
    handleDownload: (mt: Maintenance) => setOnDownload(mt),
    handleDownloadZip: (mts: Maintenance[]) => setOnDownloadZip(mts),
  }
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------solicit table--------------------------------------------------*/
/** Hook principal que orquesta los sub-hooks de solicitudes para la tabla */
export const useSolicitTable = () => {
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined)
  const { deleteFormat } = useFormatMutation("solicit")
  const queryFormat = useQueryFormat()
  const isProcessing = useRef(false)

  const { data: solicits = [] } = queryFormat.fetchAllFormats<Solicit>('solicit')

  /**
   * Función que se ejecuta cuando se elimina una solicitud
   * @param {string} id - ID de la solicitud a eliminar
   */
  const deleteSolicit = useCallback(async (id: string) => {
    if (isProcessing.current) return
    isProcessing.current = true
    await deleteFormat({ id }).finally(() => { setOnDelete(undefined); isProcessing.current = false })
  }, [deleteFormat])

  /** just one useEffect */
  useEffect(() => { onDelete && deleteSolicit(onDelete) }, [onDelete, deleteSolicit])

  return {
    handleDelete: (id: string) => setOnDelete(id),
    solicits: useMemo(() => solicits, [solicits])
  }
}
/*---------------------------------------------------------------------------------------------------------*/