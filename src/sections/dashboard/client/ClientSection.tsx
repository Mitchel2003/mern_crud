import { useClientDashboard } from "@/hooks/format/client/useClientDashboard"
import { ThemeContextProps } from "@/interfaces/context.interface"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useAuthContext } from "@/context/AuthContext"
import { motion } from "framer-motion"

import SolicitClientSection from "./SolicitClientSection"
import StatsClientSection from "./StatsClientSection"
import InfoClientSection from "./InfoClientSection"
import { cn } from "@/lib/utils"

const ClientSection = ({ theme }: ThemeContextProps) => {
  const { data, loading } = useClientDashboard()
  const { user } = useAuthContext()
  if (loading) return <Skeleton theme={theme} />
  return (
    <main className={cn('mx-auto px-4 lg:px-8 py-4')}>
      <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Sección de Bienvenida */}
        <header className="mb-8">
          <h1 className={cn('text-3xl md:text-4xl mb-2 font-bold', theme === 'dark' ? 'text-white' : 'text-zinc-800')}>
            Bienvenido a su
            <span className={cn('bg-gradient-to-bl text-transparent bg-clip-text', theme === 'dark'
              ? 'from-purple-400 to-blue-900'
              : 'from-purple-700 to-blue-600'
            )}> Portal de gestión </span>
          </h1>
          {user && <span className="text-xl">{user.username}</span>}
          <p className={cn('text-gray-600', theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600')}>
            Gestione sus equipos médicos y solicitudes de mantenimiento
          </p>
        </header>

        <StatsClientSection theme={theme} data={data} />{/* Sección de Estadísticas */}
        <SolicitClientSection theme={theme} totalDocuments={data.totalDocuments} />{/* Sección de Solicitudes */}
        <InfoClientSection
          theme={theme}
          equipmentStatus={data.equipmentStatus}
          recentActivities={data.recentActivities}
          upcomingMaintenances={data.upcomingMaintenances}
        />{/* Sección de Información */}
      </motion.div>
    </main>
  )
}

export default ClientSection