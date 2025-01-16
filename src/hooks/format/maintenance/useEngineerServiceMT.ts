import { MaintenanceFormProps } from "@/schemas/format/maintenance.schema"
import { Maintenance } from "@/interfaces/context.interface"

/** This hook is used to get the data of the engineer service section of the maintenance form */
const useEngineerServiceMT = () => {
  const mapValues = (data: Maintenance) => ({
    receivedBy: data.receivedBy,
    nameEngineer: data.nameEngineer,
    invimaEngineer: data.invimaEngineer,
  })

  const submitData = (data: MaintenanceFormProps) => ({
    receivedBy: data.receivedBy,
    nameEngineer: data.nameEngineer,
    invimaEngineer: data.invimaEngineer,
  })

  return { mapValues, submitData }
}

export default useEngineerServiceMT