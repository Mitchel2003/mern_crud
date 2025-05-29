// Importaciones de location pages
import HeadquarterPage from './HeadquarterPage'
import CountryPage from './CountryPage'
import OfficePage from './OfficePage'
import StatePage from './StatePage'
import CityPage from './CityPage'

// Importaciones de document pages
import MaintenancePage from './MaintenancePage'
import CurriculumPage from './CurriculumPage'
import SchedulePage from './SchedulePage'
import SolicitPage from './SolicitPage'

// Importaciones de user pages
import CollaboratorPage from './CollaboratorPage'
import CompanyPage from './CompanyPage'
import ClientPage from './ClientPage'

// Importaciones de preview and reusables pages
import ClientFlowPage from './reusables/ClientFlowPage'

/**
 * Archivo de exportación centralizada para las páginas de documentos
 * 
 * Este módulo proporciona un punto único de importación para todas las páginas
 * relacionadas con la gestión de documentos y entidades del sistema,
 * facilitando su uso en otras partes de la aplicación y mejorando la mantenibilidad.
 * 
 * Siguiendo el patrón de barrel exports, este archivo permite importar múltiples
 * componentes desde una única ubicación, reduciendo la cantidad de importaciones
 * necesarias en los archivos que consumen estos componentes.
 */

const SpecialPages = { ClientFlowPage } as const
const UserPages = { CollaboratorPage, CompanyPage, ClientPage } as const
const LocationPages = { HeadquarterPage, CountryPage, OfficePage, StatePage, CityPage } as const
const DocumentPages = { MaintenancePage, CurriculumPage, SchedulePage, SolicitPage } as const

/**
 * Agrupación completa de todas las páginas de documentos
 * Permite un acceso más estructurado a los componentes y facilita su importación
 * en bloque cuando sea necesario.
 */
export const Pages = {
  ...DocumentPages,
  ...LocationPages,
  ...SpecialPages,
  ...UserPages
} as const

/**
 * Tipo que representa las claves del objeto Pages.
 * Util para tipar parámetros que esperan uno de los componentes disponibles.
 */
export type PageType = keyof typeof Pages

// Exportación por defecto para permitir importaciones más sencillas
export default Pages