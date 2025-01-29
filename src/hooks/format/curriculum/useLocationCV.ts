import { Client, Headquarter, Service, Office, Curriculum } from "@/interfaces/context.interface"
import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useQueryUser } from "@/hooks/query/useUserQuery"

/** This hook is used to get the data of the location section of the curriculum form */
const useLocationCV = () => {
  const { fetchAllLocations } = useQueryLocation()
  const { fetchAllUsers } = useQueryUser()

  const { data: clients } = fetchAllUsers<Client>('client')
  const { data: headquarters } = fetchAllLocations<Headquarter>('headquarter')
  const { data: services } = fetchAllLocations<Service>('service')
  const { data: offices } = fetchAllLocations<Office>('office')

  const mapValues = (cv: Curriculum) => ({
    client: cv.office.headquarter?.client?._id,
    headquarter: cv.office.headquarter?._id,
    office: cv.office?._id,
    service: cv.service
  })

  const submitData = (data: CurriculumFormProps) => ({
    service: data.service,
    office: data.office
  })

  return {
    mapValues,
    submitData,
    options: {
      clients: clients || [],
      headquarters: headquarters || [],
      services: services || [],
      offices: offices || [],
    }
  }
}

export default useLocationCV