import { ThemeContextProps } from "@/interfaces/context.interface"
import { Home, ArrowLeft, FileQuestion } from "lucide-react"
import { motion, useAnimation } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Button } from "#/ui/button"
import { useEffect } from "react"
import { Card } from "#/ui/card"
import { cn } from "@/lib/utils"

interface NotFoundProps extends ThemeContextProps { }

const NotFound = ({ theme }: NotFoundProps) => {
  const controls = useAnimation()
  const navigate = useNavigate()
  const isDark = theme === "dark"

  useEffect(() => { // Animación de los números 404
    const sequence = async () => await controls.start({ y: [0, -15, 0], transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeInOut" } })
    sequence()
  }, [controls])

  return (
    <div className={cn("min-h-screen flex items-center justify-center p-4 relative overflow-hidden", isDark ? "bg-zinc-900/90" : "bg-zinc-50/90")}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-xl"
      >
        <Card className={cn("w-full p-8 shadow-2xl backdrop-blur-sm", isDark ? "bg-zinc-800/90 border-zinc-700" : "bg-white/90 border-zinc-200")}>
          <div className="text-center space-y-8">
            {/* Icono animado */}
            <motion.div
              className="mx-auto"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
            >
              <div className={cn("mx-auto rounded-full p-5", isDark ? "bg-blue-900/20" : "bg-blue-300/50")}>
                <FileQuestion className={cn("h-14 w-14", isDark ? "text-blue-400" : "text-blue-600")} />
              </div>
            </motion.div>

            {/* Números 404 animados */}
            <div className="flex justify-center items-center gap-4 py-4">
              {[4, 0, 4].map((num, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  animate={controls}
                  transition={{ delay: index * 0.2 }}
                  className={cn("text-7xl md:text-8xl font-bold relative", isDark ? "text-zinc-100" : "text-zinc-800")}
                >
                  {num}
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "80%" }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                    className={cn("absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 rounded-full", isDark ? "bg-blue-500" : "bg-blue-600")}
                  />
                </motion.div>
              ))}
            </div>

            {/* Texto */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h1 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-zinc-900")}>
                Recurso no encontrado
              </h1>
              <p className={cn("text-base md:text-lg", isDark ? "text-zinc-400" : "text-zinc-600")}>
                Lo sentimos, no pudimos encontrar la página o recurso que estás buscando. Es posible que haya sido
                movido, eliminado o nunca haya existido.
              </p>
            </motion.div>

            {/* Botones de navegación */}
            <motion.div
              className="pt-4 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Button
                onClick={() => navigate("/")}
                className={cn("w-full gap-2 text-white py-6",
                  "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                  "shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                )}
              >
                <Home className="h-4 w-4" />
                Volver al inicio
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className={cn("w-full gap-2 py-6 transition-all duration-300 hover:-translate-y-1", isDark
                  ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600"
                  : "border-zinc-300 text-zinc-700 hover:bg-zinc-100",
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                Regresar a la página anterior
              </Button>
            </motion.div>
          </div>
        </Card>

        {/* Mensaje de ayuda */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className={cn("text-center mt-6 text-sm", isDark ? "text-zinc-500" : "text-zinc-600")}
        >
          Si necesitas ayuda, por favor contacta con nuestro equipo de soporte
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound