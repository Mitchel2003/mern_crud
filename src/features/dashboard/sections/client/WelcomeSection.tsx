import { Calendar, Sun, Moon, Sunrise, Sunset, AlertCircle, User2, Building } from "lucide-react"
import { ThemeContextProps } from "@/interfaces/context.interface"
import { motion, AnimatePresence } from "framer-motion"
import { User } from "@/interfaces/context.interface"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type React from "react"

import { Avatar } from "#/ui/avatar"
import { Badge } from "#/ui/badge"

interface WelcomeSectionProps extends ThemeContextProps { credentials?: User }
const WelcomeSection = ({ credentials, theme }: WelcomeSectionProps) => {
  const [weatherIcon, setWeatherIcon] = useState<React.ReactNode>(null)
  const [greeting, setGreeting] = useState("")
  const [tipIndex, setTipIndex] = useState(0)
  const isDark = theme === "dark"

  useEffect(() => { //Tip cada 10 segundos
    const tipTimer = setInterval(() => { setTimeout(() => { setTipIndex((prev) => (prev + 1) % tips.length) }, 500) }, 10000)
    return () => clearInterval(tipTimer)
  }, [])

  useEffect(() => { //Determinar el saludo y el icono según la hora del día
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting("Buenos días")
      setWeatherIcon(<Sunrise className="h-6 w-6 text-amber-500" />)
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Buenas tardes")
      setWeatherIcon(<Sun className="h-6 w-6 text-amber-500" />)
    } else if (hour >= 18 && hour < 22) {
      setGreeting("Buenas noches")
      setWeatherIcon(<Sunset className="h-6 w-6 text-indigo-400" />)
    } else {
      setGreeting("Buenas noches")
      setWeatherIcon(<Moon className="h-6 w-6 text-indigo-400" />)
    }
  }, [])

  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const formattedLastSignIn = credentials?.lastSignInTime ? new Intl.DateTimeFormat("es-ES", { dateStyle: "full", timeStyle: "short" }).format(new Date(credentials.lastSignInTime)) : "Nunca"
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn("rounded-xl overflow-hidden shadow-lg border", isDark
        ? "bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800"
        : "bg-white border-gray-100"
      )}
    >
      {/* Barra decorativa superior */}
      <div className={cn("h-2 w-full", isDark
        ? "bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600"
        : "bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500",
      )} />

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Columna izquierda - Información principal */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar del usuario */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              >
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white/10 shadow-xl">
                  {credentials?.metadata?.logo ? (
                    <img className="object-cover" src={credentials.metadata.logo || "/placeholder.svg"} alt={credentials?.username || "Usuario"} />
                  ) : (
                    <div className={cn("flex h-full w-full items-center justify-center text-2xl font-semibold", isDark ? "bg-purple-700" : "bg-purple-600")}>
                      {!credentials?.username ? "U" : credentials.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Avatar>
              </motion.div>

              {/* Información de bienvenida */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {weatherIcon}
                  <h2 className={cn("text-xl font-medium", isDark ? "text-zinc-300" : "text-zinc-600")}>{greeting}</h2>
                </div>

                <h1 className={cn("text-3xl md:text-4xl font-bold flex flex-wrap items-center gap-x-2")}>
                  <span className={isDark ? "text-white" : "text-zinc-800"}>{credentials?.username || "Usuario"}</span>
                  <span className={cn("bg-gradient-to-bl text-transparent bg-clip-text", isDark ? "from-purple-400 to-blue-600" : "from-purple-700 to-blue-600")}>
                    Portal de gestión
                  </span>
                </h1>

                <div className="flex flex-wrap gap-3 mt-2">
                  <Badge
                    variant={isDark ? "outline" : "secondary"}
                    className={cn("flex items-center gap-1 px-3 py-1", isDark ? "border-zinc-700 bg-zinc-800/50" : "")}
                  >
                    <User2 className="h-3 w-3" />
                    Cliente verificado
                  </Badge>

                  {credentials?.position && (
                    <Badge
                      variant={isDark ? "outline" : "secondary"}
                      className={cn("flex items-center gap-1 px-3 py-1", isDark ? "border-zinc-700 bg-zinc-800/50" : "")}
                    >
                      <Building className="h-3 w-3" />
                      {credentials?.position}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Fecha y hora */}
            <motion.div
              variants={itemVariants}
              className={cn("flex items-center gap-2 mt-6 text-sm", isDark ? "text-zinc-400" : "text-zinc-600")}
            >
              <Calendar className="h-4 w-4" />
              Ultimo inicio de sesión: {formattedLastSignIn}
            </motion.div>

            {/* Mensaje de bienvenida */}
            <motion.p
              variants={itemVariants}
              className={cn("mt-4 text-base", isDark ? "text-zinc-300" : "text-zinc-600")}
            >
              Gestione sus equipos médicos y solicitudes de mantenimiento desde este panel centralizado. Acceda a todas
              las herramientas y recursos necesarios para optimizar la gestión de su inventario médico.
            </motion.p>

            {/* Tip profesional */}
            <AnimatePresence mode="wait">
              <motion.div
                key={tipIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={cn("mt-6 p-4 rounded-lg border flex items-start gap-3", isDark
                  ? "bg-zinc-800/50 border-zinc-700 text-zinc-300"
                  : "bg-blue-50 border-blue-100 text-blue-700"
                )}
              >
                <div className={cn("rounded-full p-1 flex-shrink-0", isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600")}>
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Consejo profesional:</p>
                  <p className="text-sm">{tips[tipIndex]}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default WelcomeSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const tips = [ //Tips sugeridos to show
  "Consulte las notificaciones diariamente para estar al día.",
  "Mantenga actualizada la documentación de sus equipos médicos.",
  "Programe mantenimientos preventivos para optimizar el rendimiento.",
  "Revise regularmente el estado de sus equipos para prevenir fallos.",
  "Utilice los filtros de búsqueda para encontrar rápidamente lo que necesita.",
]