import RegulationsDrawer from '#/common/reusables/RegulationsDrawer'
import ScheduleDrawer from '#/common/reusables/ScheduleDrawer'
import FooterHelp from '#/common/reusables/FooterHelp'
import RegulationSection from './RegulationSection'
import NavigationSection from './NavigationSection'
import HeaderSection from './HeaderSection'

/**
 * Archivo de exportación centralizada para los componentes de EquipmentHub
 * 
 * Este módulo proporciona un punto único de importación para todos los componentes
 * relacionados con la funcionalidad de EquipmentHub, facilitando su uso en otras
 * partes de la aplicación y mejorando la mantenibilidad del código.
 * 
 * Siguiendo el patrón de barrel exports, este archivo permite importar múltiples
 * componentes desde una única ubicación, reduciendo la cantidad de importaciones
 * necesarias en los archivos que consumen estos componentes.
 */

/**
 * Objeto que centraliza todos los componentes relacionados con EquipmentHub.
 * Permite un acceso más estructurado a los componentes y facilita su importación
 * en bloque cuando sea necesario.
 */
export const EquipHubComponents = {
  RegulationSection,
  NavigationSection,
  RegulationsDrawer,
  ScheduleDrawer,
  HeaderSection,
  FooterHelp,
} as const

/**
 * Tipo que representa las claves del objeto EquipHubComponents.
 * Útil para tipar parámetros que esperan uno de los componentes disponibles.
 */
export type EquipComponentType = keyof typeof EquipHubComponents

export default EquipHubComponents