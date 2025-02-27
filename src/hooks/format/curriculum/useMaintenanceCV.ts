import { CurriculumFormProps } from "@/schemas/format/curriculum.schema"
import { Curriculum } from "@/interfaces/context.interface"

/** This hook is used to get the data of the maintenance section of the curriculum form */
const useMaintenanceCV = () => {
  const mapValues = (data: Curriculum) => ({
    typeMaintenance: data.typeMaintenance,
    frequencyMaintenance: data.frequencyMaintenance,
    employmentMaintenance: data.employmentMaintenance,
    manualsMaintenance: typeof data.manualsMaintenance === 'string' ? [data.manualsMaintenance] : data.manualsMaintenance
  })

  const submitData = (data: CurriculumFormProps) => ({
    typeMaintenance: data.typeMaintenance,
    manualsMaintenance: data.manualsMaintenance,
    frequencyMaintenance: data.frequencyMaintenance,
    employmentMaintenance: data.employmentMaintenance
  })

  const mapAutocomplete = (data: Curriculum) => ({
    typeMaintenance: data.typeMaintenance,
    frequencyMaintenance: data.frequencyMaintenance,
    employmentMaintenance: data.employmentMaintenance,
    manualsMaintenance: typeof data.manualsMaintenance === 'string' ? [data.manualsMaintenance] : data.manualsMaintenance
  })

  return { mapValues, mapAutocomplete, submitData }
}

export default useMaintenanceCV