import useObservationMT from './useObservationMT'
import useReferenceMT from './useReferenceMT'

// Creamos un hook compuesto que inicializa todos los sub-hooks
export const useMaintenanceSections = () => {
  const observationData = useObservationMT()
  const referenceData = useReferenceMT()

  return { referenceData, observationData }
}
export { useReferenceMT, useObservationMT }