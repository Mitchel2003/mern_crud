import useEquipmentClassification from './useEquipClassificationCV'
import useTechnicalCharacteristics from './useTechCharacteristicsCV'
import useMaintenanceData from './useMaintenanceCV'
import useInspection from './useInspectionCV'
import useBasicData from './useBasicDataCV'
import useLocation from './useLocationCV'
import useDetails from './useDetailsCV'

// Creamos un hook compuesto que inicializa todos los sub-hooks
export const useCurriculumSections = () => {
  const equipmentData = useEquipmentClassification()
  const technicalData = useTechnicalCharacteristics()
  const inspectionData = useInspection.render()
  const maintenanceData = useMaintenanceData()
  const detailsData = useDetails.render()
  const locationData = useLocation()
  const basicData = useBasicData()

  return {
    inspectionData,
    maintenanceData,
    technicalData,
    equipmentData,
    detailsData,
    basicData,
    locationData,
  }
}

export {
  useEquipmentClassification,
  useTechnicalCharacteristics,
  useMaintenanceData,
  useBasicData,
  useLocation,
  useDetails
}