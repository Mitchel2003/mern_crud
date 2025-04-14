import { useEngineerDashboard } from "@/hooks/format/engineer/useEngineerDashboard"
import CalendarSection from "#/pages/dashboard/engineer/Calendar"
import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useAuthContext } from "@/context/AuthContext"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Importar las secciones del dashboard
import NotificationsSection from "@/sections/dashboard/engineer/NotificationsSection"
import NavigateSection from "@/sections/dashboard/engineer/NavigateSection"
import StatsSection from "@/sections/dashboard/engineer/StatsSection"
import TasksSection from "@/sections/dashboard/engineer/TasksSection"
import CTASection from "@/sections/dashboard/engineer/CTASection"

// Importar las secciones del calendario
import HeaderCalendarSection from "@/sections/dashboard/engineer/calendar/HeaderCalendarSection"
import UpcomingEventsSection from "@/sections/dashboard/engineer/calendar/UpcomingEventsSection"
import TeamAvailabilitySection from "@/sections/dashboard/engineer/calendar/TeamAvailabilitySection"

const EngineerDashboardPage = () => {
  const { theme } = useThemeContext()
  const { data, loading } = useEngineerDashboard()
  if (loading) return <Skeleton theme={theme} />
  return (
    <main className={cn('mx-auto px-2 lg:px-4 py-4')}>
      <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Sección de Bienvenida */}
        <header className="mb-8 px-2 lg:px-4">
          <h1 className={cn('text-3xl md:text-4xl mb-2 font-bold', theme === 'dark' ? 'text-white' : 'text-zinc-800')}>
            Bienvenido a su
            <span className={cn('bg-gradient-to-bl text-transparent bg-clip-text', theme === 'dark'
              ? 'from-blue-400 to-purple-900'
              : 'from-blue-700 to-purple-600'
            )}> Portal de Ingeniero</span>
          </h1>
          <p className={cn('text-gray-600', theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600')}>
            Gestione mantenimientos, equipos y su agenda de trabajo
          </p>
        </header>

        <StatsSection theme={theme} data={data} />{/* Sección de Estadísticas */}
        <NavigateSection theme={theme} />{/* Sección de Navegación Rápida */}
        <NotificationsSection theme={theme} data={data} />{/* Sección de Notificaciones */}
        <TasksSection theme={theme} data={data} />{/* Sección de Tareas y Actividades */}
        <CTASection theme={theme} />{/* Sección de CTA */}
      </motion.div>
    </main>
  )
}

export default EngineerDashboardPage
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
export const CalendarPage = () => {
  const { theme } = useThemeContext()
  const { user: credentials } = useAuthContext()
  return (
    <main className={cn('mx-auto px-2 lg:px-4 py-4')}>
      <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <HeaderCalendarSection theme={theme} credentials={credentials} />{/* Encabezado del Calendario */}
        <UpcomingEventsSection theme={theme} upcomingEvents={[]} />{/* Sección de Próximos Eventos */}
        <CalendarSection theme={theme} />{/* Sección Principal del Calendario; Componente externo */}
        <TeamAvailabilitySection theme={theme} teamMembers={[]} />{/* Sección de users */}
      </motion.div>
    </main>
  )
}