import { Maintenance, Curriculum, Headquarter, Office, User } from "@/interfaces/context.interface"
import { MaintenanceFormProps } from "@/schemas/format/maintenance.schema"
import { useQueryLocation } from "@/hooks/query/useLocationQuery"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryUser } from "@/hooks/query/useAuthQuery"

/** This hook is used to get the data of the reference section of the maintenance form */
const useReferenceMT = () => {
  const { data: headquarters } = useQueryLocation().fetchAllLocations<Headquarter>('headquarter')
  const { data: clients } = useQueryUser().fetchUserByQuery<User>({ role: 'client' })
  const { data: curriculums } = useQueryFormat().fetchAllFormats<Curriculum>('cv')
  const { data: offices } = useQueryLocation().fetchAllLocations<Office>('office')

  const mapValues = (data: Maintenance) => ({
    client: data.curriculum?.office?.headquarter?.client?._id,
    headquarter: data.curriculum?.office?.headquarter?._id,
    office: data.curriculum?.office?._id,
    curriculum: data.curriculum?._id
  })

  const submitData = (data: MaintenanceFormProps) => ({
    curriculum: data.curriculum
  })

  return {
    mapValues,
    submitData,
    options: { clients: clients || [], headquarters: headquarters || [], offices: offices || [], curriculums: curriculums || [] }
  }
}

export default useReferenceMT