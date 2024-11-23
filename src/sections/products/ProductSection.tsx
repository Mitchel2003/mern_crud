import { ThemeContextProps } from '@/interfaces/context.interface'
import { CarouselProducts } from './CarouselSection'
import { FeaturesSection } from './FeaturesSection'

const ProductSection = ({ theme }: ThemeContextProps) => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <FeaturesSection theme={theme} />

      <CarouselProducts
        title="¡Novedad para ti!"
        products={products.newProducts}
      />

      <CarouselProducts
        title="Más vendidos"
        products={products.bestSellers}
      />
    </div>
  )
}

export default ProductSection


const products = {
  newProducts: [
    {
      id: '1',
      rating: 4,
      isNew: false,
      discount: 15,
      price: 19990,
      category: 'Culinary',
      name: 'Galletas artesanales',
      image: '/assets/products/galletas.jpeg',
    },
    {
      id: '2',
      rating: 4,
      isNew: true,
      discount: 15,
      price: 14990,
      category: 'Culinary',
      name: 'Miel de abeja',
      image: '/assets/products/miel.jpg',
    },
    {
      id: '3',
      rating: 4,
      isNew: true,
      discount: 25,
      price: 89990,
      category: 'Clothing',
      name: 'Buso de lana',
      image: '/assets/products/buso.jpg',
    },
    {
      id: '4',
      rating: 5,
      isNew: true,
      discount: 10,
      price: 4990,
      category: 'Food',
      name: 'Pan industrial',
      image: '/assets/products/pan.jpg',
    },
    {
      id: '5',
      rating: 4,
      isNew: false,
      discount: 10,
      price: 29990,
      category: 'Food',
      name: 'Vino artesanal',
      image: '/assets/products/vino.jpg',
    },
    {
      id: '6',
      rating: 4,
      isNew: true,
      discount: 10,
      price: 14990,
      category: 'Food',
      name: 'Galletas de vainilla',
      image: '/assets/products/galletas_2.jpg',
    }
  ],
  bestSellers: [
    {
      id: '1',
      rating: 4,
      price: 19990,
      isBestSeller: true,
      category: 'Culinary',
      name: 'Galletas artesanales',
      image: '/assets/products/galletas.jpeg',
    },
    {
      id: '2',
      rating: 5,
      price: 14990,
      isBestSeller: true,
      category: 'Culinary',
      name: 'Galletas de vainilla',
      image: '/assets/products/galletas_2.jpg',
    }
  ]
}