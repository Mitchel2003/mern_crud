import { Headquarter, Office, Curriculum, User } from "@/interfaces/context.interface"
import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useQueryUser } from "@/hooks/query/useAuthQuery"
import { useAuthContext } from "@/context/AuthContext"
import { useMemo } from "react"

/** This hook is used to get the data of the location section of the curriculum form */
const useLocationCV = () => {
  const { fetchAllLocations } = useQueryLocation()
  const { fetchUserByQuery } = useQueryUser()
  const { user } = useAuthContext()

  const isSub = user?.role === 'company' && user?.belongsTo
  const { data: headquarters } = fetchAllLocations<Headquarter>('headquarter')
  const { data: clients } = fetchUserByQuery<User>({ role: 'client' })
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

  const formatClients = useMemo(() => {
    return isSub ? clients?.filter(client => user.permissions?.includes(client._id)) : clients
  }, [user, clients])

  const formatHeadquarters = useMemo(() => {
    return isSub ? headquarters?.filter(hq => {
      const client = hq.client //get client relationship
      return user.permissions?.includes(client?._id)
    }) : headquarters
  }, [user, headquarters])

  const formatOffices = useMemo(() => {
    return isSub ? offices?.filter(office => {
      const client = office.headquarter?.client //get client
      return user.permissions?.includes(client?._id)
    }) : offices
  }, [user, offices])

  return {
    mapValues,
    submitData,
    options: {
      clients: formatClients || [],
      offices: formatOffices || [],
      headquarters: formatHeadquarters || [],
    }
  }
}

export default useLocationCV