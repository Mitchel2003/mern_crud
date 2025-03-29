import { Wrench, ArrowRight, Laptop, Calendar, ChevronRight, Info } from "lucide-react"
import type { ThemeContextProps } from "@/interfaces/context.interface"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"
import { Card } from "#/ui/card"
import { cn } from "@/lib/utils"

import { useThemeContext } from "@/context/ThemeContext"
import Skeleton from "#/common/skeletons/SkeletonLarge"
import { Suspense } from "react"

const DocumentsHub = () => {
  const { theme } = useThemeContext()
  return (
    <Suspense fallback={<Skeleton theme={theme} />}>
      <ClientDocumentsHub theme={theme} />
    </Suspense>
  )
}

export default DocumentsHub
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface ClientDocumentsHubProps extends ThemeContextProps { }
const ClientDocumentsHub = ({ theme }: ClientDocumentsHubProps) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const navigate = useNavigate()
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Encabezado con animación */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className={cn("text-3xl md:text-4xl font-bold mb-2", theme === "dark" ? "text-white" : "text-gray-800")}>
          Centro de Recursos
        </h1>
        <p className={cn("text-lg max-w-3xl mx-auto", theme === "dark" ? "text-gray-300" : "text-gray-600")}>
          Acceda a toda la información técnica de sus equipos médicos, mantenimientos y cronogramas en un solo lugar
        </p>
      </motion.div>

      {/* Sección visual adicional */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className={cn("rounded-xl p-6 mb-8", theme === "dark"
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
              Nuestro sistema le permite mantener un control completo sobre sus equipos, desde su creación hasta
              la gestión de mantenimientos preventivo y correctivo, garantizando el cumplimiento de normativas y la
              disponibilidad óptima de sus recursos.
            </p>

            <div className="flex mt-4 space-x-2">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                  theme === "dark" ? "bg-blue-900/50 text-blue-200" : "bg-blue-100 text-blue-800",
                )}
              >
                ISO 13485
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                  theme === "dark" ? "bg-indigo-900/50 text-indigo-200" : "bg-indigo-100 text-indigo-800",
                )}
              >
                Trazabilidad
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                  theme === "dark" ? "bg-purple-900/50 text-purple-200" : "bg-purple-100 text-purple-800",
                )}
              >
                Reportes Avanzados
              </motion.span>
            </div>
          </div>

          {/* Gráfico ilustrativo */}
          <div className={cn("w-full md:w-64 h-32 rounded-lg overflow-hidden relative",
            theme === "dark" ? "bg-blue-950/50" : "bg-white",
          )}>
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

      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {cardData(theme).map((card, index) => (
          <motion.div
            key={card.id}
            custom={index}
            initial="hidden"
            animate="visible"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.03 }}
            onHoverEnd={() => setHoveredCard(null)}
            onHoverStart={() => setHoveredCard(card.id)}
            transition={{ type: "spring", stiffness: 300 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: (i: number) => ({ y: 0, opacity: 1, transition: { delay: 0.1 * i, duration: 0.5, ease: "easeOut" } })
            }}
          >
            <Card
              onClick={() => navigate(card.path)}
              className={cn("relative overflow-hidden h-72 cursor-pointer group",
                theme === 'dark' ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-gray-100',
                hoveredCard === card.id && "ring-2 ring-offset-2",
                hoveredCard === card.id && theme === 'dark'
                  ? "ring-offset-zinc-950 ring-blue-500"
                  : hoveredCard === card.id ? "ring-offset-white ring-blue-500" : ""
              )}
            >
              <div className={cn('absolute inset-0 opacity-90 transition-all duration-300 bg-gradient-to-br',
                hoveredCard === card.id ? 'opacity-100' : 'opacity-90',
                card.gradient
              )} />

              {/* Efecto de partículas al hacer hover */}
              {hoveredCard === card.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  className="absolute inset-0 z-0 overflow-hidden"
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        x: Math.random() * 100 - 50,
                        y: Math.random() * 100 - 50,
                        opacity: 0,
                        scale: 0
                      }}
                      animate={{
                        x: Math.random() * 200 - 100,
                        y: Math.random() * 200 - 100,
                        opacity: 0.7,
                        scale: Math.random() * 0.5 + 0.5
                      }}
                      transition={{
                        duration: Math.random() * 2 + 1,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse"
                      }}
                      className="absolute w-2 h-2 rounded-full bg-white"
                      style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Contenido principal */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
                <div className="flex items-center">
                  <card.icon className="h-10 w-10 mr-4" />
                  <h2 className="text-2xl font-bold">{card.title}</h2>
                </div>
                <div>
                  <p className="mb-4 opacity-90">
                    {card.description}
                  </p>
                  <div className={cn("flex items-center mt-2 transition-all duration-300", hoveredCard === card.id ? "translate-x-2" : "")}>
                    <span className="mr-2">Explorar {card.title.toLowerCase()}</span>
                    <ArrowRight className={cn(
                      "h-5 w-5 transition-transform duration-300",
                      hoveredCard === card.id && "animate-pulse"
                    )} />
                  </div>
                </div>
              </div>

              {/* Icono de fondo */}
              <div className={cn("absolute right-4 bottom-4 h-32 w-32 transition-all duration-300", hoveredCard === card.id ? "opacity-30 scale-110" : "opacity-20")}>
                <card.icon className="h-full w-full" />
              </div>

              {/* Badge con estadísticas */}
              <motion.div
                className={cn("absolute top-4 right-4 backdrop-blur-sm rounded-full px-3 py-1",
                  "text-white text-xs font-medium transition-all duration-300",
                  hoveredCard === card.id ? "bg-white/30" : "bg-white/20"
                )}
                transition={{ delay: 0.5 + (index * 0.1) }}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                {card.stats}
              </motion.div>

            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer con información de ayuda mejorado */}
      < motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className={cn("rounded-xl overflow-hidden",
          theme === 'dark' ? 'bg-zinc-900/70 text-gray-300' : 'bg-white text-gray-600'
        )}>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className={cn("p-6 flex flex-col justify-center",
            theme === 'dark' ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30' : 'bg-gradient-to-r from-blue-50 to-indigo-50'
          )}>
            <h3 className={cn("text-lg font-semibold mb-2",
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            )}>
              ¿Necesita ayuda?
            </h3>
            <p className="text-sm mb-4">
              Acceda a nuestra documentación completa y recursos de soporte
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn("px-4 py-2 rounded-lg text-white text-sm font-medium inline-flex items-center",
                theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              )}
            >
              <Info className="h-4 w-4 mr-2" />
              Ver guía de usuario
            </motion.button>
          </div>

          <div className="col-span-2 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className={cn("text-sm font-semibold mb-3",
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Recursos Populares
                </h4>
                <ul className="space-y-2">
                  {[
                    "Guía de mantenimiento preventivo",
                    "Catálogo de equipos médicos",
                    "Normativas y certificaciones",
                    "Preguntas frecuentes"
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + (i * 0.05) }}
                      className="text-sm flex items-center"
                    >
                      <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="hover:underline cursor-pointer">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className={cn("text-sm font-semibold mb-3",
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Contacto Rápido
                </h4>
                <ul className="space-y-2">
                  {[
                    "Soporte técnico 24/7",
                    "Solicitar capacitación",
                    "Reportar un problema",
                    "Agendar una demostración"
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + (i * 0.05) }}
                      className="text-sm flex items-center"
                    >
                      <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="hover:underline cursor-pointer">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div >
    </div >
  )
}

// Datos para las tarjetas
const cardData = (theme: ThemeContextProps['theme']) => [{
  id: "equipos",
  icon: Laptop,
  title: "Equipos",
  path: "/form/curriculum",
  stats: "32 equipos registrados",
  description: "Gestione y consulte información detallada sobre sus equipos médicos",
  gradient: theme === "dark" ? "from-purple-600 to-indigo-700" : "from-purple-500 to-indigo-600",
}, {
  icon: Wrench,
  id: "mantenimientos",
  title: "Mantenimientos",
  path: "/form/maintenance",
  stats: "8 mantenimientos pendientes",
  description: "Consulte el historial y programe nuevos mantenimientos para sus equipos",
  gradient: theme === "dark" ? "from-amber-600 to-orange-700" : "from-amber-500 to-orange-600",
}, {
  icon: Calendar,
  id: "cronogramas",
  title: "Cronogramas",
  path: "/form/schedule",
  stats: "Próximo: 12 de mayo",
  description: "Visualice y organice los cronogramas de mantenimiento preventivo",
  gradient: theme === "dark" ? "from-teal-600 to-emerald-700" : "from-teal-500 to-emerald-600",
}]