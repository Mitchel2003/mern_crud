import { MaintenanceFormProps } from "@/schemas/format/maintenance.schema"
import { Maintenance } from "@/interfaces/context.interface"

/** This hook is used to get the data of the observation section of the maintenance form */
const useObservationMT = () => {
  const mapValues = (data: Maintenance) => ({
    dateNextMaintenance: data.dateNextMaintenance ? new Date(data.dateNextMaintenance) : null,
    dateMaintenance: data.dateMaintenance ? new Date(data.dateMaintenance) : null,
    annexesPreview: data.metadata?.files || [],
    typeMaintenance: data.typeMaintenance,
    statusEquipment: data.statusEquipment,
    observations: data.observations,
  })

  const submitData = (data: MaintenanceFormProps) => ({
    dateNextMaintenance: data.dateNextMaintenance,
    dateMaintenance: data.dateMaintenance,

    typeMaintenance: data.typeMaintenance,
    statusEquipment: data.statusEquipment,
    observations: data.observations,
  })

  return { mapValues, submitData }
}

export default useObservationMT