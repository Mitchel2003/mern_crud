import { FileText, Calendar, FileSpreadsheet, ShoppingBag } from 'lucide-react'
import CarouselInfo from '@/features/home/components/CarouselInfo'
import { useThemeContext } from '@/context/ThemeContext'
import { useAuthContext } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const HomePage = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { theme } = useThemeContext()
  const { isAuth } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => { if (isAuth) navigate('/dashboard') }, [isAuth])
  return (
    <>
      <CarouselInfo
        informations={heroItems}
        isLoading={false}
        theme={theme}
        error={null}
      />

      <section className={cn('py-16 bg-gradient-to-r', theme === 'dark'
        ? 'from-purple-950/50 to-pink-950/50'
        : 'from-purple-500 to-pink-500'
      )}>
        <div className="container mx-auto px-4">
          <h2 className={cn('text-4xl font-extrabold text-center mb-12', theme === 'dark' ? 'text-zinc-200' : 'text-white')}>
            ¡Nuestros servicios!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className={cn('p-6 rounded-lg shadow-lg cursor-pointer',
                  'flex flex-col items-center justify-center md:items-start',
                  theme === 'dark' ? 'bg-zinc-800' : 'bg-white'
                )}
              >
                <feature.icon className="mb-4 w-14 h-14 text-purple-500" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className={cn(theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                  {feature.description}
                </p>
                {hoveredIndex === index && (
                  <motion.div
                    className="mt-4 h-1 bg-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
interface Feature {
  title: string,
  description: string,
  icon: React.ForwardRefExoticComponent<any>
}

const features: Feature[] = [
  { icon: ShoppingBag, title: 'Almacenamiento', description: 'Almacena formatos de manera segura' },
  { icon: FileSpreadsheet, title: 'Presentaciones', description: 'Accede a hojas de vida y entregables para auditorias' },
  { icon: Calendar, title: 'Administración', description: 'Gestiona equipos biomédicos con nuestro sistema de calendarios' },
  { icon: FileText, title: 'Documentación', description: 'Genera informes y accede a ellos de manera flexible' },
]

export const heroItems = [
  {
    image: 'assets/adds/gestion.png',
    title: 'Bienvenido a ingenierías GEST',
    description: 'Descubre una experiencia de administración única',
  },
  {
    image: 'assets/adds/avaliable.jpg',
    title: 'Red de datos en tiempo real',
    description: 'Obtén información de manera inmediata 24/7',
  },
  {
    image: 'assets/adds/flexible.jpeg',
    title: 'Accede desde cualquier sitio',
    description: 'Opera cómodamente desde móvil, tablet o computadora',
  }
]