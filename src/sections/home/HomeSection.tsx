import { ThemeContextProps } from '@/interfaces/context.interface'
import { Store } from '@/types/form/home.type'

import DiscoverSection from './DiscoverSection'
import StoreSection from './StoreSection'
import InfoSection from './InfoSection'

const HomeSection = ({ theme }: ThemeContextProps) => {
  return (
    <div>
      <InfoSection theme={theme} />
      <DiscoverSection theme={theme} />
      <StoreSection stores={stores} theme={theme} />
    </div>
  )
}

export default HomeSection

const stores: Store[] = [
  {
    id: 1,
    name: 'Anita',
    category: 'Perfumería',
    description: 'Encuentra lo último en perfumes y cosméticos, ¡Solo aquí! Una gran variedad de productos hechos para tí.',
    image: 'assets/shops/emprendedor_1.png',
    location: 'La primavera - Cra 10 # 10 - 10',
    isLocal: true,
  },
  {
    id: 2,
    name: 'Calzado Bucaramanga',
    category: 'Tiendas de calzado',
    description: 'Encuentra lo último en calzado para tí.',
    image: 'assets/shops/emprendedor_2.jpg',
    location: 'Centro - Cra 20 # 15 - 72',
    isLocal: false
  },
  {
    id: 3,
    name: 'Esencias de maria',
    category: 'Artesanías y presentaciones de regalos',
    description: 'Descubre todo lo que necesitas para tus regalos, sorprende a tu pareja, familia y amigos con productos únicos.',
    image: 'assets/shops/emprendedor_3.jpg',
    location: 'Plaza de toros - Cra 20 # 15 - 72',
    isLocal: true
  }
]