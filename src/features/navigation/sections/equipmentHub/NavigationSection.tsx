import { ArrowRight, Calendar, HandPlatterIcon, Laptop, Wrench, BookDownIcon } from "lucide-react"
import { Curriculum, ThemeContextProps } from "@/interfaces/context.interface"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { encodeQueryParams } from "@/lib/query"
import { useNavigate } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "#/ui/card"
import { cn } from "@/lib/utils"

export interface NavigationSectionProps extends ThemeContextProps {
  setOpen: (open: boolean) => void
  cv?: Curriculum
  auth?: boolean
}

const NavigationSection = ({ cv, auth, theme, setOpen }: NavigationSectionProps) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const cronogramasCardRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  return (
    <div className={cn("grid gap-4", auth ? (!cv ? "md:grid-cols-3" : "md:grid-cols-2") : "md:grid-cols-1")}>
      {cardData({ cv, auth, theme }).map((card, index) => (
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
          ref={card.id === "cronogramas" ? cronogramasCardRef : null}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ y: 0, opacity: 1, transition: { delay: 0.1 * i, duration: 0.5, ease: "easeOut" } }) }}
        >
          <Card
            onClick={() => { if (card.id === "cronogramas") setOpen(true); else navigate(card.path) }}
            className={cn(`relative overflow-hidden ${isMobile ? 'h-48' : 'h-60'} cursor-pointer group`, theme === "dark"
              ? "bg-zinc-950 border-zinc-700" : "bg-white border-gray-100",
              hoveredCard === card.id && "ring-2 ring-offset-2",
              hoveredCard === card.id && theme === "dark"
                ? "ring-offset-zinc-950 ring-blue-500"
                : hoveredCard === card.id
                  ? "ring-offset-white ring-blue-500"
                  : ""
            )}
          >
            <div className={cn("absolute inset-0 opacity-90 transition-all duration-300 bg-gradient-to-br",
              hoveredCard === card.id ? "opacity-100" : "opacity-90",
              card.gradient
            )} />

            {/* Efecto de partículas al hacer hover */}
            {hoveredCard === card.id && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} className="absolute inset-0 z-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white"
                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    initial={{ x: Math.random() * 100 - 50, y: Math.random() * 100 - 50, opacity: 0, scale: 0 }}
                    transition={{ duration: Math.random() * 2 + 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    animate={{ x: Math.random() * 200 - 100, y: Math.random() * 200 - 100, opacity: 0.7, scale: Math.random() * 0.5 + 0.5 }}
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
                <p className="mb-4 opacity-90">{card.description}</p>
                <div className={cn("flex items-center mt-2 transition-all duration-300", hoveredCard === card.id ? "translate-x-2" : "")}>
                  <span className="mr-2"> {card.id === "cronogramas" ? "Seleccionar tipo" : `Explorar ${card.title.toLowerCase()}`} </span>
                  <ArrowRight className={cn("h-5 w-5 transition-transform duration-300", hoveredCard === card.id && "animate-pulse")} />
                </div>
              </div>
            </div>

            {/* Icono de fondo */}
            <div className={cn("absolute right-4 bottom-4 h-32 w-32 transition-all duration-300", hoveredCard === card.id ? "opacity-30 scale-110" : "opacity-20")}>
              <card.icon className="h-full w-full" />
            </div>

            {/* Badge con estadísticas */}
            <motion.div
              hidden={isMobile}
              animate={{ x: 0, opacity: 1 }}
              initial={{ x: 20, opacity: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={cn("absolute top-4 right-4 backdrop-blur-sm rounded-full px-3 py-1",
                "text-white text-xs font-medium transition-all duration-300",
                hoveredCard === card.id ? "bg-white/30" : "bg-white/20",
              )}
            >
              {card.alert}
            </motion.div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default NavigationSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface CardData {
  description: string
  icon: LucideIcon
  gradient: string
  title: string
  alert: string
  path: string
  id: string
}

interface CardDataProps extends ThemeContextProps { cv?: Curriculum; auth?: boolean }

/**
 * Funcion que retorna un array de cards condicionales, en donde el determinante es el param de cv
 * @param cv Curriculum - Se espera que sea valido cuando se trate de un scaneo de QR de un equipo
 * @returns CardData[] - Array de cards condicionales
 */
const cardData = ({ cv, auth, theme }: CardDataProps): CardData[] => {
  const publicCards: CardData[] = [{
    id: "preview",
    icon: BookDownIcon,
    title: "Hoja de vida",
    alert: "Informacion del equipo",
    path: `/form/curriculum/preview/${cv?._id}`,
    gradient: theme === "dark" ? "from-blue-600 to-blue-700" : "from-blue-500 to-blue-600",
    description: `Consulte información detallada sobre su equipo de ${cv?.typeClassification}; Contiene manuales, mantenimientos, entre otros`,
  }]

  const arrayDefault: CardData[] = [{
    id: "equipos",
    icon: Laptop,
    title: "Equipos",
    alert: "Equipos de computo, biomedicos etc",
    description: "Consulte información detallada sobre sus equipos",
    gradient: theme === "dark" ? "from-purple-600 to-indigo-700" : "from-purple-500 to-indigo-600",
    path: cv?._id ? `/form/curriculum/${encodeQueryParams({ modelEquip: cv?.modelEquip })}` : "/form/curriculums",
  }, {
    icon: Wrench,
    id: "mantenimientos",
    title: "Mantenimientos",
    alert: "Preventivos y correctivos",
    description: "Consulte el historial de mantenimiento de sus equipos",
    gradient: theme === "dark" ? "from-amber-600 to-orange-700" : "from-amber-500 to-orange-600",
    path: cv?._id ? `/form/maintenance/${encodeQueryParams({ modelEquip: cv?.modelEquip })}` : "/form/maintenances",
  }, {
    icon: Calendar,
    id: "cronogramas",
    title: "Cronogramas",
    path: "/form/schedule",
    alert: "Mantenimiento, capacitaciones y asistencias",
    description: "Visualice los diferentes cronogramas disponibles",
    gradient: theme === "dark" ? "from-teal-600 to-emerald-700" : "from-teal-500 to-emerald-600",
  }]

  auth && cv && arrayDefault.unshift({
    id: "solicitudes",
    title: "Solicitudes",
    icon: HandPlatterIcon,
    path: `/form/solicit/${cv?._id}`,
    alert: "Para toda clase de solicitudes",
    gradient: theme === "dark" ? "from-blue-600 to-indigo-700" : "from-blue-500 to-indigo-600",
    description: "Genera solicitud para este equipo, puede ser una atencion prioritaria o revision preventiva",
  })

  return auth ? arrayDefault : publicCards
}