import { Home, LogIn, UserPlus, FileTextIcon, FilesIcon, LogOut, TerminalSquare, Info, FilePlus } from 'lucide-react'
import { NavItemProps } from "@/interfaces/props.interface"
import { useAuthContext } from '@/context/AuthContext'

export const useNavItems = () => {
  const { logout } = useAuthContext()

  const navGuestItems: NavItemProps[] = [
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
      href: '/about',
      label: 'Acerca de nosotros',
      icon: <Info className="w-5 h-5" />
    }
  ]

  const navUserItems: NavItemProps[] = [
    {
      href: '/dashboard',
      label: 'Panel del usuario',
      icon: <TerminalSquare className="w-6 h-6" />
    },
    {
      label: 'Curriculum',
      icon: <FilesIcon className="w-6 h-6" />,
      subItems: [
        {
          href: '/form/cvs',
          label: 'Ver todos',
          icon: <FileTextIcon className="w-5 h-5" />
        },
        {
          href: '/form/cv/new',
          label: 'Crear nuevo',
          icon: <FilePlus className="w-5 h-5" />
        }
      ]
    },
    {
      href: '/form/maintenance/new',
      label: 'Crear mantenimiento',
      icon: <FileTextIcon className="w-6 h-6" />
    },
    {
      action: logout,
      label: 'Cerrar sesión',
      icon: <LogOut className="w-6 h-6" />,
    }
  ]

  return { navUserItems, navGuestItems }
}