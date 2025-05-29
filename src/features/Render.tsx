import CollaboratorDashboardPage from '@/features/dashboard/pages/CollaboratorDashboardPage'
import ClientDashboardPage from '@/features/dashboard/pages/ClientDashboardPage'
import AdminDashboardPage from '@/features/dashboard/pages/AdminDashboardPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'

// Importaciones de pages home
import RegisterPage from '@/features/home/pages/RegisterPage'
import LoginPage from '@/features/home/pages/LoginPage'
import HomePage from '@/features/home/pages/HomePage'

// Importaciones de pages preview
import CurriculumPreviewPage from '@/features/preview/pages/CurriculumPreviewPage'
import ClientPreviewPage from '@/features/preview/pages/ClientPreviewPage'

// Importaciones de pages navigation
import EquipmentHub from '@/features/navigation/pages/EquipmentHub'

// Importaciones de pages calendar
import CalendarPage from '@/features/calendar/pages/CalendarPage'

// Importaciones de pages triggers
import ScannerPage from '@/features/triggers/pages/ScannerPage'

// Importaciones de pages documents
import Pages from "@/features/documents/pages/Docs"

/**
 * Archivo de exportación centralizada para las páginas de render (render)
 * 
 * Este módulo proporciona un punto único de importación para todas las páginas relacionadas con el renderizado de componentes,
 * facilitando su uso en otras partes de la aplicación y mejorando la mantenibilidad.
 * 
 * Siguiendo el patrón de barrel exports, este archivo permite importar múltiples
 * componentes desde una única ubicación, reduciendo la cantidad de importaciones
 * necesarias en los archivos que consumen estos componentes.
 */

const DocumentPages = { ...Pages } as const
const TriggerPages = { ScannerPage } as const
const CalendarPages = { CalendarPage } as const
const NavigationPages = { EquipmentHub } as const
const HomePages = { HomePage, LoginPage, RegisterPage } as const
const ClientPages = { ClientPreviewPage, CurriculumPreviewPage } as const
const DashboardPages = { DashboardPage, AdminDashboardPage, ClientDashboardPage, CollaboratorDashboardPage } as const

/**
 * Agrupación completa de todas las pages de render
 * Permite un acceso más estructurado a los componentes y facilita su importación
 * en bloque cuando sea necesario.
 */
export const RenderPages = {
  ...DocumentPages,
  ...DashboardPages,
  ...NavigationPages,
  ...CalendarPages,
  ...TriggerPages,
  ...ClientPages,
  ...HomePages,
} as const

/**
 * Tipo que representa las claves del objeto RenderPages.
 * útil para tipar parámetros que esperan uno de los componentes disponibles.
 */
export type RenderPageType = keyof typeof RenderPages

// Exportación por defecto para permitir importaciones más sencillas
export default RenderPages