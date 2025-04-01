import { useMaintenanceSections } from './maintenance/useMT'
import { useCurriculumSections } from './curriculum/useCV'
import { useSolicitSections } from './solicit/useSLC'

export const formatHooks = {
  maintenance: useMaintenanceSections,
  curriculum: useCurriculumSections,
  solicit: useSolicitSections,
} as const

export type FormatHookType = keyof typeof formatHooks
export default formatHooks
