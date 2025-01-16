import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { Curriculum } from "@/interfaces/context.interface"

/** This hook is used to get the data of the maintenance section of the curriculum form */
const useMaintenanceCV = () => {
  const mapValues = (data: Curriculum) => ({
    employmentMaintenance: data.employmentMaintenance,
    frequencyMaintenance: data.frequencyMaintenance,
    typeMaintenance: data.typeMaintenance,
    manualsMaintenance: data.manualsMaintenance,
  })

  const submitData = (data: CurriculumFormProps) => ({
    employmentMaintenance: data.employmentMaintenance,
    frequencyMaintenance: data.frequencyMaintenance,
    typeMaintenance: data.typeMaintenance,
    manualsMaintenance: data.manualsMaintenance,
  })

  return { mapValues, submitData }
}

export default useMaintenanceCV