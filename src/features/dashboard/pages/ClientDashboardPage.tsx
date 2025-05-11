import { useClientDashboard } from "@/features/dashboard/hooks/useClientDashboard"
import { ThemeContextProps } from "@/interfaces/context.interface"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { useAuthContext } from "@/context/AuthContext"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

import NavigateSection from "@/features/dashboard/sections/client/NavigateSection"
import WelcomeSection from "@/features/dashboard/sections/client/WelcomeSection"
import StatsSection from "@/features/dashboard/sections/client/StatsSection"
import InfoSection from "@/features/dashboard/sections/client/InfoSection"

const ClientDashboardPage = ({ theme }: ThemeContextProps) => {
  const { user: credentials } = useAuthContext()
  const { data, loading } = useClientDashboard()
  if (loading) return <Skeleton theme={theme} />
  return (
    <main className={cn('mx-auto px-4 lg:px-8 py-4')}>
      <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <WelcomeSection theme={theme} credentials={credentials} />{/* Sección de Bienvenida */}
        <StatsSection theme={theme} data={data} />{/* Sección de Estadísticas; preview de informacion */}
        <NavigateSection theme={theme} />{/* Sección de Navegación, posee los navegadores o funcionalidades */}
        <InfoSection theme={theme} equipmentStatus={data.equipmentStatus} recentActivities={data.recentActivities} upcomingMaintenances={data.upcomingMaintenances} />{/* Sección de Información */}
      </motion.div>
    </main>
  )
}

export default ClientDashboardPage