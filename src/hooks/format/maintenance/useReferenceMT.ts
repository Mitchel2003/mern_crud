import { Maintenance, Curriculum, Client, Headquarter, Office } from "@/interfaces/context.interface"
import { MaintenanceFormProps } from "@/schemas/format/maintenance.schema"
import { useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryUser } from "@/hooks/query/useUserQuery"

/** This hook is used to get the data of the reference section of the maintenance form */
const useReferenceMT = () => {
  const { fetchAllLocations } = useQueryLocation()
  const { fetchAllFormats } = useQueryFormat()
  const { fetchAllUsers } = useQueryUser()

  //to much request, so i make a system of reduce in the future (from curriculum)
  //remember that i have relationships between them, so i can optimize the requests on one call
  /**
   * @example
   * //with reduce we can obtain all headquarters, offices from one request of curriculums
   * 
   * const { data: curriculums } = fetchAllFormats<Curriculum>('cv')
   * curriculums.reduce((acc, cv) => {
   *   //look that not repeat headquarters
   *   if(cv.office.headquarter._id !== acc.headquarters){
   *    acc.headquarters.push(cv.office.headquarter)
   *    acc.offices.push(cv.office)
   *    return acc
   *   }
   * }, { headquarters: [], offices: [] })
   */
  const { data: headquarters } = fetchAllLocations<Headquarter>('headquarter')
  const { data: curriculums } = fetchAllFormats<Curriculum>('cv')
  const { data: offices } = fetchAllLocations<Office>('office')
  const { data: clients } = fetchAllUsers<Client>('client')

  const mapValues = (data: Maintenance) => ({
    client: data.curriculum?.office?.headquarter?.client?._id,
    headquarter: data.curriculum?.office?.headquarter?._id,
    office: data.curriculum?.office?._id,
    service: data.curriculum?.service,
    curriculum: data.curriculum?._id
  })

  const submitData = (data: MaintenanceFormProps) => ({
    curriculum: data.curriculum,
  })

  return {
    mapValues,
    submitData,
    options: { clients, headquarters, offices, curriculums }
  }
}

export default useReferenceMT