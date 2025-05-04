import useEquipmentClassification from './useEquipClassificationCV'
import useTechnicalCharacteristics from './useTechCharacteristicsCV'
import useCharacteristics from './useCharacteristicsCV'
import useMaintenance from './useMaintenanceCV'
import useAccessories from './useAccessoryCV'
import useInspection from './useInspectionCV'
import useBasicData from './useBasicDataCV'
import useLocation from './useLocationCV'
import useDetails from './useDetailsCV'

// Creamos un hook compuesto que inicializa todos los sub-hooks
export const useCurriculumSections = () => {
  const equipmentData = useEquipmentClassification()
  const technicalData = useTechnicalCharacteristics()
  const characteristicsData = useCharacteristics()
  const inspectionData = useInspection.render()
  const maintenanceData = useMaintenance()
  const detailsData = useDetails.render()
  const accessoryData = useAccessories()
  const locationData = useLocation()
  const basicData = useBasicData()

  return {
    characteristicsData,
    accessoryData,
    inspectionData,
    maintenanceData,
    technicalData,
    equipmentData,
    detailsData,
    basicData,
    locationData,
  }
}