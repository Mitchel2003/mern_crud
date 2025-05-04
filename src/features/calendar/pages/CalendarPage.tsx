import TeamAvailabilitySection from "../sections/TeamAvailabilitySection"
import UpcomingEventsSection from "../sections/UpcomingEventsSection"
import HeaderCalendarSection from "../sections/HeaderCalendarSection"
import CalendarView from "../components/CalendarView"

import { useThemeContext } from "@/context/ThemeContext"
import { useAuthContext } from "@/context/AuthContext"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const CalendarPage = () => {
  const { theme } = useThemeContext()
  const { user: credentials } = useAuthContext()
  return (
    <main className={cn('mx-auto px-2 lg:px-4 py-4')}>
      <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <HeaderCalendarSection theme={theme} credentials={credentials} />{/* Encabezado del Calendario */}
        <UpcomingEventsSection theme={theme} upcomingEvents={[]} />{/* Sección de Próximos Eventos */}
        <CalendarView theme={theme} />{/* Componente adaptador que conecta UI con datos */}
        <TeamAvailabilitySection theme={theme} teamMembers={[]} />{/* Sección de users */}
      </motion.div>
    </main>
  )
}

export default CalendarPage