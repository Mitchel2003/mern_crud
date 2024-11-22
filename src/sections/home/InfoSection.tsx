import { ThemeContextProps } from '@/interfaces/context.interface'
import CarouselInfo from '#/home/CarouselInfo'

const InfoSection = ({ theme }: ThemeContextProps) => {
  return (
    <CarouselInfo
      informations={heroItems}
      isLoading={false}
      theme={theme}
      error={null}
    />
  )
}

export default InfoSection

export const heroItems = [
  {
    image: 'assets/adds/parqueOca.jpg',
    title: 'Bienvenido a nuestro app biomedica',
    description: 'Descubre una experiencia de gestión única',
  },
  {
    image: 'assets/adds/flexible.jpeg',
    title: 'Disponibilidad de información desde cualquier lugar',
    description: 'Puedes operar desde cualquier dispositivo, ya sea móvil o computadora',
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
