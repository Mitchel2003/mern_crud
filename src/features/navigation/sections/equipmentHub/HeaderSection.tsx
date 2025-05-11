import { ThemeContextProps, Curriculum, User } from "@/interfaces/context.interface"
import { motion, useScroll, useTransform } from "framer-motion"
import { CrossIcon as MedicalCross, Verified } from "lucide-react"
import { useIsMobile } from "@/hooks/ui/use-mobile"
import { Badge } from "#/ui/badge"
import { cn } from "@/lib/utils"

export interface EquipmentHubHeaderProps extends ThemeContextProps {
  cv?: Curriculum
  user?: User
}

const EquipmentHubHeader = ({ cv, user, theme }: EquipmentHubHeaderProps) => {
  const { scrollY } = useScroll() // Animaciones basadas en scroll
  const isMobile = useIsMobile()

  const opacity = useTransform(scrollY, [0, 100], [1, 0.8])
  const scale = useTransform(scrollY, [0, 100], [1, 0.98])
  const y = useTransform(scrollY, [0, 100], [0, -10])

  const nameEquipToMobile = isMobile && cv?.name?.length && cv?.name?.length > 10 && !cv?.name?.includes(" ")
    ? `${cv?.name?.slice(0, 10)} ${cv?.name?.slice(10)}`
    : cv?.name

  const isDark = theme === "dark"
  const textColor = isDark ? "text-white" : "text-gray-800"
  const subtextColor = isDark ? "text-gray-300" : "text-gray-600"
  const bgColor = isDark ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" : "bg-gradient-to-r from-blue-50 via-white to-blue-50"
  return (
    <motion.header
      className={cn("relative rounded-xl shadow-lg overflow-hidden", bgColor)}
      style={{ opacity, scale, y }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={cn("absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10", isDark ? "bg-blue-400" : "bg-blue-500")}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
        />
        <motion.div
          className={cn("absolute left-1/4 bottom-0 w-32 h-32 rounded-full opacity-10", isDark ? "bg-teal-400" : "bg-teal-500")}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }}
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 px-6 py-10 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.div variants={itemVariants} className="flex items-center mb-4 md:mb-0">
            <motion.div
              className={cn("flex items-center justify-center w-12 h-12 rounded-full mr-4", isDark ? "bg-blue-600" : "bg-blue-500")}
              variants={iconVariants}
            >
              <MedicalCross className="text-white h-6 w-6" />
            </motion.div>

            <div className="flex flex-col">
              <h2 className={cn("text-xl font-semibold", textColor, isMobile ? "text-lg" : "")}>
                {cv?.office?.headquarter?.client?.username || user?.username}
              </h2>
              <div className="flex flex-row gap-2">
                {user && (
                  <Badge variant={isDark ? "secondary" : "default"} className="mt-1">
                    <Verified className="mr-2 h-4 w-4" />
                    Usuario verificado
                  </Badge>
                )}
                {cv && (
                  <Badge variant={isDark ? "secondary" : "default"} className="mt-1">
                    Equipo de clasificación {cv?.typeClassification}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="text-center mb-8">
          {cv && (
            <motion.h3
              className={cn("text-4xl md:text-5xl font-bold mb-3", textColor)}
              transition={{ delay: 0.3, duration: 0.5 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {nameEquipToMobile}
            </motion.h3>
          )}

          <motion.h5
            className={cn("text-2xl md:text-3xl font-semibold mb-3", textColor)}
            transition={{ delay: 0.3, duration: 0.5 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Centro de Recursos
          </motion.h5>
          <motion.p
            className={cn("text-lg max-w-3xl mx-auto", subtextColor)}
            transition={{ delay: 0.5, duration: 0.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Acceda a toda la información técnica de su equipo {cv?.typeClassification ?? ""}. Toda la documentación en un solo lugar disponible 24/7
          </motion.p>
        </motion.div>
      </div>

      {/* Barra de indicador */}
      <motion.div
        className={cn("h-1 w-full", isDark ? "bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600" : "bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500")}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
      />
    </motion.header>
  )
}

export default EquipmentHubHeader
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
// Variantes para animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
}

const iconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 30 } },
}