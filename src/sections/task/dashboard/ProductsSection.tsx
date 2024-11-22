import { ThemeContextProps } from '@/interfaces/context.interface'
import CarouselProduct from '#/task/dashboard/CarouselProduct'
import { motion, Variants } from 'framer-motion'
import { PlusCircle } from 'lucide-react'
import { Button } from '#/ui/button'
import { cn } from '@/lib/utils'

interface ProductsSectionProps extends ThemeContextProps { variants: Variants }

const ProductsSection = ({ theme, variants }: ProductsSectionProps) => {
  return (
    <section
      className={cn(
        'py-12 px-8 bg-gradient-to-bl',
        theme === 'dark'
          ? 'from-zinc-950/80 to-purple-950/80'
          : 'from-purple-500/10 to-pink-500/10'
      )}
    >
      <motion.section
        variants={variants}
        className="space-y-6"
      >
        <Header theme={theme} />
        <CarouselProduct
          products={products.newProducts}
          isLoading={false}
          theme={theme}
          error={null}
        />
      </motion.section>
    </section>
  )
}

export default ProductsSection

const Header = ({ theme }: ThemeContextProps) => (
  <div className="flex justify-between items-center">
    <h2 className={cn(
      'text-3xl font-bold',
      theme === 'dark' ? 'text-white' : 'text-gray-900'
    )}> Tus Productos </h2>

    <Button variant="outline">
      <PlusCircle className="mr-2 h-4 w-4" />
      Añadir Producto
    </Button>
  </div>
)

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
  ]
}