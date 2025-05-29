import MaintenanceHistory from './MaintenanceHistoryPreviewCV'
import Maintenance from './MaintenancePreviewCV'
import Equipment from './EquipmentPreviewCV'
import Details from './DetailsPreviewCV'
import Client from './ClientPreviewCV'
import Footer from './FooterPreviewCV'
import Header from './HeaderPreviewCV'

/**
 * Archivo de exportación centralizada para los componentes de Preview de Curriculum
 * 
 * Este módulo proporciona un punto único de importación para todos los componentes
 * relacionados con la visualización del curriculum (hoja de vida) de equipos,
 * facilitando su uso en otras partes de la aplicación y mejorando la mantenibilidad.
 * 
 * Siguiendo el patrón de barrel exports, este archivo permite importar múltiples
 * componentes desde una única ubicación, reduciendo la cantidad de importaciones
 * necesarias en los archivos que consumen estos componentes.
 */

/**
 * Objeto que centraliza todos los componentes relacionados con el Preview de Curriculum.
 * Permite un acceso más estructurado a los componentes y facilita su importación
 * en bloque cuando sea necesario.
 */
export const PreviewComponents = {
  MaintenanceHistory,
  Maintenance,
  Equipment,
  Details,
  Client,
  Footer,
  Header
} as const

/**
 * Tipo que representa las claves del objeto PreviewComponents.
 * Útil para tipar parámetros que esperan uno de los componentes disponibles.
 */
export type PreviewComponentType = keyof typeof PreviewComponents

// Exportación por defecto para permitir importaciones más sencillas
export default PreviewComponents