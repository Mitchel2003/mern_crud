import { Home, LogIn, UserPlus, FileTextIcon, FilesIcon } from 'lucide-react'
import { NavItemProps } from "@/interfaces/props.interface"

export const heroItems = [
  {
    image: 'assets/adds/parqueOca.jpg',
    title: 'Bienvenido a nuestro app de gestión',
    description: 'Descubre una experiencia de administración única',
  },
  {
    image: 'assets/adds/comercio.jpg',
    title: 'Grandes marcas, grandes ofertas',
    description: 'Disfruta de tus tiendas favoritas y precios competitivos',
  },
  {
    image: 'assets/adds/variedad.jpg',
    title: 'Variedad de productos, ¡Solo aquí!',
    description: 'Encuentra una amplia variedad de productos en un solo lugar',
  },
  {
    image: 'assets/adds/emprendedor.jpg',
    title: 'Apoya nuestros emprendedores',
    description: 'Encuentra productos únicos y originales, creados en nuestra región',
  },
]

export const navItems: NavItemProps[] = [
  {
    href: '/',
    label: 'Home',
    icon: <Home className="w-5 h-5" />
  },
  {
    href: '/auth/login',
    label: 'Iniciar sesión',
    icon: <LogIn className="w-5 h-5" />
  },
  {
    href: '/auth/register',
    label: 'Registrarse',
    icon: <UserPlus className="w-5 h-5" />
  },
  {
    href: '/form/cv/new',
    label: 'Crear curriculum',
    icon: <FilesIcon className="w-5 h-5" />
  },
  {
    href: '/form/maintenance/new',
    label: 'Crear mantenimiento',
    icon: <FileTextIcon className="w-5 h-5" />
  }
]