import { ThemeContextProps } from "@/interfaces/context.interface"
import { useClientDashboard } from "@/hooks/dashboard/useClientDashboard"
import { motion } from "framer-motion"
import { useAuthContext } from "@/context/AuthContext"

import StatsClientSection from "./StatsClientSection"
import InfoClientSection from "./InfoClientSection"
import TabsClientSection from "./TabsClientSection"
import SolicitClientSection from "./SolicitClientSection"
import { cn } from "@/lib/utils"
import { Skeleton } from "#/ui/skeleton"

const ClientSection = ({ theme }: ThemeContextProps) => {
  const { user } = useAuthContext()
  const { data, loading } = useClientDashboard()

  return (
    <main className={cn('mx-auto px-4 lg:px-8 py-4')}>
      <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Sección de Bienvenida */}
        <header className="mb-8">
          <h1 className={cn('text-3xl md:text-4xl font-bold', theme === 'dark' ? 'text-white' : 'text-zinc-800')}>
            Bienvenido a su
            <span className={cn('bg-gradient-to-bl text-transparent bg-clip-text', theme === 'dark'
              ? 'from-purple-400 to-blue-900'
              : 'from-purple-700 to-blue-600'
            )}> Gestion documental biomédica </span>
            {user && <span className="text-xl ml-2">({user.username})</span>}
          </h1>
          <p className={cn('text-gray-600 mt-2', theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600')}>
            Gestione sus equipos médicos y solicitudes de mantenimiento
          </p>
        </header>

        {loading ? (
          // Skeleton loader mientras se cargan los datos
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        ) : (
          <>
            <TabsClientSection theme={theme} />{/* Sección de Navegación "tabs" */}
            <StatsClientSection theme={theme} data={data} />{/* Sección de Estadísticas */}
            <SolicitClientSection theme={theme} totalDocuments={data.totalDocuments} />{/* Sección de Solicitudes */}
            <InfoClientSection 
              theme={theme} 
              equipmentStatus={data.equipmentStatus}
              recentActivities={data.recentActivities}
              upcomingMaintenances={data.upcomingMaintenances}
            />{/* Sección de Información */}
          </>
        )}
      </motion.div>
    </main>
  )
}

export default ClientSection