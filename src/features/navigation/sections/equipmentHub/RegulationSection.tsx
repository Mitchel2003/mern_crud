import { ThemeContextProps } from "@/interfaces/context.interface"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface RegulationSectionProps extends ThemeContextProps { setOpen: (open: string | undefined) => void }
const RegulationSection = ({ theme, setOpen }: RegulationSectionProps) => {
  const isMobile = useIsMobile()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className={cn("rounded-xl p-6", theme === "dark"
        ? "bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-800/50"
        : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100",
      )}
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 md:mr-6">
          <h3 className={cn("text-xl font-bold mb-2", theme === "dark" ? "text-white" : "text-gray-800")}>
            Gestión Integral de Equipos Biomédicos
          </h3>
          <p className={cn("max-w-xl", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
            Nuestro sistema permite mantener un control completo sobre sus equipos, desde su creación hasta la
            gestión de mantenimientos, garantizando el cumplimiento de normativa vigente.
          </p>

          <div className="flex flex-col md:flex-row mt-4 gap-2 cursor-pointer">
            <motion.span
              whileHover={{ scale: 1.05 }}
              onClick={() => setOpen("resolucion")}
              className={cn("inline-flex items-center px-3 py-1 rounded-md text-base sm:text-xs font-medium", theme === "dark" ? "bg-purple-900/50 text-purple-200" : "bg-purple-100 text-purple-800")}
            >
              Resolución 3100 de 2019
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              onClick={() => setOpen("habilitacion")}
              className={cn("inline-flex items-center px-3 py-1 rounded-md text-base sm:text-xs font-medium", theme === "dark" ? "bg-amber-900/50 text-amber-200" : "bg-amber-100 text-amber-800")}
            >
              Manual de Inscripción de Prestadores y Habilitación de Servicios de Salud
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              onClick={() => setOpen("decreto")}
              className={cn("inline-flex items-center px-3 py-1 rounded-md text-base sm:text-xs font-medium", theme === "dark" ? "bg-indigo-900/50 text-indigo-200" : "bg-indigo-100 text-indigo-800")}
            >
              Decreto 4725 de 2005
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              onClick={() => setOpen("iso")}
              className={cn("inline-flex items-center px-3 py-1 rounded-md text-base sm:text-xs font-medium", theme === "dark" ? "bg-blue-900/50 text-blue-200" : "bg-blue-100 text-blue-800")}
            >
              ISO 9001 de 2015
            </motion.span>
          </div>
        </div>

        {/* Gráfico ilustrativo */}
        <div className={cn(`w-full md:w-64 h-32 ${isMobile && 'hidden'} rounded-lg overflow-hidden relative`, theme === "dark" ? "bg-blue-950/50" : "bg-white")}>
          <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
            <motion.div
              initial={{ height: "0%" }}
              animate={{ height: "60%" }}
              className="w-6 bg-blue-500 rounded-t-md"
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
              initial={{ height: "0%" }}
              animate={{ height: "80%" }}
              className="w-6 bg-indigo-500 rounded-t-md"
              transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
              initial={{ height: "0%" }}
              animate={{ height: "40%" }}
              className="w-6 bg-purple-500 rounded-t-md"
              transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
              initial={{ height: "0%" }}
              animate={{ height: "70%" }}
              className="w-6 bg-teal-500 rounded-t-md"
              transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className={cn("absolute bottom-0 left-0 right-0 h-px", theme === "dark" ? "bg-gray-700" : "bg-gray-300")} />
        </div>
      </div>
    </motion.div>
  )
}

export default RegulationSection