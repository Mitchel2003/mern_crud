import { ThemeContextProps } from "@/interfaces/context.interface"
import { motion } from "framer-motion"

import StatsClientSection from "./StatsClientSection"
import InfoClientSection from "./InfoClientSection"
import TabsClientSection from "./TabsClientSection"
import SolicitSection from "./SolicitClientSection"
import { cn } from "@/lib/utils"

const ClientSection = ({ theme }: ThemeContextProps) => {
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
            )}> Portal Biomédico </span>
          </h1>
          <p className={cn('text-gray-600 mt-2', theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600')}>
            Gestione sus equipos médicos y solicitudes de mantenimiento
          </p>
        </header>

        <TabsClientSection theme={theme} />{/* Sección de Navegación "tabs" */}
        <StatsClientSection theme={theme} />{/* Sección de Estadísticas */}
        <SolicitSection theme={theme} />{/* Sección de Solicitudes */}
        <InfoClientSection theme={theme} />{/* Sección de Información */}
      </motion.div>
    </main>
  )
}

export default ClientSection