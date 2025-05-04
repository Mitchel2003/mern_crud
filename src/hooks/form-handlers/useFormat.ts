import { useMaintenanceSections } from './maintenance/useMT'
import { useCurriculumSections } from './curriculum/useCV'
import { useSolicitSections } from './solicit/useSLC'
/**
 * This index is used to handle logic for formatting sections of forms
 * It's a composite hook that returns the data of the format
 * 
 * The main purpose of this hook is to provide a way to handle different
 * forms for different tables, and to handle the logic for rendering
 * the form fields and submitting the data to the api
 * 
 * For example, when we have an id in the params, we do an update, so we
 * fetch the data from the api and fill the form fields with the loaded
 * information. This is the "render" functionality.
 * 
 * On the other hand, when we don't have an id in the params, we do a create,
 * so we convert the different data from our reactive form and adapt it
 * to create correctly. This is the "submit" functionality.
 * 
 * (look hook forms for more info)
 * 
 * This abstraction is used to control the logic for different forms, and
 * to provide a way to easily switch between different forms.
 */

/**
 * Objeto que centraliza todos los componentes relacionados con DocumentsHub.
 * Permite un acceso más estructurado a los componentes y facilita su importación
 * en bloque cuando sea necesario.
 */
export const formatHooks = {
  maintenance: useMaintenanceSections,
  curriculum: useCurriculumSections,
  solicit: useSolicitSections,
} as const

/**
 * Tipo que representa las claves del objeto DocumentsComponents.
 * Útil para tipar parámetros que esperan uno de los componentes disponibles.
 */
export type FormatHookType = keyof typeof formatHooks

export default formatHooks