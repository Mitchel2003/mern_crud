import { Maintenance, Curriculum } from "@/interfaces/context.interface"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import { encodeQueryParams } from "@/lib/query"

interface ClientPreviewData {
  clientData: any | null
  error: string | null
  loading: boolean
}

/**
 * Custom hook for managing client preview data
 * Provides information about headquarters, offices, equipment and maintenance records
 * @param id Client ID to fetch data for
 * @returns Processed client preview data and utility functions
 */
export const useClientPreview = (id?: string) => {
  const [state, setState] = useState<ClientPreviewData>({ clientData: null, loading: true, error: null })
  const queryFormat = useQueryFormat()
  const navigate = useNavigate()

  // Optimized queries using backend aggregation pipelines
  const { data: cvs = [], isLoading: isLoadingCvs } = queryFormat.fetchFormatByQuery<Curriculum>('cv', { client: id, enabled: !!id })
  const { data: mts = [], isLoading: isLoadingMts } = queryFormat.fetchFormatByQuery<Maintenance>('maintenance', { client: id, enabled: !!id })
  console.log(cvs)
  const isLoading = isLoadingCvs || isLoadingMts

  useEffect(() => { if (!isLoading) processData() }, [cvs, mts, isLoading])

  /** Navigates to maintenance form with equipment name and model encoded in query params */
  const navigateToMaintenance = useCallback((equipment: any) => (
    navigate(`/form/maintenance/${encodeQueryParams({ name: equipment.name, modelEquip: equipment.modelEquip })}`)
  ), [navigate])

  /** Navigates to curriculum form with equipment name and model encoded in query params */
  const navigateToCurriculum = useCallback((equipment: any) => (
    navigate(`/form/curriculum/preview/${equipment._id}`)
  ), [navigate])

  /**
   * Determines the current status of the equipment based on its last maintenance
   * The status can be Operational, Maintenance or Inactive according to the last maintenance data
   */
  const getEquipmentStatus = useCallback((equipmentId: string, maintenances: Maintenance[]): string => {
    const equipmentMaintenances = maintenances
      .filter(m => m.curriculum?._id?.toString() === equipmentId)
      .sort((a, b) => new Date(b.dateMaintenance).getTime() - new Date(a.dateMaintenance).getTime())
    if (equipmentMaintenances.length === 0) return "Sin mantenimientos"
    const rawStatus = equipmentMaintenances[0].statusEquipment || ""
    return rawStatus
  }, [])

  /**
   * Process raw maintenance data into a structured format for UI rendering
   * with proper hierarchical relationships between headquarters, offices and equipment
   */
  const processData = useCallback(() => {
    if (!cvs.length) return setState({ clientData: null, loading: false, error: "No maintenance records found for this client" })
    const firstCv = cvs[0] //we only need the first cv to get the client information
    const clientInfo = firstCv.office?.headquarter?.client //get credentials of client
    if (!clientInfo) return setState({ clientData: null, loading: false, error: "Could not retrieve client information" })

    const headquarterMap = new Map<string, any>()
    const curriculumMap = new Map<string, any>()
    const officeMap = new Map<string, any>()

    cvs.forEach((cv: any) => {
      const curriculum = cv;
      const office = curriculum.office;
      const headquarter = office.headquarter;

      const headquarterId = headquarter._id
      const curriculumId = curriculum._id
      const officeId = office._id

      if (!headquarterMap.has(headquarterId)) {
        headquarterMap.set(headquarterId, {
          consultorios: [],
          id: headquarterId,
          nombre: headquarter.name,
          telefono: clientInfo.phone || "No especificado",
          direccion: headquarter.address || "No especificada",
        })
      }

      if (!officeMap.has(officeId)) {
        officeMap.set(officeId, {
          equipos: [],
          id: officeId,
          nombre: office.name,
          servicio: office.group || "No especificado",
          especialidad: office.services?.join(", ") || "General",
        })
      }

      if (!curriculumMap.has(curriculumId)) {
        curriculumMap.set(curriculumId, {
          ...curriculum,
          status: getEquipmentStatus(curriculumId, mts)
        })
      }
    })

    //associate each equipment to its corresponding office
    curriculumMap.forEach((equipo, curriculumId) => {
      const matchingMaintenances = mts.filter(m => m.curriculum?._id === curriculumId)
      if (matchingMaintenances.length === 0) return
      const maintenance = matchingMaintenances[0]
      const officeId = maintenance.curriculum.office._id
      const office = officeMap.get(officeId) //avoid duplicates before adding
      if (office && !office.equipos.some((e: any) => e.id === equipo._id)) { office.equipos.push(equipo) }
    })

    //associate each office to its corresponding headquarter
    officeMap.forEach((office, officeId) => {
      const maintenancesForOffice = mts.filter(m => m.curriculum?.office?._id?.toString() === officeId)
      if (maintenancesForOffice.length === 0) return
      const maintenance = maintenancesForOffice[0]
      const headquarterId = maintenance.curriculum.office.headquarter._id
      const headquarter = headquarterMap.get(headquarterId) //avoid duplicates before adding
      if (headquarter && !headquarter.consultorios.some((c: any) => c.id === office.id)) { headquarter.consultorios.push(office) }
    })

    //short the headquarters, offices and equipments alphabetically for better presentation
    headquarterMap.forEach(headquarter => {
      headquarter.consultorios.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre))
      headquarter.consultorios.forEach((office: any) => { office.equipos.sort((a: any, b: any) => a.name.localeCompare(b.name)) })
    })

    //calculate maintenance type statistics using reduce
    const maintenanceTypeCount = mts.reduce((acc: Record<string, number>, mt) => {
      const type = mt.typeMaintenance
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    //calculate equipment status distribution using Array.from and reduce
    const equipmentStatusCount = Array.from(curriculumMap.values()).reduce((acc: Record<string, number>, equipment) => {
      const status = equipment.estado
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    //build the final client data object with statistics
    const clientData = {
      id: clientInfo._id,
      nombre: clientInfo.username,
      nit: clientInfo.nit || "No especificado",
      email: clientInfo.email || "No especificado",
      telefono: clientInfo.phone || "No especificado",
      fechaRegistro: clientInfo.createdAt ? dayjs(clientInfo.createdAt).format('DD/MM/YYYY') : "No especificada",
      logo: clientInfo.metadata?.logo || "",
      sedes: Array.from(headquarterMap.values()),
      //statistics for dashboard cards
      stats: {
        totalMantenimientos: mts.length,
        totalSedes: headquarterMap.size,
        totalEquipos: curriculumMap.size,
        totalConsultorios: officeMap.size,
        equiposPorEstado: equipmentStatusCount,
        mantenimientosPorTipo: maintenanceTypeCount
      }
    }
    setState({ clientData, loading: false, error: null })
  }, [cvs, mts])

  /** Returns CSS class for status badge color */
  const getEstadoBadgeColor = useCallback((estado?: string): string => {
    if (!estado) return "bg-gray-100 text-gray-800"
    switch (estado?.toLowerCase()) {
      case "funcionando": return "bg-green-100 text-green-800";
      case "en espera de repuestos": return "bg-yellow-100 text-yellow-800";
      case "fuera de servicio": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }, [])
  return { ...state, getEstadoBadgeColor, navigateToMaintenance, navigateToCurriculum }
}