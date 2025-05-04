import { useCollaboratorDashboard } from "@/features/dashboard/hooks/useCollaboratorDashboard"
import { ThemeContextProps } from "@/interfaces/context.interface"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

import NotificationsSection from "@/features/dashboard/sections/collaborator/NotificationsSection"
import NavigateSection from "@/features/dashboard/sections/collaborator/NavigateSection"
import StatsSection from "@/features/dashboard/sections/collaborator/StatsSection"
import TasksSection from "@/features/dashboard/sections/collaborator/TasksSection"
import CTASection from "@/features/dashboard/sections/collaborator/CTASection"

const CollaboratorDashboardPage = ({ theme }: ThemeContextProps) => {
  const { data, loading } = useCollaboratorDashboard()
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

export default CollaboratorDashboardPage