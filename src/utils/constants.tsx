import { LucideHandHelping, LocateFixedIcon, TerminalSquare, FileStackIcon, FileTextIcon, UserCircle, FilesIcon, Building2, UserPlus, UserCog2, Building, MapPin, LogOut, LogIn, Info, Flag, Home } from 'lucide-react'
import { NavItemProps } from "@/interfaces/props.interface"
import { useAuthContext } from '@/context/AuthContext'

export const links = () => {
  const { isAuth, user, logout } = useAuthContext()

  /*--------------------------------------------------guest--------------------------------------------------*/
  const navGuestItems: NavItemProps[] = [
    {/** home **/
      href: '/',
      label: 'Home',
      icon: Home
    },
    {/** login **/
      href: '/auth/login',
      label: 'Iniciar sesión',
      icon: LogIn
    },
    {/** register **/
      href: '/auth/register',
      label: 'Registrarse',
      icon: UserPlus
    },
    {/** about **/
      href: '/about',
      label: 'Acerca de nosotros',
      icon: Info
    }
  ]
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------engineer--------------------------------------------------*/
  const navEngineerItems: NavItemProps[] = [
    {/** dashboard **/
      href: '/dashboard',
      label: 'Panel del usuario',
      icon: TerminalSquare
    },
    {/** logout **/
      action: logout,
      label: 'Cerrar sesión',
      icon: LogOut,
    }
  ]
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------medical--------------------------------------------------*/
  const navMedicalItems: NavItemProps[] = [
    {/** dashboard **/
      href: '/dashboard',
      label: 'Panel del usuario',
      icon: TerminalSquare
    },
    {/** logout **/
      action: logout,
      label: 'Cerrar sesión',
      icon: LogOut,
    }
  ]
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------admin--------------------------------------------------*/
  const navAdminItems: NavItemProps[] = [
    {/** dashboard **/
      href: '/dashboard',
      icon: TerminalSquare,
      label: 'Panel del usuario',
    },
    {/** cvs **/
      icon: FilesIcon,
      href: '/form/cv',
      label: 'Currículums',
    },
    {/** maintenances **/
      icon: FileTextIcon,
      label: 'Mantenimientos',
      href: '/form/maintenance',
    },
    {/** users **/
      label: 'Usuarios',
      icon: UserCircle,
      subItems: [
        {// engineers
          href: '/users/engineer',
          icon: UserCog2,
          label: 'Ingenieros',
        },
        {// clients
          icon: Building2,
          href: '/users/client',
          label: 'Clientes',
        }
      ]
    },
    {/** institution **/
      label: 'Institución',
      icon: Building,
      subItems: [
        {// headquarters
          label: 'Sedes',
          icon: FileStackIcon,
          href: '/location/headquarter',
        },
        {// areas
          label: 'Areas',
          icon: FileStackIcon,
          href: '/location/area',
        },
        {// offices
          icon: Building2,
          label: 'Consultorios',
          href: '/location/office',
        },
        {// services
          label: 'Servicios',
          icon: LucideHandHelping,
          href: '/location/service',
        }
      ]
    },
    {/** locations **/
      label: 'Ubicaciones',
      icon: MapPin,
      subItems: [
        {// cities
          label: 'Ciudades',
          icon: LocateFixedIcon,
          href: '/location/city',
        },
        {// departments
          icon: MapPin,
          label: 'Departamentos',
          href: '/location/department',
        },
        {// countries
          icon: Flag,
          label: 'Países',
          href: '/location/country',
        }
      ]
    },
    {
      action: logout,
      label: 'Cerrar sesión',
      icon: LogOut,
    }
  ]
  /*---------------------------------------------------------------------------------------------------------*/

  return !isAuth ? navGuestItems : (
    user?.role === 'admin' ? navAdminItems : (user?.role === 'medical' ? navMedicalItems : navEngineerItems)
  )
}