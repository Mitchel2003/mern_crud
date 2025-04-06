import { Accessory, User, Curriculum, Maintenance } from '@/interfaces/context.interface'
import { useFormatMutation, useQueryFormat } from '@/hooks/query/useFormatQuery'
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
import { useEffect, useState, useCallback, useRef, useMemo } from 'react'

import MaintenancePDF from '@/lib/export/MaintenancePDF'
import { useAuthContext } from '@/context/AuthContext'
import CurriculumPDF from '@/lib/export/CurriculumPDF'
import { formatDateTime } from '@/utils/format'
import { usePDFDownload } from '@/lib/utils'
import { pdfToBase64 } from '@/lib/utils'
import { useForm } from 'react-hook-form'

/*==================================================useForm==================================================*/
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

  const { data: img = [], isLoading: isLoadingImg } = queryFormat.fetchAllFiles<Metadata>({ path: `files/${id}/preview`, enabled: !!id })
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
    onSubmit: async (e: CurriculumFormProps) => {
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
          const file = data.photoUrl
          const path = `files/${id}/preview/img`
          file && await deleteFile({ path }).then(async () => await createFile({ files: [file], path, unique: true }))
        })
      ) : (
        createCV(data).then(async (e) => {
          await Promise.all(data.newAccessories?.map(async (acc) => await createAcc({ ...acc, curriculum: e._id })))
          data.photoUrl && await createFile({ files: [data.photoUrl], path: `files/${e._id}/preview/img`, unique: true })
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
 * @param id - ID del currículum a actualizar, si no se proporciona, la request corresponde a crear
 * @param onSuccess - Función a ejecutar cuando el formulario se envía correctamente
 */
export const useSolicitForm = (id?: string, onSuccess?: () => void) => {
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
      id && cv ? (
        createFormat(data).then(async () => {
          const file = e.photoUrl?.[0]?.file
          const path = `files/${id}/solicit/${formatDateTime(new Date(Date.now()), '-')}`
          file && await createFile({ files: [file], path, unique: true })
        }).finally(async () => {
          const client = cv?.office?.headquarter?.user
          const title = `Nueva solicitud de ${client?.username}`
          const body = `(${data.priority ? 'URGENTE' : 'PENDIENTE'}) ${data.message}`
          await sendNotification({ id: company?._id, title, body }) //send to company
        })
      ) : (notifyError({ message: "No tienes acceso a este currículum" }))
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
/*=========================================================================================================*/

/*==================================================useTable==================================================*/
/*--------------------------------------------------curriculum table--------------------------------------------------*/
interface CurriculumChildren extends Curriculum { childRows: (Maintenance & { isPreventive: boolean })[]; hasMaintenances: boolean }
interface GroupedMaintenance extends Record<string, { allMaintenances: Maintenance[], curriculum: Curriculum }> { }
interface ResourceMap {
  curriculumImages: Metadata[]
  curriculumAccs: Accessory[]
  clientImages: Metadata[]
}

/** Hook principal que orquesta los sub-hooks de curriculum para la tabla */
export const useCurriculumTable = () => {
  const [onDownloadZipMts, setOnDownloadZipMts] = useState<CurriculumChildren[] | undefined>(undefined)
  const [onDownloadZip, setOnDownloadZip] = useState<Curriculum[] | undefined>(undefined)
  const [onDownload, setOnDownload] = useState<Curriculum | undefined>(undefined)
  const [onDelete, setOnDelete] = useState<string | undefined>(undefined)
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
  const client = onDownload?.office?.headquarter?.user //this user could be role client
  const company = companies?.[0]

  const { data: imgCli, isLoading: isLoadingCli } = queryFormat.fetchAllFiles<Metadata>({ path: `client/${client?._id}/preview`, enabled: !!client })
  const { data: imgCom, isLoading: isLoadingCom } = queryFormat.fetchAllFiles<Metadata>({ path: `company/${company?._id}/preview`, enabled: !!company })
  const { data: imgCv, isLoading: isLoadingCv } = queryFormat.fetchAllFiles<Metadata>({ path: `files/${onDelete || onDownload?._id}/preview`, enabled: !!onDelete || !!onDownload })
  const { data: accs } = queryFormat.fetchFormatByQuery<Accessory>('accessory', { curriculum: onDelete || onDownload?._id, enabled: !!onDelete || !!onDownload })
  const zipFiles = queryFormat.fetchAllQueries((onDownloadZip || onDownloadZipMts || []))

  const isLoading = zipFiles.some(q => q.isLoading || q.isFetching) || isLoadingCom || isLoadingCli || isLoadingCv
  const imgCurriculum = imgCv?.[0]?.url
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
    const curriculums = onDownloadZip || onDownloadZipMts || [] // Use the available elements
    curriculums.forEach((cv: Curriculum) => {// Mapping all curriculums with their resources
      const clientImages = zipFiles.find(q => q.data?.type === 'client' && q.data?.id === cv.office?.headquarter?.user?._id)?.data?.data as Metadata[] || []
      const curriculumImages = zipFiles.find(q => q.data?.type === 'curriculum' && q.data?.id === cv._id)?.data?.data as Metadata[] || []
      const curriculumAccs = zipFiles.find(q => q.data?.type === 'accessory' && q.data?.id === cv._id)?.data?.data as Accessory[] || []
      resourceMap.set(cv._id, { curriculumImages, clientImages, curriculumAccs } as ResourceMap)
    })
    return resourceMap
  }, [onDownloadZip, onDownloadZipMts, zipFiles])

  /**
   * Function that formats and combines curriculum and maintenance data for the table; this allow us:
   * 1. Show all curriculums even if they don't have maintenances
   * 2. Group maintenances by equipment and sort them by date
   * @param curriculums - Array of curriculum records
   * @param maintenances - Array of maintenance records
   * @returns Array of formatted curriculum records with their associated maintenances
   */
  const formatTableData = useCallback((curriculums: Curriculum[], maintenances: Maintenance[]): CurriculumChildren[] => {
    // 1. Normalize maintenance data
    const normalizedMts: Maintenance[] = maintenances.map(mt => ({
      ...mt,
      dateMaintenance: new Date(mt.dateMaintenance),
      isPreventive: mt.typeMaintenance === 'preventivo',
      dateNextMaintenance: mt.dateNextMaintenance ? new Date(mt.dateNextMaintenance) : undefined
    }))
    // 2. Group maintenances by curriculum ID
    const maintenanceGroups = normalizedMts.reduce((acc, mt) => {
      const equipmentId = mt.curriculum?._id
      if (!equipmentId) return acc
      if (!acc[equipmentId]) acc[equipmentId] = { allMaintenances: [], curriculum: mt.curriculum }
      acc[equipmentId].allMaintenances.push(mt)
      return acc
    }, {} as GroupedMaintenance)
    // 3. Transform all curriculums, including those without maintenances
    const formattedData = curriculums.map(cv => {
      const maintenanceGroup = maintenanceGroups[cv._id]
      const sortedMaintenances = maintenanceGroup?.allMaintenances
        .sort((a, b) => b.dateMaintenance.getTime() - a.dateMaintenance.getTime())
        .map(mt => ({ ...mt, isPreventive: mt.typeMaintenance === 'preventivo' })) || []
      return { ...cv, hasMaintenances: sortedMaintenances.length > 0, childRows: sortedMaintenances }
    })
    // 4. Sort curriculums: first those with maintenances (by latest date), then those without
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
    const pdfComponents = cvs.map(cv => {// Prepare each cv with its resources from map
      const resources = zipMap.get(cv._id) || { curriculumImages: [], clientImages: [], curriculumAccs: [] }
      const curriculumImage = resources.curriculumImages?.[0]?.url
      const curriculumAccs = resources.curriculumAccs || []
      const clientImage = resources.clientImages?.[0]?.url
      return {
        fileName: `${cv?.name}-${cv?.modelEquip}-${new Date().toISOString().split('T')[0]}.pdf`,
        component: CurriculumPDF, props: {
          cv, com: company!, accs: curriculumAccs,
          cvLogo: curriculumImage,
          cliLogo: clientImage,
          comLogo: imgCompany,
        }
      }
    })
    // Generate zip name based on date and number of equipments
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
    // Prepare promises for generating curriculum PDFs
    const curriculumPromises = cvs.map(async (cv) => {
      const resources = zipMap.get(cv._id) || { curriculumImages: [], clientImages: [], curriculumAccs: [] }
      const curriculumImage = resources.curriculumImages?.[0]?.url
      const curriculumAccs = resources.curriculumAccs || []
      const clientImage = resources.clientImages?.[0]?.url
      const pdf = await pdfToBase64(CurriculumPDF, {
        cv, com: company!, accs: curriculumAccs,
        cvLogo: curriculumImage,
        cliLogo: clientImage,
        comLogo: imgCompany,
      })
      return { pdf, fileName: `${cv.name} - ${cv.modelEquip}/Hoja de vida.pdf` }
    })
    // Prepare promises for generating maintenance PDFs
    const maintenancePromises = cvs.flatMap((cv) =>
      cv.hasMaintenances && cv.childRows?.length > 0
        ? cv.childRows.map(async (mt) => {
          const pdf = await pdfToBase64(MaintenancePDF, { mt, com: company!, imgs: imgCom })
          return { pdf, fileName: `${cv.name} - ${cv.modelEquip}/Mantenimientos/${mt.typeMaintenance}-${mt.dateMaintenance.toISOString().split('T')[0]}.pdf` }
        }) : []
    )
    // Execute all promises in parallel and generate the zip
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
    if (!imgCurriculum || !imgClient || !imgCompany || !accs) return
    if (isProcessing.current) return
    isProcessing.current = true
    const fileName = `hoja-de-vida-${cv.name}-${cv.modelEquip}.pdf`
    await downloadPDF({
      fileName, component: CurriculumPDF, props: {
        cv, accs, com: company!,
        cvLogo: imgCurriculum,
        comLogo: imgCompany,
        cliLogo: imgClient,
      }
    }).finally(() => { setOnDownload(undefined); isProcessing.current = false })
  }, [downloadPDF, company, accs])

  /**
   * Función que se ejecuta cuando se elimina un currículo
   * @param {string} id - ID del currículo a eliminar
   */
  const deleteCurriculum = useCallback(async (id: string) => {
    if (!imgCurriculum || !accs || !mts) return
    if (isProcessing.current) return
    isProcessing.current = true
    const curriculumAccs = accs?.filter(acc => acc.curriculum?._id === id) || []
    const curriculumMts = mts?.filter(mt => mt.curriculum?._id === id) || []
    await deleteCv({ id })
    const deleteOperations = []
    curriculumAccs.length > 0 && deleteOperations.push(Promise.all(curriculumAccs.map(acc => deleteAcc({ id: acc._id }))))
    curriculumMts.length > 0 && deleteOperations.push(Promise.all(curriculumMts.map(mt => deleteMt({ id: mt._id }))))
    imgCurriculum && deleteOperations.push(Promise.resolve(await deleteFile({ path: `files/${id}/preview/img` })))
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
    imgCli, imgCom, imgCv, isLoading, companies, accs, mts
  ])

  return {
    handleDelete: (id: string) => setOnDelete(id),
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
/*=========================================================================================================*/