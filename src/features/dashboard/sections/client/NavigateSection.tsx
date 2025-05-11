import { ThemeContextProps } from "@/interfaces/context.interface"
import { FileText, ArrowRight, QrCode } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card } from "#/ui/card"
import { cn } from "@/lib/utils"

interface NavigateSectionProps extends ThemeContextProps { }
const NavigateSection = ({ theme }: NavigateSectionProps) => {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Card para Ver Documentos */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card
          onClick={() => { navigate('/equipment') }}
          className={cn("relative overflow-hidden h-64 cursor-pointer group", theme === 'dark' ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-gray-100')}
        >
          <div className={cn(
            'absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity bg-gradient-to-br',
            theme === 'dark' ? 'from-cyan-600 to-blue-700' : 'from-cyan-500 to-blue-600'
          )} />
          <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
            <div className="flex items-center">
              <FileText className="h-10 w-10 mr-4" />
              <h2 className="text-2xl font-bold">Ver Documentos</h2>
            </div>
            <div>
              <p className="mb-4 opacity-90">
                Acceda a manuales, certificados y documentación técnica de sus equipos médicos
              </p>
              <div className="flex items-center mt-2 group-hover:translate-x-2 transition-transform">
                <span className="mr-2">Explorar documentos</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 h-32 w-32 opacity-20 group-hover:opacity-30 transition-opacity">
            <FileText className="h-full w-full" />
          </div>
        </Card>
      </motion.div>

      {/* Card para Crear Solicitud */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card
          onClick={() => { navigate('/scanner') }}
          className={cn("relative overflow-hidden h-64 cursor-pointer group", theme === 'dark' ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-gray-100')}
        >
          <div className={cn(
            'absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity bg-gradient-to-br',
            theme === 'dark' ? 'from-emerald-600 to-green-700' : 'from-emerald-500 to-green-600'
          )} />
          <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
            <div className="flex items-center">
              <QrCode className="h-10 w-10 mr-4" />
              <h2 className="text-2xl font-bold">Escaneo QR</h2>
            </div>
            <div>
              <p className="mb-4 opacity-90">
                Escanee el código QR de su equipo para acceder a su documentación, mantenimientos y demás
              </p>
              <div className="flex items-center mt-2 group-hover:translate-x-2 transition-transform">
                <span className="mr-2">Escanear código QR</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 h-32 w-32 opacity-20 group-hover:opacity-30 transition-opacity">
            <QrCode className="h-full w-full" />
          </div>
          <motion.div
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Rápido y fácil
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}

export default NavigateSection