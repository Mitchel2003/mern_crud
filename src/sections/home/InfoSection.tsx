import { ThemeContextProps } from '@/interfaces/context.interface'
import CarouselInfo from '#/pages/home/CarouselInfo'

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
    image: 'assets/adds/flexible.jpeg',
    title: 'Bienvenido a nuestro app biomedica',
    description: 'Descubre una experiencia de gestión única',
  },
  {
    image: 'assets/adds/database.jpg',
    title: 'Red de datos en tiempo real',
    description: 'Accede a la información de manera inmediata',
  },
  {
    image: 'assets/adds/maintenance.png',
    title: 'Accede a novedades, formatos y consultas',
    description: 'Gestiona una amplia variedad de información de manera sencilla',
  },
]