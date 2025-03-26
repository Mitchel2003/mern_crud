import { Headquarter, Office, Curriculum, User } from "@/interfaces/context.interface"
import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useQueryUser } from "@/hooks/query/useAuthQuery"

/** This hook is used to get the data of the location section of the curriculum form */
const useLocationCV = () => {
  const { fetchAllLocations } = useQueryLocation()
  const { fetchUserByQuery } = useQueryUser()

  const { data: headquarters } = fetchAllLocations<Headquarter>('headquarter')
  const { data: clients } = fetchUserByQuery<User>({ role: 'client' })
  const { data: offices } = fetchAllLocations<Office>('office')

  const mapValues = (cv: Curriculum) => ({
    client: cv.office.headquarter?.user?._id,
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
      offices: offices || [],
      headquarters: headquarters || [],
    }
  }
}

export default useLocationCV