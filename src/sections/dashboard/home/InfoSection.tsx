import { ThemeContextProps } from '@/interfaces/context.interface'
import CarouselInfo from '@/components/pages/dashboard/home/CarouselInfo'

const InfoSection = ({ theme }: ThemeContextProps) => (
  <CarouselInfo
    informations={heroItems}
    isLoading={false}
    theme={theme}
    error={null}
  />
)

export default InfoSection

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