import { useMaintenanceSections } from './maintenance/useMT'
import { useCurriculumSections } from './curriculum/useCV'

export const formatHooks = {
  maintenance: useMaintenanceSections,
  curriculum: useCurriculumSections,
} as const

export type FormatHookType = keyof typeof formatHooks
export default formatHooks
