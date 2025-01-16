import useEngineerService from './useEngineerServiceMT'
import useObservation from './useObservationMT'
import useReference from './useReferenceMT'

// Creamos un hook compuesto que inicializa todos los sub-hooks
export const useMaintenanceSections = () => {
  const engineerServiceData = useEngineerService()
  const observationData = useObservation()
  const referenceData = useReference()

  return {
    engineerServiceData,
    observationData,
    referenceData
  }
}

export {
  useEngineerService,
  useObservation,
  useReference
}