import RegulationsDrawer from './RegulationsDrawer'
import ScheduleDrawer from './ScheduleDrawer'
import InformationCard from './InfoCard'
import FooterHelp from './FooterHelp'
import NavCard from './NavCard'

/**
 * Archivo de exportación centralizada para los componentes de DocumentsHub
 * 
 * Este módulo proporciona un punto único de importación para todos los componentes
 * relacionados con la funcionalidad de DocumentsHub, facilitando su uso en otras
 * partes de la aplicación y mejorando la mantenibilidad del código.
 * 
 * Siguiendo el patrón de barrel exports, este archivo permite importar múltiples
 * componentes desde una única ubicación, reduciendo la cantidad de importaciones
 * necesarias en los archivos que consumen estos componentes.
 */

/**
 * Objeto que centraliza todos los componentes relacionados con DocumentsHub.
 * Permite un acceso más estructurado a los componentes y facilita su importación
 * en bloque cuando sea necesario.
 */
export const DocsHubComponents = {
  RegulationsDrawer,
  ScheduleDrawer,
  InformationCard,
  FooterHelp,
  NavCard,
} as const

/**
 * Tipo que representa las claves del objeto DocumentsComponents.
 * Útil para tipar parámetros que esperan uno de los componentes disponibles.
 */
export type DocumentsComponentType = keyof typeof DocsHubComponents

export default DocsHubComponents