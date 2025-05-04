import useObservationSLC from './useObservationSLC'

// Creamos un hook compuesto que inicializa todos los sub-hooks
export const useSolicitSections = () => {
  const observationData = useObservationSLC()

  return { observationData }
}
export { useObservationSLC }