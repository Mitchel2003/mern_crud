import { Maintenance, Curriculum, Client } from "@/interfaces/context.interface"
import { MaintenanceFormProps } from "@/schemas/format/maintenance.schema"
import { useQueryFormat } from "@/hooks/query/useFormatQuery"
import { useQueryUser } from "@/hooks/query/useUserQuery"

/** This hook is used to get the data of the reference section of the maintenance form */
const useReferenceMT = () => {
  const { data: curriculums } = useQueryFormat().fetchAllFormats<Curriculum>('cv')
  const { data: clients } = useQueryUser().fetchAllUsers<Client>('client')

  const mapValues = (data: Maintenance) => ({
    client: {
      nit: data.curriculum.office.headquarter?.client?.nit,
      name: data.curriculum.office.headquarter?.client?.name,
      email: data.curriculum.office.headquarter?.client?.email,
    },
    curriculum: data.curriculum._id,
  })

  const submitData = (data: MaintenanceFormProps) => ({
    curriculum: data.curriculum,
  })

  return {
    mapValues,
    submitData,
    options: {
      clients,
      curriculums
    }
  }
}

export default useReferenceMT