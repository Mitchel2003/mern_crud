import { ThemeContextProps } from '@/interfaces/context.interface'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '#/ui/button'
import { Card } from '#/ui/card'

const Unauthorized = ({ theme }: ThemeContextProps) => {
  const navigate = useNavigate()
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`max-w-md w-full p-8 shadow-xl ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white'}`}>
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto"
            >
              <div className={`mx-auto rounded-full p-3 ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100'}`}>
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
            </motion.div>

            <div className="space-y-2">
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Acceso no autorizado</h1>
              <p className={`${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                No tienes los permisos necesarios para acceder a esta sección. Por favor, contacta con el administrador si crees que esto es un error.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                onClick={() => navigate('/')}
                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Home className="h-4 w-4" />
                Volver al inicio
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className={`w-full gap-2 ${theme === 'dark' ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700'}`}
              >
                <ArrowLeft className="h-4 w-4" />
                Regresar
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Unauthorized